import { useState, useEffect } from 'react';
import { X, Heart, MessageCircle, Send, Flag, Clock, Crown, Share2 } from 'lucide-react';
import { getConfessionById, likeConfession, unlikeConfession, hasLikedConfession, submitReply } from '../lib/confessionQueries';

export default function ConfessionModal({ confession, onClose }) {
  const [fullConfession, setFullConfession] = useState(confession);
  const [hasLiked, setHasLiked] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFullConfession();
    setHasLiked(hasLikedConfession(confession._id));
    
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
      }
    } catch (error) {
      console.error('Error loading confession:', error);
    } finally {
      setLoading(false);
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
      const newReply = await submitReply(fullConfession._id, replyText, {
        ip: 'client-side',
        location: 'Nigeria'
      });

      // Add new reply to local state
      setFullConfession(prev => ({
        ...prev,
        replies: [...(prev.replies || []), newReply]
      }));

      setReplyText('');
    } catch (error) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'ATBU Confession',
          text: fullConfession.text.substring(0, 100) + '...',
          url: window.location.href
        });
      } catch (err) {
        console.log('Share canceled');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const posted = new Date(date);
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
          {/* Share Button */}
          <button
            onClick={handleShare}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
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
            <p className="text-2xl sm:text-3xl text-white leading-relaxed mb-8 font-light">
              {fullConfession.text}
            </p>

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
              <div className="relative">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      handleReplySubmit(e);
                    }
                  }}
                  placeholder="Add an anonymous reply..."
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
                Your reply will be posted anonymously • {300 - replyText.length} characters left
              </p>
            </div>

            {/* Replies List */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
              </div>
            ) : fullConfession.replies && fullConfession.replies.length > 0 ? (
              <div className="space-y-4">
                {fullConfession.replies.map((reply, index) => (
                  <div
                    key={index}
                    className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors"
                    style={{
                      animation: `fadeInUp 0.4s ease-out ${index * 0.05}s both`
                    }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-purple-400 font-semibold text-sm">{reply.anonId}</span>
                        <span className="text-gray-600">•</span>
                        <span className="text-gray-500 text-xs">{formatTimeAgo(reply.timestamp)}</span>
                      </div>
                    </div>

                    <p className="text-gray-300 leading-relaxed">
                      {reply.text}
                    </p>
                  </div>
                ))}
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

      <style jsx>{`
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