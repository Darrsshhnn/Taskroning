import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Conversation, ChatMessage } from '../../types';
import { 
  subscribeToUserConversations, 
  subscribeToConversationMessages, 
  sendConversationMessage,
  formatConversationTime,
  formatMessageTime,
  createGroupConversation
} from '../../services/chatService';
import { NewChatModal } from '../chat/NewChatModal';
import { 
  Search, 
  Send, 
  Smile, 
  Phone, 
  Video, 
  MoreVertical, 
  ArrowLeft, 
  MessageSquare, 
  MessageSquarePlus, 
  CheckCheck, 
  Loader2, 
  Users, 
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { audioManager } from '../../utils/audioUtils';

export const ChatView: React.FC = () => {
  const { firebaseUser, user } = useAuth();
  const currentUserId = firebaseUser?.uid || '';
  const currentUserDisplayName = user?.name || firebaseUser?.displayName || 'You';
  const currentUserPhoto = user?.photoURL || firebaseUser?.photoURL || '';

  // State
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [showScrollBottomBtn, setShowScrollBottomBtn] = useState(false);

  // Refs for smart scrolling
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const isNearBottomRef = useRef(true);

  // 1. Subscribe to User Conversations
  useEffect(() => {
    if (!currentUserId) {
      setIsLoadingConversations(false);
      return;
    }

    setIsLoadingConversations(true);
    const unsubscribe = subscribeToUserConversations(
      currentUserId,
      (updatedList) => {
        setConversations(updatedList);
        setIsLoadingConversations(false);

        // If no conversation currently selected and on desktop, optionally select first
        setActiveConversationId((prevActive) => {
          if (!prevActive && updatedList.length > 0 && window.innerWidth >= 768) {
            return updatedList[0].id;
          }
          return prevActive;
        });
      },
      (err) => {
        console.error('Error in conversations subscription:', err);
        setIsLoadingConversations(false);
      }
    );

    return () => unsubscribe();
  }, [currentUserId]);

  // 2. Subscribe to Messages of the Active Conversation
  useEffect(() => {
    if (!activeConversationId) {
      setMessages([]);
      return;
    }

    setIsLoadingMessages(true);
    const unsubscribe = subscribeToConversationMessages(
      activeConversationId,
      (newMsgs) => {
        setMessages(newMsgs);
        setIsLoadingMessages(false);

        // Smart scroll behavior:
        // If near bottom or user just loaded conversation, auto scroll to bottom
        if (isNearBottomRef.current) {
          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
          }, 50);
        } else {
          // If scrolled up and new message arrives, alert user with discreet button
          setShowScrollBottomBtn(true);
        }
      },
      (err) => {
        console.error('Error in messages subscription:', err);
        setIsLoadingMessages(false);
      }
    );

    return () => unsubscribe();
  }, [activeConversationId]);

  // Reset scroll on active conversation switch
  useEffect(() => {
    if (activeConversationId) {
      isNearBottomRef.current = true;
      setShowScrollBottomBtn(false);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
      }, 50);
    }
  }, [activeConversationId]);

  // Handle scroll events in chat container to detect when user scrolled up
  const handleScroll = useCallback(() => {
    const container = chatContainerRef.current;
    if (!container) return;

    const threshold = 120; // 120px from bottom considered "near bottom"
    const distanceToBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
    const isAtBottom = distanceToBottom <= threshold;
    isNearBottomRef.current = isAtBottom;

    if (isAtBottom) {
      setShowScrollBottomBtn(false);
    }
  }, []);

  const scrollToBottom = () => {
    isNearBottomRef.current = true;
    setShowScrollBottomBtn(false);
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 3. Handle Send Message
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed || !activeConversationId || !currentUserId) return;

    setInputText('');
    audioManager.playChime('neutral');

    // Optimistic local preview
    const tempId = `temp-${Date.now()}`;
    const optimisticMsg: ChatMessage = {
      id: tempId,
      conversationId: activeConversationId,
      senderId: currentUserId,
      senderName: currentUserDisplayName,
      senderPhotoURL: currentUserPhoto,
      text: trimmed,
      timestamp: formatMessageTime(Date.now()),
      createdAt: Date.now(),
      isMe: true,
      status: 'sending'
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    isNearBottomRef.current = true;
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 20);

    try {
      setIsSending(true);
      await sendConversationMessage(
        activeConversationId,
        {
          uid: currentUserId,
          name: currentUserDisplayName,
          photoURL: currentUserPhoto
        },
        trimmed
      );
    } catch (err) {
      console.error('Failed to send message to Firestore:', err);
    } finally {
      setIsSending(false);
    }
  };

  // Get active conversation object
  const activeConversation = conversations.find((c) => c.id === activeConversationId);

  // Helper to determine display name and avatar for a conversation
  const getConversationDetails = (conv: Conversation) => {
    if (conv.isGroup) {
      return {
        title: conv.groupName || 'Team Channel',
        avatarText: (conv.groupName || 'T').charAt(0).toUpperCase(),
        isGroup: true,
        photoURL: conv.groupAvatar,
        subtitle: `${conv.participants.length} members`
      };
    }

    // 1-on-1: find the other participant
    const otherUid = conv.participants.find((p) => p !== currentUserId) || currentUserId;
    const details = conv.participantDetails?.[otherUid];
    const name = details?.name || (otherUid === currentUserId ? `${currentUserDisplayName} (Note to self)` : 'Workspace Colleague');

    return {
      title: name,
      avatarText: name.charAt(0).toUpperCase(),
      isGroup: false,
      photoURL: details?.photoURL,
      subtitle: otherUid === currentUserId ? 'Personal space' : 'Active In Workspace'
    };
  };

  // Filter conversations
  const filteredConversations = conversations.filter((c) => {
    const details = getConversationDetails(c);
    const query = searchQuery.toLowerCase();
    return (
      details.title.toLowerCase().includes(query) ||
      (c.lastMessage && c.lastMessage.toLowerCase().includes(query))
    );
  });

  // Quick Starter handler
  const handleQuickStartChannel = async () => {
    if (!currentUserId) return;
    try {
      setIsSending(true);
      const convId = await createGroupConversation(
        currentUserId,
        {
          name: currentUserDisplayName,
          email: firebaseUser?.email || '',
          photoURL: currentUserPhoto,
          role: 'Workspace Lead'
        },
        'Project 2P Designers',
        []
      );
      setActiveConversationId(convId);
    } catch (err) {
      console.error('Failed to quick start channel:', err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="p-3 sm:p-5 lg:p-6 max-w-[1600px] mx-auto select-none animate-fadeIn h-[calc(100vh-100px)] min-h-[600px] flex flex-col">
      {/* Outer Card Container */}
      <div className="taskroning-card flex-1 flex overflow-hidden border border-[#16273C] shadow-2xl rounded-2xl bg-[#070D16]">
        
        {/* ======================================================== */}
        {/* LEFT PANEL: WhatsApp-style Conversation List             */}
        {/* Responsive: On mobile, hidden if a conversation is open  */}
        {/* ======================================================== */}
        <div className={`
          ${activeConversationId ? 'hidden md:flex' : 'flex'}
          w-full md:w-80 lg:w-96 flex-col border-r border-[#142337] bg-[#070D16] shrink-0
        `}>
          {/* Header */}
          <div className="p-3.5 sm:p-4 border-b border-[#142337] space-y-3 bg-[#08121E]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-cyan-950/80 border border-cyan-400/50 flex items-center justify-center text-xs font-bold text-cyan-300">
                  {currentUserDisplayName.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xs font-bold text-white tracking-wide uppercase flex items-center gap-1.5">
                    <span>Chats</span>
                    {conversations.length > 0 && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono">
                        {conversations.length}
                      </span>
                    )}
                  </h2>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsNewChatModalOpen(true)}
                  className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 hover:text-cyan-200 transition cursor-pointer flex items-center gap-1.5 text-xs font-medium"
                  title="New Conversation"
                >
                  <MessageSquarePlus className="w-4 h-4 text-cyan-400" />
                  <span className="hidden sm:inline text-[11px] font-bold">New Chat</span>
                </button>
              </div>
            </div>

            {/* Search Filter */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search or start new chat..."
                className="w-full bg-[#0B1422] border border-[#172D47] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Conversations List Content */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#101F33]">
            {isLoadingConversations ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-2 text-cyan-400">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="text-xs font-mono text-slate-400">Loading chats from Firestore...</span>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-6 text-center space-y-4">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-[#0B1726] border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(0,245,196,0.15)]">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">No conversations yet</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed max-w-xs mx-auto">
                    {searchQuery ? 'No chats match your search query.' : 'Start a 1-on-1 direct message or create a team channel with workspace members.'}
                  </p>
                </div>

                {!searchQuery && (
                  <div className="space-y-2 pt-2">
                    <button
                      onClick={() => setIsNewChatModalOpen(true)}
                      className="w-full py-2.5 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(0,245,196,0.3)] cursor-pointer"
                    >
                      <MessageSquarePlus className="w-3.5 h-3.5" />
                      <span>Start New Conversation</span>
                    </button>

                    <button
                      onClick={handleQuickStartChannel}
                      className="w-full py-2 px-3 rounded-xl bg-[#091524] border border-cyan-500/30 text-cyan-300 hover:bg-[#0D1F35] font-medium text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Quick Start: Project 2P Designers</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isSelected = conv.id === activeConversationId;
                const details = getConversationDetails(conv);
                const displayTime = formatConversationTime(conv.lastMessageTimestamp || conv.updatedAt);

                return (
                  <div
                    key={conv.id}
                    onClick={() => setActiveConversationId(conv.id)}
                    className={`p-3.5 flex items-center justify-between transition cursor-pointer select-none ${
                      isSelected
                        ? 'bg-[#0E1B2E] border-l-4 border-cyan-400'
                        : 'hover:bg-[#0A121E]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {/* Avatar */}
                      <div className="relative shrink-0">
                        <div className="w-10 h-10 rounded-full bg-cyan-950/80 border border-cyan-400/50 flex items-center justify-center text-xs font-bold text-cyan-300 overflow-hidden shadow-sm">
                          {details.photoURL ? (
                            <img src={details.photoURL} alt={details.title} className="w-full h-full object-cover" />
                          ) : (
                            details.avatarText
                          )}
                        </div>
                        {details.isGroup ? (
                          <span className="w-3.5 h-3.5 rounded-full bg-cyan-900 border border-cyan-400 absolute -bottom-0.5 -right-0.5 flex items-center justify-center text-[8px] text-cyan-200">
                            #
                          </span>
                        ) : (
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#070D16] absolute -bottom-0.5 -right-0.5 shadow-[0_0_4px_#10B981]" />
                        )}
                      </div>

                      {/* Name & Preview */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <span className={`text-xs font-bold truncate block ${isSelected ? 'text-cyan-300' : 'text-slate-100'}`}>
                            {details.title}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500 shrink-0">
                            {displayTime}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-[11px] text-slate-400 truncate max-w-[190px] block">
                            {conv.lastSenderId === currentUserId && (
                              <span className="text-cyan-400 mr-1 font-medium">You:</span>
                            )}
                            {conv.lastMessage || 'No messages yet'}
                          </p>
                          {Boolean(conv.unreadCount) && (
                            <span className="px-1.5 py-0.2 rounded-full bg-cyan-400 text-slate-950 font-bold text-[9px] shrink-0">
                              {conv.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT PANEL: WhatsApp-style Open Conversation Thread     */}
        {/* Responsive: On mobile, visible ONLY if conversation open */}
        {/* ======================================================== */}
        <div className={`
          ${activeConversationId ? 'flex' : 'hidden md:flex'}
          flex-1 flex-col justify-between bg-[#08121E] min-w-0
        `}>
          {!activeConversationId ? (
            /* WhatsApp Web style empty placeholder */
            <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-[#091524] border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_25px_rgba(0,245,196,0.15)]">
                <MessageSquare className="w-8 h-8" />
              </div>
              <div className="space-y-1.5 max-w-sm">
                <h3 className="text-base font-bold text-white tracking-wide">
                  Taskroning Workspace Chat
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Select a conversation from the panel or start a new thread. Real-time end-to-end synchronization with Cloud Firestore.
                </p>
              </div>
              <button
                onClick={() => setIsNewChatModalOpen(true)}
                className="mt-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition flex items-center gap-2 shadow-[0_0_15px_rgba(0,245,196,0.25)] cursor-pointer"
              >
                <MessageSquarePlus className="w-4 h-4" />
                <span>New Conversation</span>
              </button>
            </div>
          ) : (
            /* Open Conversation Active View */
            <>
              {/* Top Header */}
              {(() => {
                const details = activeConversation ? getConversationDetails(activeConversation) : null;
                return (
                  <div className="px-4 py-3 border-b border-[#142337] flex items-center justify-between bg-[#070D16] shrink-0">
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Back button for mobile */}
                      <button
                        onClick={() => setActiveConversationId(null)}
                        className="md:hidden p-1.5 -ml-1 rounded-lg text-slate-300 hover:text-white hover:bg-[#142337] transition cursor-pointer"
                        title="Back to conversation list"
                      >
                        <ArrowLeft className="w-5 h-5 text-cyan-400" />
                      </button>

                      {/* Avatar */}
                      <div className="relative shrink-0">
                        <div className="w-9 h-9 rounded-full bg-cyan-950/80 border border-cyan-400/50 flex items-center justify-center text-xs font-bold text-cyan-300 overflow-hidden shadow-sm">
                          {details?.photoURL ? (
                            <img src={details.photoURL} alt={details.title} className="w-full h-full object-cover" />
                          ) : (
                            details?.avatarText || '?'
                          )}
                        </div>
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#070D16] absolute -bottom-0.5 -right-0.5 shadow-[0_0_4px_#10B981]" />
                      </div>

                      {/* Title & Status */}
                      <div className="min-w-0">
                        <h3 className="text-xs font-bold text-white tracking-wide truncate">
                          {details?.title || 'Conversation'}
                        </h3>
                        <span className="text-[10px] text-emerald-400 font-medium block truncate">
                          {details?.subtitle || 'Active in Workspace'}
                        </span>
                      </div>
                    </div>

                    {/* Header Action Tools */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button 
                        title="Voice Sync"
                        className="w-8 h-8 rounded-lg bg-[#0E1B2E] border border-[#1B3452] text-slate-300 hover:text-cyan-400 flex items-center justify-center transition cursor-pointer"
                      >
                        <Phone className="w-4 h-4" />
                      </button>
                      <button 
                        title="Video Sync"
                        className="w-8 h-8 rounded-lg bg-[#0E1B2E] border border-[#1B3452] text-slate-300 hover:text-cyan-400 flex items-center justify-center transition cursor-pointer"
                      >
                        <Video className="w-4 h-4" />
                      </button>
                      <button 
                        title="More Options"
                        className="w-8 h-8 rounded-lg bg-[#0E1B2E] border border-[#1B3452] text-slate-300 hover:text-cyan-400 flex items-center justify-center transition cursor-pointer"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })()}

              {/* Scrollable Message Thread */}
              <div 
                ref={chatContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 relative"
              >
                {isLoadingMessages ? (
                  <div className="h-full flex flex-col items-center justify-center space-y-2 text-cyan-400">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span className="text-xs font-mono text-slate-400">Fetching messages from Firestore...</span>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center space-y-3 text-center p-6">
                    <div className="w-12 h-12 rounded-2xl bg-[#0B1726] border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(0,245,196,0.2)]">
                      <MessageSquare className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-200">No messages yet in this conversation</h4>
                      <p className="text-xs text-slate-400 mt-1 max-w-sm">
                        Send the first message! Every message is synchronized across all active workspace sessions in real-time.
                      </p>
                    </div>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMyMessage = msg.senderId === currentUserId;

                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMyMessage ? 'items-end' : 'items-start'}`}
                      >
                        {/* Sender name for group or other member */}
                        {!isMyMessage && (
                          <span className="text-[10px] font-bold text-cyan-400 mb-1 pl-1">
                            {msg.senderName}
                          </span>
                        )}

                        {/* WhatsApp-style Bubble */}
                        <div
                          className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3 text-xs leading-relaxed space-y-2 relative shadow-sm ${
                            isMyMessage
                              ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium rounded-tr-sm shadow-[0_0_15px_rgba(59,130,246,0.25)]'
                              : 'bg-[#0E1A2B] border border-[#182E47] text-slate-200 rounded-tl-sm'
                          }`}
                        >
                          <p className="whitespace-pre-wrap break-words">{msg.text}</p>

                          {msg.imageUrl && (
                            <div className="rounded-xl overflow-hidden border border-[#1F3A5A]">
                              <img 
                                src={msg.imageUrl} 
                                alt="Attachment" 
                                referrerPolicy="no-referrer"
                                className="w-full h-auto object-cover max-h-56"
                              />
                            </div>
                          )}

                          {/* Timestamp and Delivery status */}
                          <div className={`flex items-center gap-1.5 justify-end text-[9.5px] font-mono select-none ${
                            isMyMessage ? 'text-cyan-200' : 'text-slate-400'
                          }`}>
                            <span>{msg.timestamp}</span>
                            {isMyMessage && (
                              <CheckCheck className="w-3.5 h-3.5 text-cyan-200 inline" />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />

                {/* Floating New Messages Indicator */}
                {showScrollBottomBtn && (
                  <button
                    onClick={scrollToBottom}
                    className="sticky bottom-2 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-cyan-500 text-slate-950 font-bold text-[11px] shadow-lg flex items-center gap-1.5 hover:bg-cyan-400 transition cursor-pointer animate-bounce z-10"
                  >
                    <span>New messages</span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Bottom Message Input Bar */}
              <div className="p-3 sm:p-4 border-t border-[#142337] bg-[#070D16] shrink-0">
                <form 
                  onSubmit={handleSendMessage}
                  className="flex items-center gap-2 bg-[#091321] border border-[#172D47] rounded-2xl p-1.5 focus-within:border-cyan-400/80 transition"
                >
                  <button
                    type="button"
                    onClick={() => setInputText((prev) => prev + ' 🚀')}
                    className="p-2 text-slate-400 hover:text-cyan-400 transition cursor-pointer"
                    title="Insert emoji"
                  >
                    <Smile className="w-4 h-4" />
                  </button>

                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={`Message ${activeConversation ? getConversationDetails(activeConversation).title : ''}... (Press Enter to send)`}
                    className="flex-1 bg-transparent px-2 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />

                  <button
                    type="submit"
                    disabled={!inputText.trim() || isSending}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 text-xs font-bold transition shadow-[0_0_10px_rgba(0,245,196,0.3)] flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {isSending ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <>
                        <span>Send</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </>
          )}
        </div>

      </div>

      {/* New Chat Modal */}
      <NewChatModal
        isOpen={isNewChatModalOpen}
        onClose={() => setIsNewChatModalOpen(false)}
        currentUserId={currentUserId}
        currentUserDetails={{
          name: currentUserDisplayName,
          email: firebaseUser?.email || '',
          photoURL: currentUserPhoto,
          role: 'Workspace Member'
        }}
        onConversationCreated={(convId) => {
          setActiveConversationId(convId);
        }}
      />
    </div>
  );
};
