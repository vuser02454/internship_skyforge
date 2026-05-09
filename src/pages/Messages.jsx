import React, { useState, useEffect } from 'react';
import { useTasks } from '../hooks/useTasks';
import { useChat } from '../hooks/useChat';
import { useAuth } from '../contexts/AuthContext';

export default function Messages() {
  const { user } = useAuth();
  const { tasks: engagements, loading: tasksLoading } = useTasks('my_engagements');
  const [activeTaskId, setActiveTaskId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // The chat for the currently selected task
  const { messages, sendMessage } = useChat(activeTaskId);
  const [chatInput, setChatInput] = useState('');

  const activeTask = engagements.find(t => t.id === activeTaskId);

  // Filter conversations
  const filteredEngagements = engagements.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSend = async () => {
    if (!chatInput.trim()) return;
    await sendMessage(chatInput);
    setChatInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  return (
    <main className="flex-1 lg:ml-64 pt-24 pb-12 px-gutter min-h-screen">
      <div className="max-w-6xl mx-auto h-[calc(100vh-160px)]">
        <header className="mb-6">
          <h1 className="text-headline-lg font-headline-lg text-primary mb-2">Messages</h1>
          <p className="text-body-md text-on-surface-variant">Communicate securely with clients and freelancers.</p>
        </header>
        
        <div className="bg-surface rounded-xl h-full flex flex-col md:flex-row shadow-sm border border-outline-variant/30 overflow-hidden">
          {/* Inbox Sidebar */}
          <div className="w-full md:w-1/3 border-r border-outline-variant/30 h-full p-0 flex flex-col">
             <div className="p-4 border-b border-outline-variant/30">
               <input 
                 type="text" 
                 placeholder="Search messages..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full px-4 py-2 bg-surface-container-low border border-outline-variant rounded-full text-body-sm outline-none focus:border-primary transition-colors"
               />
             </div>
              <div className="flex-1 overflow-y-auto">
                {tasksLoading ? (
                  <div className="p-8 text-center text-on-surface-variant">
                    <span className="material-symbols-outlined animate-spin mb-2">progress_activity</span>
                    <p>Loading conversations...</p>
                  </div>
                ) : filteredEngagements.length === 0 ? (
                  <div className="p-8 flex flex-col items-center justify-center text-center h-full">
                    <span className="material-symbols-outlined text-4xl text-surface-variant mb-2">inbox</span>
                    <p className="text-body-md font-semibold text-on-surface-variant">No conversations yet</p>
                    <p className="text-body-sm text-outline mt-1">Accept or post a task to start chatting.</p>
                  </div>
                ) : (
                  <ul className="divide-y divide-outline-variant/30">
                    {filteredEngagements.map(task => {
                      const isClient = user?.user_metadata?.user_role === 'client';
                      const otherUser = isClient ? task.freelancer : task.client;
                      const otherName = otherUser?.full_name || otherUser?.email || 'Unknown User';
                      const isActive = activeTaskId === task.id;

                      return (
                        <li key={task.id}>
                          <button 
                            onClick={() => setActiveTaskId(task.id)}
                            className={`w-full text-left p-4 hover:bg-surface-container transition-colors ${isActive ? 'bg-primary-container/30 border-l-4 border-primary' : 'border-l-4 border-transparent'}`}
                          >
                            <h4 className="font-bold text-on-surface truncate">{otherName}</h4>
                            <p className="text-body-sm text-primary truncate font-medium">{task.title}</p>
                            <p className="text-[11px] text-on-surface-variant mt-1 flex items-center gap-1">
                              <span className={`w-2 h-2 rounded-full ${task.status === 'completed' ? 'bg-secondary' : 'bg-primary'}`}></span>
                              {task.status === 'completed' ? 'Completed' : 'Active'}
                            </p>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
          </div>
          {/* Main Chat Area */}
          {!activeTaskId ? (
            <div className="hidden md:flex flex-1 items-center justify-center bg-surface-container-lowest">
              <div className="text-center">
                <span className="material-symbols-outlined text-[64px] text-surface-variant mb-4">forum</span>
                <p className="text-body-md text-on-surface-variant font-medium">Select a conversation to start messaging</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col h-full bg-surface-container-lowest relative">
               {/* Chat Header */}
               <div className="px-6 py-4 border-b border-outline-variant/30 bg-surface flex items-center justify-between shadow-sm z-10">
                 <div>
                   <h2 className="font-bold text-primary">{activeTask?.title}</h2>
                   <p className="text-body-sm text-on-surface-variant">Secure Task Room</p>
                 </div>
                 <button onClick={() => setActiveTaskId(null)} className="md:hidden p-2 text-on-surface-variant">
                    <span className="material-symbols-outlined">close</span>
                 </button>
               </div>

               {/* Messages Feed */}
               <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[radial-gradient(#e0e3e5_1px,transparent_1px)] [background-size:20px_20px]">
                 {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-on-surface-variant/50">
                      <span className="material-symbols-outlined text-4xl mb-2">waving_hand</span>
                      <p>Say hello! This is the start of your conversation.</p>
                    </div>
                 ) : (
                    messages.map((msg) => {
                      const isMe = msg.sender_id === user?.id;
                      const timeStr = new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                      const initials = msg.sender?.full_name?.charAt(0) || msg.sender?.email?.charAt(0) || 'U';

                      return (
                        <div key={msg.id} className={`flex gap-3 max-w-[85%] ${isMe ? 'ml-auto flex-row-reverse' : ''}`}>
                          <div className="w-8 h-8 rounded-full bg-primary-container flex-shrink-0 flex items-center justify-center text-on-primary-container font-bold text-sm mt-1">
                            {initials.toUpperCase()}
                          </div>
                          <div className={`flex flex-col gap-1 max-w-[calc(100%-40px)] ${isMe ? 'items-end' : 'items-start'}`}>
                            <div className={`px-4 py-2.5 rounded-2xl shadow-sm w-fit break-words ${isMe ? 'bg-primary text-on-primary rounded-tr-none' : 'bg-surface text-on-surface border border-outline-variant/20 rounded-tl-none'}`}>
                              <p className="text-body-sm font-body-sm leading-relaxed whitespace-pre-wrap break-words text-left">{msg.message}</p>
                            </div>
                            <p className="text-[10px] font-label-caps text-on-surface-variant">{timeStr}</p>
                          </div>
                        </div>
                      );
                    })
                 )}
               </div>

               {/* Chat Input */}
               <div className="p-4 bg-surface border-t border-outline-variant/30">
                 <div className="flex items-center gap-2 bg-surface-container-low p-2 rounded-xl border border-outline focus-within:border-primary transition-colors">
                    <input 
                      type="text" 
                      placeholder="Type a message..." 
                      className="flex-1 bg-transparent border-none outline-none px-2 text-body-sm"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                    <button 
                      onClick={handleSend}
                      disabled={!chatInput.trim()}
                      className="w-10 h-10 bg-primary text-on-primary rounded-lg flex items-center justify-center disabled:opacity-50 hover:scale-95 transition-transform"
                    >
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
                    </button>
                 </div>
               </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
