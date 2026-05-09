import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../contexts/AuthContext';

export function useChat(taskId) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch initial messages
  const fetchMessages = useCallback(async () => {
    if (!taskId) return;
    setLoading(true);

    if ("Notification" in window && Notification.permission !== "denied" && Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    const { data, error } = await supabase
      .from('task_messages')
      .select(`
        id,
        message,
        created_at,
        sender_id,
        is_read,
        sender:profiles!task_messages_sender_id_fkey(full_name, email)
      `)
      .eq('task_id', taskId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
    } else {
      setMessages(data || []);
      // Automatically mark unread messages as read
      const unreadIds = data
        .filter(m => m.sender_id !== user?.id && m.is_read === false)
        .map(m => m.id);
        
      if (unreadIds.length > 0) {
        supabase.from('task_messages')
          .update({ is_read: true })
          .in('id', unreadIds)
          .then(); // fire and forget
      }
    }
    setLoading(false);
  }, [taskId, user?.id]);

  useEffect(() => {
    fetchMessages();

    if (!taskId) return;

    // Subscribe to new messages
    const channel = supabase
      .channel(`chat-${taskId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'task_messages',
          filter: `task_id=eq.${taskId}`
        },
        async (payload) => {
          // Fetch the sender details for the new message
          const { data: senderData } = await supabase
            .from('profiles')
            .select('full_name, email')
            .eq('id', payload.new.sender_id)
            .single();

          const newMessage = {
            ...payload.new,
            sender: senderData || { full_name: 'Unknown', email: '' }
          };

          setMessages((prev) => {
            // Check if we sent this message and have an optimistic placeholder
            const isOurMessage = payload.new.sender_id === user?.id;
            
            if (isOurMessage) {
              // Find the oldest optimistic message with the same text
              const index = prev.findIndex(m => m.isOptimistic && m.message === newMessage.message);
              if (index !== -1) {
                // Replace the optimistic message with the real one from the server
                const updated = [...prev];
                updated[index] = newMessage;
                return updated;
              }
            }
            
            // Prevent duplicate delivery if already in state
            if (prev.some(m => m.id === newMessage.id)) return prev;

            if (!isOurMessage && "Notification" in window && Notification.permission === "granted") {
              // Only notify if we aren't already looking at it, but since we are in this chat, we probably are.
              // Actually, if we receive it while in the chat, we shouldn't notify, we should just mark it as read!
              if (document.visibilityState !== 'visible') {
                new Notification(`New message from ${newMessage.sender.full_name}`, {
                  body: newMessage.message
                });
              } else {
                // We are looking at the chat, mark as read immediately
                supabase.from('task_messages')
                  .update({ is_read: true })
                  .eq('id', newMessage.id)
                  .then();
                newMessage.is_read = true;
              }
            }

            return [...prev, newMessage];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [taskId, fetchMessages, user?.id]);

  const sendMessage = async (text) => {
    if (!text.trim() || !user || !taskId) return;

    // Optimistic UI update
    const optimisticMessage = {
      id: `temp-${Date.now()}`,
      message: text,
      created_at: new Date().toISOString(),
      sender_id: user.id,
      sender: {
        full_name: user.user_metadata?.full_name || 'You',
        email: user.email
      },
      isOptimistic: true
    };
    
    setMessages((prev) => [...prev, optimisticMessage]);

    const { error } = await supabase
      .from('task_messages')
      .insert([
        {
          task_id: taskId,
          sender_id: user.id,
          message: text,
        }
      ]);

    if (error) {
      console.error('Error sending message:', error);
      // Revert optimistic message on failure
      setMessages((prev) => prev.filter((m) => m.id !== optimisticMessage.id));
    }
  };

  return { messages, loading, sendMessage, user };
}
