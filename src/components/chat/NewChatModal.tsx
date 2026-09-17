import React, { useState, useEffect } from 'react';
import { 
  X, 
  Search, 
  User, 
  Users, 
  Plus, 
  Loader2, 
  Sparkles,
  MessageSquarePlus,
  Check
} from 'lucide-react';
import { ChatParticipant } from '../../types';
import { 
  getWorkspaceDirectoryUsers, 
  createOrGetDirectConversation, 
  createGroupConversation 
} from '../../services/chatService';

interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserId: string;
  currentUserDetails: { name: string; email?: string; photoURL?: string; role?: string };
  onConversationCreated: (conversationId: string) => void;
}

export const NewChatModal: React.FC<NewChatModalProps> = ({
  isOpen,
  onClose,
  currentUserId,
  currentUserDetails,
  onConversationCreated,
}) => {
  const [activeTab, setActiveTab] = useState<'direct' | 'group'>('direct');
  const [directoryUsers, setDirectoryUsers] = useState<ChatParticipant[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  
  // Group state
  const [groupName, setGroupName] = useState('');
  const [selectedUids, setSelectedUids] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen || !currentUserId) return;

    let isMounted = true;
    setLoadingUsers(true);

    getWorkspaceDirectoryUsers(currentUserId)
      .then((users) => {
        if (isMounted) {
          setDirectoryUsers(users);
          setLoadingUsers(false);
        }
      })
      .catch((err) => {
        console.warn('Failed to load directory users:', err);
        if (isMounted) setLoadingUsers(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, currentUserId]);

  if (!isOpen) return null;

  const filteredUsers = directoryUsers.filter((u) => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (u.role && u.role.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleStartDirectChat = async (targetUser: ChatParticipant) => {
    try {
      setIsSubmitting(true);
      const convId = await createOrGetDirectConversation(
        currentUserId,
        currentUserDetails,
        targetUser
      );
      onConversationCreated(convId);
      onClose();
    } catch (err) {
      console.error('Failed to create direct conversation:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartCustomDirectChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail.trim() && !customName.trim()) return;

    try {
      setIsSubmitting(true);
      const targetUser: ChatParticipant = {
        uid: `user_${customEmail.replace(/[^a-zA-Z0-9]/g, '_') || Date.now()}`,
        name: customName.trim() || customEmail.split('@')[0] || 'Team Member',
        email: customEmail.trim() || undefined,
        role: 'Workspace Member'
      };

      const convId = await createOrGetDirectConversation(
        currentUserId,
        currentUserDetails,
        targetUser
      );
      onConversationCreated(convId);
      onClose();
    } catch (err) {
      console.error('Failed to start custom direct chat:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateGroupChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) return;

    try {
      setIsSubmitting(true);
      const detailsMap: Record<string, any> = {};
      selectedUids.forEach((uid) => {
        const u = directoryUsers.find((user) => user.uid === uid);
        if (u) {
          detailsMap[uid] = {
            name: u.name,
            email: u.email,
            photoURL: u.photoURL,
            role: u.role,
          };
        }
      });

      const convId = await createGroupConversation(
        currentUserId,
        currentUserDetails,
        groupName.trim(),
        selectedUids,
        detailsMap
      );
      onConversationCreated(convId);
      onClose();
    } catch (err) {
      console.error('Failed to create group channel:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleSelectUid = (uid: string) => {
    setSelectedUids((prev) => 
      prev.includes(uid) ? prev.filter((id) => id !== uid) : [...prev, uid]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg rounded-2xl bg-[#091321] border border-[#172D47] shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#142337] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-950/70 border border-cyan-400/50 flex items-center justify-center text-cyan-400">
              <MessageSquarePlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Start New Conversation</h3>
              <p className="text-[11px] text-slate-400">WhatsApp-style real-time messaging</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#142337] transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="px-5 pt-3 border-b border-[#142337] flex gap-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('direct')}
            className={`pb-2.5 flex items-center gap-1.5 transition border-b-2 cursor-pointer ${
              activeTab === 'direct'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Direct Message</span>
          </button>
          <button
            onClick={() => setActiveTab('group')}
            className={`pb-2.5 flex items-center gap-1.5 transition border-b-2 cursor-pointer ${
              activeTab === 'group'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Team Channel / Group</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'direct' ? (
            <div className="space-y-4">
              {/* Search or Add */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter team members by name or role..."
                  className="w-full bg-[#060D17] border border-[#162C47] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Registered Directory Members */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Workspace Members
                </span>

                {loadingUsers ? (
                  <div className="py-6 flex items-center justify-center gap-2 text-xs text-slate-400">
                    <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                    <span>Searching team directory...</span>
                  </div>
                ) : filteredUsers.length > 0 ? (
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {filteredUsers.map((user) => (
                      <div
                        key={user.uid}
                        onClick={() => !isSubmitting && handleStartDirectChat(user)}
                        className="p-2.5 rounded-xl bg-[#060D17] border border-[#13253B] hover:border-cyan-500/50 hover:bg-[#0B1726] flex items-center justify-between transition cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-cyan-950/80 border border-cyan-400/40 flex items-center justify-center text-xs font-bold text-cyan-300 overflow-hidden">
                            {user.photoURL ? (
                              <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                              user.name.charAt(0)
                            )}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-white block">{user.name}</span>
                            <span className="text-[10px] text-slate-400 block">{user.email || user.role}</span>
                          </div>
                        </div>

                        <button
                          disabled={isSubmitting}
                          className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 text-[11px] font-semibold hover:bg-cyan-500 hover:text-slate-950 transition"
                        >
                          Chat
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic py-1">
                    {searchQuery ? 'No matching members found.' : 'No other workspace members registered yet.'}
                  </p>
                )}
              </div>

              {/* Or start chat by entering name/email */}
              <div className="pt-3 border-t border-[#142337] space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Or Chat With A Colleague By Email / Name
                </span>
                <form onSubmit={handleStartCustomDirectChat} className="space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      placeholder="Name (e.g. Amish, Ankit)"
                      className="bg-[#060D17] border border-[#162C47] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                    <input
                      type="email"
                      value={customEmail}
                      onChange={(e) => setCustomEmail(e.target.value)}
                      placeholder="Email (optional)"
                      className="bg-[#060D17] border border-[#162C47] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={(!customName.trim() && !customEmail.trim()) || isSubmitting}
                    className="w-full py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Start Direct Conversation</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          ) : (
            /* Group Channel Tab */
            <form onSubmit={handleCreateGroupChat} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Team Channel Name
                </label>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="e.g. Project 2P Designers, Sprint Core"
                  required
                  className="w-full bg-[#060D17] border border-[#162C47] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Suggestions */}
              <div className="space-y-1.5">
                <span className="text-[10px] text-slate-400 block">Quick Suggestions:</span>
                <div className="flex flex-wrap gap-1.5">
                  {['Project 2P Designers', 'Frontend Sprint Pod', 'QA & Bug Bash', 'General Team'].map((suggested) => (
                    <button
                      key={suggested}
                      type="button"
                      onClick={() => setGroupName(suggested)}
                      className="px-2.5 py-1 rounded-lg bg-[#060D17] border border-[#162C47] text-[11px] text-slate-300 hover:border-cyan-400 hover:text-cyan-300 transition cursor-pointer"
                    >
                      {suggested}
                    </button>
                  ))}
                </div>
              </div>

              {/* Select Team Members (if available) */}
              {directoryUsers.length > 0 && (
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Invite Members (Optional)
                  </label>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {directoryUsers.map((user) => {
                      const isSelected = selectedUids.includes(user.uid);
                      return (
                        <div
                          key={user.uid}
                          onClick={() => toggleSelectUid(user.uid)}
                          className={`p-2 rounded-xl border flex items-center justify-between transition cursor-pointer ${
                            isSelected
                              ? 'bg-cyan-950/40 border-cyan-400/60'
                              : 'bg-[#060D17] border-[#13253B] hover:bg-[#0B1726]'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-cyan-950/70 border border-cyan-400/40 flex items-center justify-center text-xs font-bold text-cyan-300">
                              {user.name.charAt(0)}
                            </div>
                            <span className="text-xs text-slate-200">{user.name}</span>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-cyan-400" />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={!groupName.trim() || isSubmitting}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 disabled:opacity-40 text-slate-950 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(0,245,196,0.3)]"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Create Team Channel</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
