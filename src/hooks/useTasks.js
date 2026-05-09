import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../contexts/AuthContext';

/**
 * Custom hook for real-time task management.
 * Handles fetching, real-time subscriptions, and atomic task acceptance.
 */
export function useTasks(filter = 'open') {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch tasks from Supabase
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);

    let query = supabase
      .from('tasks')
      .select(`
        *,
        client:profiles!tasks_client_id_fkey(full_name, email),
        freelancer:profiles!tasks_freelancer_id_fkey(full_name, email)
      `)
      .order('created_at', { ascending: false });

    // Apply filter
    if (filter === 'open') {
      query = query.eq('status', 'open');
    } else if (filter === 'my_tasks' && user) {
      query = query.eq('freelancer_id', user.id);
    } else if (filter === 'my_posted' && user) {
      query = query.eq('client_id', user.id);
    } else if (filter === 'my_engagements' && user) {
      query = query.or(`client_id.eq.${user.id},freelancer_id.eq.${user.id}`).neq('status', 'open');
    }

    const { data, error: fetchError } = await query;

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setTasks(data || []);
    }
    setLoading(false);
  }, [filter, user]);

  // Subscribe to real-time changes
  useEffect(() => {
    fetchTasks();

    // Set up real-time subscription
    const channel = supabase
      .channel('tasks-realtime')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'tasks',
        },
        (payload) => {
          const { eventType, new: newRecord, old: oldRecord } = payload;

          setTasks((prevTasks) => {
            if (eventType === 'INSERT') {
              // Only add if it matches our filter
              if (filter === 'open' && newRecord.status === 'open') {
                return [newRecord, ...prevTasks];
              }
              if (filter === 'my_tasks' && newRecord.freelancer_id === user?.id) {
                return [newRecord, ...prevTasks];
              }
              if (filter === 'my_posted' && newRecord.client_id === user?.id) {
                return [newRecord, ...prevTasks];
              }
              if (filter === 'my_engagements' && newRecord.status !== 'open' && (newRecord.client_id === user?.id || newRecord.freelancer_id === user?.id)) {
                return [newRecord, ...prevTasks];
              }
              return prevTasks;
            }

            if (eventType === 'UPDATE') {
              // If a task was accepted (status changed from 'open'),
              // remove it from the 'open' feed
              if (filter === 'open' && newRecord.status !== 'open') {
                return prevTasks.filter((t) => t.id !== newRecord.id);
              }
              // Otherwise update in place
              return prevTasks.map((t) =>
                t.id === newRecord.id ? { ...t, ...newRecord } : t
              );
            }

            if (eventType === 'DELETE') {
              return prevTasks.filter((t) => t.id !== oldRecord.id);
            }

            return prevTasks;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchTasks, filter, user]);

  // Accept a task atomically
  const acceptTask = useCallback(
    async (taskId) => {
      if (!user) {
        return { success: false, error: 'You must be logged in to accept a task.' };
      }

      // Optimistic UI: immediately mark the task as accepted locally
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? { ...t, status: 'in_progress', freelancer_id: user.id, _accepting: false }
            : t
        )
      );

      // Call the atomic database function
      const { data, error: rpcError } = await supabase.rpc('accept_task', {
        task_id: taskId,
        freelancer: user.id,
      });

      if (rpcError) {
        // Revert optimistic update
        await fetchTasks();
        return { success: false, error: rpcError.message };
      }

      if (data === false) {
        // Another freelancer accepted it first — revert
        await fetchTasks();
        return {
          success: false,
          error: 'This task has already been accepted by another freelancer.',
        };
      }

      return { success: true };
    },
    [user, fetchTasks]
  );

  return { tasks, loading, error, acceptTask, refetch: fetchTasks };
}
