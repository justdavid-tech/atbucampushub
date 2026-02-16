import { useState, useEffect } from 'react';
import { Heart, MessageCircle, Flag, Crown, TrendingUp, Clock, Filter } from 'lucide-react';
import { getConfessions, likeConfession, unlikeConfession, hasLikedConfession } from '../lib/confessionQueries';

export default function ConfessionsFeed({ onConfessionClick, topConfession }) {
  const [confessions, setConfessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('latest');
  const [likedConfessions, setLikedConfessions] = useState({});

  useEffect(() => {
    fetchConfessions();
  }, [sortBy]);

  useEffect(() => {
    // Check which confessions are liked
    const liked = {};
    confessions.forEach(confession => {
      liked[confession._id] = hasLikedConfession(confession._id);
    });
    setLikedConfessions(liked);
  }, [confessions]);

  const fetchConfessions = async () => {
    try {
      setLoading(true);
      const data = await getConfessions(sortBy, 50);
      setConfessions(data);
    } catch (error) {
      console.error('Error fetching confessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (confessionId, e) => {
    e.stopPropagation(); // Prevent opening confession

    try {
      if (likedConfessions[confessionId]) {
        // Unlike
        await unlikeConfession(confessionId);
        setLikedConfessions(prev => ({ ...prev, [confessionId]: false }));
        
        // Update local count
        setConfessions(prev => prev.map(c => 
          c._id === confessionId ? { ...c, likes: c.likes - 1 } : c
        ));
      } else {
        // Like
        await likeConfession(confessionId);
        setLikedConfessions(prev => ({ ...prev, [confessionId]: true }));
        
        // Update local count
        setConfessions(prev => prev.map(c => 
          c._id === confessionId ? { ...c, likes: c.likes + 1 } : c
        ));
      }
    } catch (error) {
      console.error('Error toggling like:', error);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading confessions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Confession */}
      {topConfession && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Crown className="w-5 h-5 text-yellow-400" />
            <h2 className="text-xl font-bold text-white">Top Confession This Week</h2>
          </div>
          
          <div
            onClick={() => onConfessionClick(topConfession)}
            className="group relative bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-sm border-2 border-yellow-500/30 rounded-2xl p-6 hover:border-yellow-500/50 transition-all duration-300 cursor-pointer hover:scale-[1.02]"
          >
            <div className="absolute top-4 right-4">
              <Crown className="w-8 h-8 text-yellow-400" />
            </div>

            <p className="text-lg text-white leading-relaxed mb-4 pr-12">
              {topConfession.text}
            </p>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <span className="text-purple-400 font-semibold">{topConfession.anonId}</span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-400">{formatTimeAgo(topConfession.createdAt)}</span>
              </div>

              <div className="flex items-center gap-4 text-gray-400">
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4 fill-pink-500 text-pink-500" />
                  <span className="font-semibold">{topConfession.likes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  <span>{topConfession.replyCount || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          All Confessions
        </h2>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-all cursor-pointer"
          >
            <option value="latest" className="bg-[hsl(var(--background))]">Latest First</option>
            <option value="popular" className="bg-[hsl(var(--background))]">Most Liked</option>
            <option value="trending" className="bg-[hsl(var(--background))]">Trending</option>
          </select>
        </div>
      </div>

      {/* Confessions Grid */}
      {confessions.length === 0 ? (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 mb-6">
            <MessageCircle className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">No confessions yet</h3>
          <p className="text-gray-400">
            Be the first to share your thoughts anonymously!
          </p>
        </div>
      ) : (
        <div className="grid gap-4 lg:gap-6">
          {confessions.map((confession, index) => (
            <article
              key={confession._id}
              onClick={() => onConfessionClick(confession)}
              className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-purple-500/30 transition-all duration-300 cursor-pointer hover:scale-[1.01]"
              style={{
                animation: `fadeInUp 0.5s ease-out ${index * 0.05}s both`
              }}
            >
              {/* Confession Text */}
              <p className="text-white leading-relaxed mb-4 text-lg">
                {confession.text}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between">
                {/* Author & Time */}
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-purple-400 font-semibold">{confession.anonId}</span>
                  <span className="text-gray-600">•</span>
                  <div className="flex items-center gap-1 text-gray-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{formatTimeAgo(confession.createdAt)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                  {/* Like Button */}
                  <button
                    onClick={(e) => handleLike(confession._id, e)}
                    className="flex items-center gap-1.5 text-gray-400 hover:text-pink-400 transition-colors group/like"
                  >
                    <Heart 
                      className={`w-5 h-5 transition-all ${
                        likedConfessions[confession._id] 
                          ? 'fill-pink-500 text-pink-500' 
                          : 'group-hover/like:scale-110'
                      }`}
                    />
                    <span className="font-semibold text-sm">{confession.likes || 0}</span>
                  </button>

                  {/* Reply Count */}
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-sm">{confession.replyCount || 0}</span>
                  </div>

                  {/* Report Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle report
                    }}
                    className="text-gray-500 hover:text-red-400 transition-colors"
                  >
                    <Flag className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Hover Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"></div>
            </article>
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}