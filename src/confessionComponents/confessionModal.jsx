import { useState, useEffect } from 'react';
import { X, Heart, MessageCircle, Send, Flag, Clock, Crown, Share2, CornerDownRight, Edit2, Trash2, Check, ExternalLink, Copy, CheckCircle2, MessageSquare } from 'lucide-react';
import { getConfessionById, likeConfession, unlikeConfession, hasLikedConfession, submitReply, updateConfession, deleteConfession } from '../lib/confessionQueries';

export default function ConfessionModal({ confession, onClose }) {
  const [fullConfession, setFullConfession] = useState(confession);
  const [hasLiked, setHasLiked] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState(null); // Track which reply we're responding to
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState('');
  const [isOwner, setIsOwner] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);


  useEffect(() => {
    loadFullConfession();
    setHasLiked(hasLikedConfession(confession._id));
    
    // Check ownership
    const myConfessions = JSON.parse(localStorage.getItem('atbu_my_confessions') || '[]');
    setIsOwner(myConfessions.includes(confession._id));

    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [confession._id]);

  const loadFullConfession = async () => {
    try {
      setLoading(true);
      const data = await getConfessionById(confession._id);
      if (data) {
        setFullConfession(data);
        setEditText(data.text);
      }
    } catch (error) {
      console.error('Error loading confession:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!editText.trim() || editText === fullConfession.text) {
      setIsEditing(false);
      return;
    }

    try {
      setIsSubmitting(true);
      await updateConfession(fullConfession._id, editText);
      setFullConfession(prev => ({ ...prev, text: editText }));
      setIsEditing(false);
      setToast({ message: 'Confession updated successfully!', type: 'success' });
    } catch (error) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete your confession? This action cannot be undone.')) return;

    try {
      setIsSubmitting(true);
      await deleteConfession(fullConfession._id);
      
      // Remove from localStorage
      const myConfessions = JSON.parse(localStorage.getItem('atbu_my_confessions') || '[]');
      const updated = myConfessions.filter(id => id !== fullConfession._id);
      localStorage.setItem('atbu_my_confessions', JSON.stringify(updated));

      onClose();
    } catch (error) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async () => {
    try {
      if (hasLiked) {
        await unlikeConfession(fullConfession._id);
        setHasLiked(false);
        setFullConfession(prev => ({ ...prev, likes: prev.likes - 1 }));
      } else {
        await likeConfession(fullConfession._id);
        setHasLiked(true);
        setFullConfession(prev => ({ ...prev, likes: prev.likes + 1 }));
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    
    if (!replyText.trim()) return;

    setIsSubmitting(true);
    try {
      const newReply = await submitReply(
        fullConfession._id, 
        replyText,
        replyingTo, // Pass parent reply ID for nested replies
        {
          ip: 'client-side',
          location: 'Nigeria'
        }
      );

      // Add new reply to local state
      setFullConfession(prev => ({
        ...prev,
        replies: [...(prev.replies || []), newReply]
      }));

      setReplyText('');
      setReplyingTo(null); // Clear reply target
    } catch (error) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/confessions?id=${fullConfession._id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'ATBU Confession',
          text: fullConfession.text.substring(0, 100) + '...',
          url: shareUrl
        });
      } catch (err) {
        console.log('Share canceled');
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    const shareUrl = `${window.location.origin}/confessions?id=${fullConfession._id}`;
    navigator.clipboard.writeText(shareUrl);
    setToast({ message: 'Link copied to clipboard!', type: 'success' });
  };

  const handleWhatsAppShare = () => {
    const shareUrl = `${window.location.origin}/confessions?id=${fullConfession._id}`;
    const text = `Check out this confession on ATBU Hub:\n\n"${fullConfession.text.substring(0, 100)}${fullConfession.text.length > 100 ? '...' : ''}"\n\nRead more here: ${shareUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };


  const formatTimeAgo = (date) => {
    if (!date) return '';
    const now = new Date();
    const posted = new Date(date);
    if (isNaN(posted.getTime())) return '';
    const diffMs = now - posted;

    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return posted.toLocaleDateString();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[hsl(var(--background))] overflow-hidden flex flex-col animate-fadeIn">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 sm:px-6 py-4 border-b border-white/10 bg-[hsl(var(--background))]/95 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
          <div>
            <h2 className="text-lg font-bold text-white">Confession</h2>
            <p className="text-xs text-gray-500">Anonymous post</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Owner Actions */}
          {isOwner && (
            <div className="flex items-center gap-2 mr-2 border-r border-white/10 pr-2">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  isEditing ? 'bg-purple-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-purple-400'
                }`}
                title="Edit confession"
              >
                <Edit2 className="w-5 h-5" />
              </button>
              <button
                onClick={handleDelete}
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-red-500/20 flex items-center justify-center transition-colors text-gray-400 hover:text-red-400"
                title="Delete confession"
                disabled={isSubmitting}
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* WhatsApp Share */}
          <button
            onClick={handleWhatsAppShare}
            className="w-10 h-10 rounded-full bg-[#25D366]/10 hover:bg-[#25D366]/20 flex items-center justify-center transition-colors group"
            title="Share on WhatsApp"
          >
            <MessageSquare className="w-5 h-5 text-[#25D366]" />
          </button>

          {/* Copy Link */}
          <button
            onClick={handleCopyLink}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
            title="Copy reference link"
          >
            <Copy className="w-5 h-5 text-gray-400" />
          </button>

          {/* Native Share */}
          <button
            onClick={handleShare}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
            title="Other share options"
          >
            <Share2 className="w-5 h-5 text-gray-400" />
          </button>


          {/* Report Button */}
          <button
            onClick={() => {
              if (confirm('Report this confession as inappropriate?')) {
                // Handle report
                alert('Confession reported. Thank you for helping keep the community safe.');
              }
            }}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-red-500/20 flex items-center justify-center transition-colors group"
          >
            <Flag className="w-5 h-5 text-gray-400 group-hover:text-red-400" />
          </button>
        </div>
      </div>

      {/* Content Container */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {/* Main Confession */}
          <div className="px-4 sm:px-6 py-8">
            {/* Top Badge if applicable */}
            {fullConfession.isTopConfession && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-full mb-6">
                <Crown className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-400 text-sm font-semibold">Top Confession This Week</span>
              </div>
            )}

            {/* Confession Text */}
            {isEditing ? (
              <div className="mb-8 space-y-4">
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full min-h-[150px] p-4 bg-white/5 border border-purple-500/30 rounded-xl text-white text-xl focus:outline-none focus:bg-white/10 transition-all resize-none"
                  autoFocus
                />
                <div className="flex gap-4">
                  <button
                    onClick={handleEdit}
                    disabled={isSubmitting || !editText.trim() || editText === fullConfession.text}
                    className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 disabled:opacity-30 transition-all"
                  >
                    {isSubmitting ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                    Save Changes
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditText(fullConfession.text);
                    }}
                    className="px-6 py-2 bg-white/5 text-gray-400 rounded-lg hover:bg-white/10 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-2xl sm:text-3xl text-white leading-relaxed mb-8 font-light">
                {fullConfession.text}
              </p>
            )}

            {/* Author & Time */}
            <div className="flex items-center gap-3 text-gray-400 mb-6">
              <span className="text-purple-400 font-semibold">{fullConfession.anonId}</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{formatTimeAgo(fullConfession.createdAt)}</span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center gap-6 py-4 border-y border-white/10">
              {/* Like Button */}
              <button
                onClick={handleLike}
                className="flex items-center gap-2 text-gray-400 hover:text-pink-400 transition-colors group"
              >
                <Heart 
                  className={`w-6 h-6 transition-all ${
                    hasLiked 
                      ? 'fill-pink-500 text-pink-500' 
                      : 'group-hover:scale-110'
                  }`}
                />
                <span className="font-semibold">{fullConfession.likes || 0}</span>
              </button>

              {/* Reply Count */}
              <div className="flex items-center gap-2 text-gray-400">
                <MessageCircle className="w-6 h-6" />
                <span className="font-semibold">{fullConfession.replies?.length || 0}</span>
              </div>
            </div>
          </div>

          {/* Replies Section */}
          <div className="px-4 sm:px-6 py-6 bg-black/20">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Replies ({fullConfession.replies?.length || 0})
            </h3>

            {/* Reply Form */}
            <div className="mb-8 sticky top-0 bg-[hsl(var(--background))]/95 backdrop-blur-md py-4 -mx-4 px-4 sm:-mx-6 sm:px-6 border-b border-white/10 z-10">
              {/* Show who we're replying to */}
              {replyingTo && (
                <div className="flex items-center justify-between mb-2 px-3 py-2 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                  <span className="text-sm text-purple-400">
                    Replying to {fullConfession.replies?.find(r => r._key === replyingTo)?.anonId}
                  </span>
                  <button
                    onClick={() => setReplyingTo(null)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              
              <div className="relative">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      handleReplySubmit(e);
                    }
                    if (e.key === 'Escape') {
                      setReplyingTo(null);
                    }
                  }}
                  placeholder={replyingTo ? "Write your reply..." : "Add an anonymous reply..."}
                  className="w-full pl-4 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-all"
                  disabled={isSubmitting}
                  maxLength={300}
                />
                <button
                  onClick={handleReplySubmit}
                  disabled={!replyText.trim() || isSubmitting}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {replyingTo ? "Press Esc to cancel • " : ""}Your reply will be posted anonymously • {300 - replyText.length} characters left
              </p>
            </div>

            {/* Replies List */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
              </div>
            ) : fullConfession.replies && fullConfession.replies.length > 0 ? (
              <div className="space-y-6">
                {fullConfession.replies
                  .filter(reply => !reply.parentReplyId) // Show top-level replies first
                  .map((reply, index) => {
                    // Find nested replies that belong to this one
                    const nestedReplies = fullConfession.replies.filter(nr => 
                      nr.parentReplyId === reply._key || nr.parentReplyId === reply.replyId
                    );
                    
                    return (
                      <div key={reply._key || index} className="space-y-3">
                        {/* Main Reply */}
                        <div
                          className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors"
                          style={{
                            animation: `fadeInUp 0.4s ease-out ${index * 0.05}s both`
                          }}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-purple-400 font-semibold text-sm">{reply.anonId}</span>
                              <span className="text-gray-600 font-bold">·</span>
                              <span className="text-gray-500 text-xs">{formatTimeAgo(reply.timestamp)}</span>
                            </div>
                          </div>

                          <p className="text-gray-200 leading-relaxed mb-3 text-[15px]">
                            {reply.text}
                          </p>

                          {/* Reply Button */}
                          <div className="flex items-center gap-4">
                            <button
                              onClick={() => {
                                setReplyingTo(reply._key || reply.replyId);
                                document.querySelector('input[type="text"]')?.focus();
                              }}
                              className="text-xs font-bold text-gray-500 hover:text-purple-400 transition-colors flex items-center gap-1.5"
                            >
                              Reply
                            </button>
                          </div>
                        </div>

                        {/* Nested Replies Thread */}
                        {nestedReplies.length > 0 && (
                          <div className="ml-6 space-y-3 border-l-2 border-white/5 pl-4">
                            {nestedReplies.map((nestedReply, nrIndex) => (
                              <div
                                key={nestedReply._key || nrIndex}
                                className="relative bg-white/[0.03] border border-white/5 rounded-xl p-3 hover:bg-white/5 transition-colors"
                                style={{
                                  animation: `fadeInUp 0.4s ease-out ${(index + nrIndex) * 0.05}s both`
                                }}
                              >
                                {/* Connection Arrow */}
                                <div className="absolute -left-[18px] top-6 text-white/10">
                                  <CornerDownRight className="w-4 h-4" />
                                </div>

                                <div className="flex items-start justify-between mb-1.5">
                                  <div className="flex items-center gap-2">
                                    <span className="text-purple-400 font-semibold text-xs">{nestedReply.anonId}</span>
                                    <span className="text-gray-600">·</span>
                                    <span className="text-gray-500 text-[10px]">{formatTimeAgo(nestedReply.timestamp)}</span>
                                  </div>
                                </div>

                                <p className="text-gray-300 leading-relaxed text-sm">
                                  {nestedReply.text}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="text-center py-12">
                <MessageCircle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500">No replies yet</p>
                <p className="text-gray-600 text-sm">Be the first to reply anonymously</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] animate-slideUp">
          <div className={`px-6 py-3 rounded-2xl backdrop-blur-md border flex items-center gap-3 shadow-2xl ${
            toast.type === 'success' 
              ? 'bg-green-500/20 border-green-500/30 text-green-400' 
              : 'bg-red-500/20 border-red-500/30 text-red-400'
          }`}>
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-semibold">{toast.message}</span>
          </div>
        </div>
      )}

      <style>{`

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}