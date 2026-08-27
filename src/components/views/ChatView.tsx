import React, { useState } from 'react';
import { ChatContact, ChatMessage } from '../../types';
import { 
  INITIAL_CHAT_CONTACTS, 
  INITIAL_CHAT_MESSAGES 
} from '../../data/initialData';
import { 
  Search, 
  Phone, 
  Video, 
  Send, 
  Paperclip, 
  Smile, 
  MoreVertical,
  Users,
  Image as ImageIcon
} from 'lucide-react';

export const ChatView: React.FC = () => {
  const [contacts, setContacts] = useState<ChatContact[]>(INITIAL_CHAT_CONTACTS);
  const [activeContact, setActiveContact] = useState<ChatContact>(INITIAL_CHAT_CONTACTS[0]);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'me',
      senderName: 'Darshan',
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
    };

    setMessages(prev => [...prev, newMsg]);
    setInputText('');
  };

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-7 max-w-[1600px] mx-auto select-none">
      
      <div className="taskroning-card grid grid-cols-1 md:grid-cols-12 h-[720px] overflow-hidden">
        
        {/* ======================================================== */}
        {/* LEFT COLUMN: Search & Contact List (3 cols)               */}
        {/* ======================================================== */}
        <div className="md:col-span-3 border-r border-[#142337] flex flex-col bg-[#070D16]">
          
          {/* Search Bar */}
          <div className="p-4 border-b border-[#142337]">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search team or chat..."
                className="w-full bg-[#0B1422] border border-[#172D47] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Contacts List */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#101F33]">
            {filteredContacts.map(contact => {
              const isSelected = contact.id === activeContact.id;
              return (
                <div
                  key={contact.id}
                  onClick={() => setActiveContact(contact)}
                  className={`p-3.5 flex items-center justify-between transition cursor-pointer ${
                    isSelected ? 'bg-[#0E1B2E] border-l-2 border-cyan-400' : 'hover:bg-[#0A121E]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-9 h-9 rounded-full bg-cyan-950 border border-cyan-400/50 flex items-center justify-center text-xs font-bold text-cyan-300">
                        {contact.name.charAt(0)}
                      </div>
                      {contact.status === 'online' && (
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#070D16] absolute -bottom-0.5 -right-0.5 shadow-[0_0_4px_#10B981]" />
                      )}
                    </div>

                    <div>
                      <span className="text-xs font-bold text-slate-100 block">{contact.name}</span>
                      <span className="text-[10px] text-slate-400 truncate max-w-[130px] block">
                        {contact.lastMessage}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[9px] font-mono text-slate-500 block">{contact.lastTime}</span>
                    {contact.unreadCount && (
                      <span className="inline-block px-1.5 py-0.5 rounded-full bg-cyan-400 text-slate-950 font-bold text-[9px] mt-0.5">
                        {contact.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* ======================================================== */}
        {/* CENTER COLUMN: Chat Room & Messages (6 cols)              */}
        {/* ======================================================== */}
        <div className="md:col-span-6 flex flex-col justify-between bg-[#08121E]">
          
          {/* Header */}
          <div className="px-5 py-3.5 border-b border-[#142337] flex items-center justify-between bg-[#070D16]">
            <div>
              <h3 className="text-xs font-bold text-white tracking-wide">
                {activeContact.name}
              </h3>
              <span className="text-[10px] text-emerald-400 font-medium">Active Now</span>
            </div>

            <div className="flex items-center gap-2">
              <button className="w-8 h-8 rounded-lg bg-[#0E1B2E] border border-[#1B3452] text-slate-300 hover:text-cyan-400 flex items-center justify-center transition cursor-pointer">
                <Video className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 rounded-lg bg-[#0E1B2E] border border-[#1B3452] text-slate-300 hover:text-cyan-400 flex items-center justify-center transition cursor-pointer">
                <Phone className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}
              >
                {!msg.isMe && (
                  <span className="text-[10px] font-bold text-cyan-400 mb-1 pl-1">
                    {msg.senderName}
                  </span>
                )}

                <div className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed space-y-2.5 ${
                  msg.isMe
                    ? 'bg-blue-600 text-white font-medium rounded-br-none shadow-md'
                    : 'bg-[#0E1A2B] border border-[#182E47] text-slate-200 rounded-bl-none shadow-sm'
                }`}>
                  <p>{msg.text}</p>
                  
                  {msg.imageUrl && (
                    <div className="rounded-xl overflow-hidden border border-[#1F3A5A]">
                      <img 
                        src={msg.imageUrl} 
                        alt="Shared design update" 
                        className="w-full h-40 object-cover hover:scale-105 transition duration-300"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}

                  <span className="block text-[9px] text-slate-400 text-right font-mono">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-3.5 border-t border-[#142337] bg-[#070D16] flex items-center gap-2">
            <button className="p-2 text-slate-400 hover:text-cyan-400 transition cursor-pointer">
              <Paperclip className="w-4 h-4" />
            </button>
            <button className="p-2 text-slate-400 hover:text-cyan-400 transition cursor-pointer">
              <ImageIcon className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message or project note..."
              className="flex-1 bg-[#0B1422] border border-[#172D47] rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />

            <button
              onClick={handleSendMessage}
              className="p-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 transition cursor-pointer shadow-[0_0_10px_rgba(0,245,196,0.4)]"
            >
              <Send className="w-3.5 h-3.5 fill-current" />
            </button>
          </div>

        </div>

        {/* ======================================================== */}
        {/* RIGHT COLUMN: Group Info & Media (3 cols)                 */}
        {/* ======================================================== */}
        <div className="hidden md:flex md:col-span-3 border-l border-[#142337] flex-col p-5 bg-[#070D16] space-y-6">
          
          <div className="flex flex-col items-center text-center gap-3 pt-2">
            {/* 3D Dog Avatar badge matching screenshot */}
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-cyan-600 to-teal-400 p-0.5 shadow-[0_0_20px_rgba(0,245,196,0.3)]">
              <div className="w-full h-full bg-[#08121E] rounded-[14px] flex items-center justify-center text-3xl">
                🐕
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white">Project 2p Designer group 2</h4>
              <span className="text-[10px] text-slate-400">8 Members • 2 Online</span>
            </div>
          </div>

          {/* Members preview */}
          <div className="space-y-2 border-t border-[#142337] pt-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Members</span>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between p-1.5 rounded-lg bg-[#0A1320]">
                <span className="text-slate-200 text-[11px]">Senior Designer - Ankit</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
              <div className="flex items-center justify-between p-1.5 rounded-lg bg-[#0A1320]">
                <span className="text-slate-200 text-[11px]">Lead Dev - Lalit</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
              <div className="flex items-center justify-between p-1.5 rounded-lg bg-[#0A1320]">
                <span className="text-slate-200 text-[11px]">Darshan S. (You)</span>
                <span className="text-[9px] font-mono text-cyan-400">Lead</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
