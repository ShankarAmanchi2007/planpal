'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  ArrowLeft, 
  MessageCircle, 
  Flame 
} from 'lucide-react';
import { Match, Message, User } from '@/types';

interface MatchesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  matches: Match[];
  currentUser: User;
  activeMatch: Match | null;
  onSelectMatch: (match: Match | null) => void;
}

const ICEBREAKERS = [
  "Hey! Really looking forward to this. See you there!",
  "What time are you heading over?",
  "Should I bring anything?",
  "I'll be at the main entrance around that time!",
];

export const MatchesDrawer: React.FC<MatchesDrawerProps> = ({
  isOpen,
  onClose,
  matches,
  currentUser,
  activeMatch,
  onSelectMatch,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [rsvpStatus, setRsvpStatus] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch messages when active match changes
  useEffect(() => {
    if (activeMatch) {
      fetch(`/api/messages?matchId=${activeMatch.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.messages) {
            setMessages(data.messages);
          }
        })
        .catch(console.error);
    }
  }, [activeMatch]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || !activeMatch) return;

    setIsSending(true);
    setInputText('');

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matchId: activeMatch.id,
          text,
        }),
      });

      const data = await res.json();
      if (data.success && data.message) {
        setMessages((prev) => [...prev, data.message]);

        // Simulate host instant reply if it's the first message!
        if (messages.length <= 2) {
          setTimeout(() => {
            const replyMsg: Message = {
              id: `msg_reply_${Date.now()}`,
              matchId: activeMatch.id,
              senderId: activeMatch.matchedWith.id,
              senderName: activeMatch.matchedWith.name,
              text: "Sounds great! See you then, looking forward to it! 👍",
              timestamp: new Date().toISOString(),
            };
            setMessages((prev) => [...prev, replyMsg]);
          }, 1500);
        }
      }
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setIsSending(false);
    }
  };

  const toggleRsvp = (matchId: string) => {
    setRsvpStatus((prev) => ({
      ...prev,
      [matchId]: !prev[matchId],
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 flex flex-col h-full shadow-2xl">
        {/* Top Header */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {activeMatch ? (
              <button
                onClick={() => onSelectMatch(null)}
                className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            ) : (
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white">
                <Flame className="w-4 h-4 fill-white" />
              </div>
            )}
            <div>
              <h3 className="font-extrabold text-base text-zinc-900 dark:text-white">
                {activeMatch ? activeMatch.matchedWith.name : 'Your Hangouts & Chats'}
              </h3>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                {activeMatch
                  ? `${activeMatch.matchedWith.occupation} • ${activeMatch.matchedWith.city}`
                  : `${matches.length} active connection${matches.length === 1 ? '' : 's'}`}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body: Either Matches List or Active Chat Room */}
        {activeMatch ? (
          /* Active Chat Room */
          <div className="flex-1 flex flex-col min-h-0">
            {/* Pinned Plan Banner at top of chat */}
            <div className="p-3.5 bg-rose-50/70 dark:bg-rose-950/30 border-b border-rose-100 dark:border-rose-900/40">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0 pr-2">
                  <div className="flex items-center space-x-1.5 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-rose-200/60 dark:bg-rose-900/60 text-rose-800 dark:text-rose-200">
                      {activeMatch.activity.category}
                    </span>
                    <span className="text-xs font-bold text-zinc-900 dark:text-white truncate">
                      {activeMatch.activity.title}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 text-[11px] text-zinc-600 dark:text-zinc-300">
                    <span className="flex items-center space-x-1 truncate">
                      <Calendar className="w-3 h-3 text-rose-500" />
                      <span>{activeMatch.activity.timeDisplay}</span>
                    </span>
                    <span className="flex items-center space-x-1 truncate">
                      <MapPin className="w-3 h-3 text-indigo-500" />
                      <span>{activeMatch.activity.location}</span>
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => toggleRsvp(activeMatch.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center space-x-1 ${
                    rsvpStatus[activeMatch.id] !== false
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                  }`}
                  title="Toggle RSVP Confirmation"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{rsvpStatus[activeMatch.id] !== false ? 'Confirmed' : 'RSVP'}</span>
                </button>
              </div>
            </div>

            {/* Messages Thread */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {messages.map((msg) => {
                const isMe = msg.senderId === currentUser.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed shadow-sm ${
                        isMe
                          ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white rounded-br-none'
                          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-bl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-zinc-400 mt-1 px-1">
                      {isMe ? 'You' : msg.senderName}
                    </span>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Icebreaker Suggestions */}
            <div className="px-3 py-2 border-t border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/30 overflow-x-auto no-scrollbar flex space-x-1.5">
              {ICEBREAKERS.map((text, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(text)}
                  className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-rose-400 whitespace-nowrap transition-colors"
                >
                  {text}
                </button>
              ))}
            </div>

            {/* Message Input Box */}
            <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center space-x-2">
              <input
                type="text"
                placeholder="Message host to coordinate..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 px-3.5 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-xs sm:text-sm text-zinc-900 dark:text-white border-none focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim() || isSending}
                className="p-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 disabled:opacity-40 text-white transition-all shadow-md active:scale-95"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Matches List */
          <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
            {matches.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-500 dark:text-zinc-400">
                <MessageCircle className="w-12 h-12 stroke-[1.5] mb-2 opacity-40" />
                <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300">No matches yet</p>
                <p className="text-xs mt-1">
                  Swipe right on plans in the deck to match and start chatting!
                </p>
              </div>
            ) : (
              matches.map((match) => (
                <div
                  key={match.id}
                  onClick={() => onSelectMatch(match)}
                  className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700/60 cursor-pointer transition-all flex items-center space-x-3.5 group"
                >
                  <div className="relative">
                    <img
                      src={match.matchedWith.avatar}
                      alt={match.matchedWith.name}
                      className="w-12 h-12 rounded-xl object-cover ring-2 ring-rose-500/30"
                    />
                    <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-zinc-900 rounded-full" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h4 className="text-sm font-bold text-zinc-900 dark:text-white truncate">
                        {match.matchedWith.name}, {match.matchedWith.age}
                      </h4>
                      <span className="text-[10px] text-zinc-400">
                        {match.lastMessageTime || 'Just now'}
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-rose-500 truncate mb-0.5">
                      {match.activity.title}
                    </p>

                    <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                      {match.lastMessage || 'Connected! Click to coordinate.'}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
