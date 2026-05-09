import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../contexts/AuthContext';

export function useUnreadMessages() {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) {
      setUnreadCount(0);
      return;
    }

    const fetchUnreadCount = async () => {
      // Find all tasks where user is client or freelancer
      const { data: myTasks } = await supabase
        .from('tasks')
        .select('id')
        .or(`client_id.eq.${user.id},freelancer_id.eq.${user.id}`);

      if (!myTasks || myTasks.length === 0) return;

      const taskIds = myTasks.map(t => t.id);

      // Count unread messages in these tasks where sender is NOT the user
      const { count, error } = await supabase
        .from('task_messages')
        .select('id', { count: 'exact', head: true })
        .in('task_id', taskIds)
        .neq('sender_id', user.id)
        .eq('is_read', false);

      if (!error && count !== null) {
        setUnreadCount(count);
      }
    };

    fetchUnreadCount();

    // Subscribe to new messages that are not sent by the user
    const channel = supabase
      .channel(`global-unread-messages-${Math.random()}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'task_messages' },
        (payload) => {
          if (payload.new.sender_id !== user.id) {
            // Re-fetch to be safe and ensure the message belongs to a task we are part of
            fetchUnreadCount();
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'task_messages' },
        (payload) => {
          if (payload.new.is_read === true && payload.old.is_read === false) {
             fetchUnreadCount();
          }
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [user]);

  return unreadCount;
}
