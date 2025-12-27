import { useState, useEffect, useRef } from 'react';
import { X, Heart, MessageCircle, Share2, Send, User, Bookmark, MoreVertical, ChevronLeft, ChevronRight, Volume2, VolumeX } from 'lucide-react';
import { client, urlFor } from '../lib/sanity';


export default function PostDetailModal({ post, onClose }) {
  const [likes, setLikes] = useState(post.likes || 0);
  const [hasLiked, setHasLiked] = useState(false);
  const [hasBookmarked, setHasBookmarked] = useState(false);
  const [comments, setComments] = useState(post.comments || []);
  const [newComment, setNewComment] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const commentInputRef = useRef(null);
  const modalRef = useRef(null);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Check if user has "logged in"
  useEffect(() => {
    const storedUser = localStorage.getItem('atbu_user');
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  // Handle Like
  const handleLike = async () => {
    if (hasLiked) return;

    // Optimistic Update with animation
    setLikes(prev => prev + 1);
    setHasLiked(true);

    try {
      await client
        .patch(post._id)
        .setIfMissing({ likes: 0 })
        .inc({ likes: 1 })
        .commit();
    } catch (err) {
      console.error("Failed to like post:", err);
      setLikes(prev => prev - 1);
      setHasLiked(false);
    }
  };

  // Handle Bookmark
  const handleBookmark = async () => {
    setHasBookmarked(!hasBookmarked);
    // Add your bookmark logic here
  };

  // Handle Comment
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setIsSubmitting(true);

    const commentObj = {
      name: user,
      text: newComment,
      timestamp: new Date().toISOString(),
      avatar: `https://ui-avatars.com/api/?name=${user}&background=random`
    };

    const updatedComments = [...comments, commentObj];
    setComments(updatedComments);
    setNewComment('');

    try {
      await client
        .patch(post._id)
        .setIfMissing({ comments: [] })
        .append('comments', [commentObj])
        .commit();
    } catch (err) {
      console.error("Failed to post comment:", err);
      setComments(prev => prev.filter(c => c !== commentObj));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Login
  const handleLogin = (e) => {
    e.preventDefault();
    if (!authorName.trim()) return;
    localStorage.setItem('atbu_user', authorName);
    setUser(authorName);
  };

  // Handle Share
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  // Focus comment input when clicking comment button
  const focusCommentInput = () => {
    commentInputRef.current?.focus();
  };

  // Mock multiple images (in real app, fetch from post)
  const images = [
    post.imageUrl || 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1600&auto=format&fit=crop'
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg overflow-y-auto">
      <div className="min-h-screen" ref={modalRef}>
        
        {/* Top Navigation Bar */}
        <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[hsl(var(--primary))] rounded-full flex items-center justify-center">
                  <span className="font-bold text-white">A</span>
                </div>
                <div>
                  <h2 className="text-white font-semibold">ATBU Hub</h2>
                  <p className="text-gray-400 text-xs">Posted {new Date(post.publishedAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={handleShare}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <Share2 className="w-5 h-5 text-white" />
              </button>
              <button 
                onClick={handleBookmark}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <Bookmark className={`w-5 h-5 ${hasBookmarked ? 'text-yellow-500 fill-current' : 'text-white'}`} />
              </button>
              <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <MoreVertical className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column - Media */}
            <div className="lg:col-span-2">
              {/* Image Carousel */}
              <div className="relative bg-black rounded-2xl overflow-hidden mb-6">
                <div className="relative h-[500px] lg:h-[600px]">
                  <img 
                    src={images[activeImageIndex]} 
                    alt={post.title}
                    className="w-full h-full object-contain"
                  />
                  
                  {/* Navigation Arrows */}
                  {images.length > 1 && (
                    <>
                      <button 
                        onClick={() => setActiveImageIndex(prev => (prev - 1 + images.length) % images.length)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button 
                        onClick={() => setActiveImageIndex(prev => (prev + 1) % images.length)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </>
                  )}
                  
                  {/* Image Indicators */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          idx === activeImageIndex 
                            ? 'bg-white w-8' 
                            : 'bg-white/50 hover:bg-white/70'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-6">
                {/* Title and Metadata */}
                <div>
                  <div className="flex gap-2 mb-4 flex-wrap">
                    <span className="px-3 py-1 bg-[hsl(var(--primary))] text-white text-xs font-bold rounded-full uppercase">
                      {post.category || 'News'}
                    </span>
                    {post.tags?.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-white/10 text-white/90 text-xs rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  
                  <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
                    {post.title}
                  </h1>
                  
                  <p className="text-xl text-gray-300 font-light leading-relaxed mb-6">
                    {post.excerpt}
                  </p>
                </div>

                {/* Article Body */}
                <div className="prose prose-invert max-w-none prose-lg">
                  {post.body?.map((block, i) => {
                    if (block._type === 'block' && block.children) {
                      return (
                        <p key={block._key || i} className="text-gray-300 text-lg leading-relaxed mb-6">
                          {block.children.map(child => child.text).join('')}
                        </p>
                      );
                    }
                    if (block._type === 'image') {
                      return (
                        <div key={block._key || i} className="my-8">
                          <img 
                            src={urlFor(block).url()} 
                            alt={block.alt || ''}
                            className="rounded-xl w-full max-w-2xl mx-auto"
                          />
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            </div>

            {/* Right Column - Interactions & Comments */}
            <div className="lg:col-span-1">
              {/* Stats Bar */}
              <div className="bg-white/5 rounded-2xl p-6 mb-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={handleLike}
                      className={`flex items-center gap-2 ${hasLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'} transition-colors`}
                    >
                      <Heart className={`w-6 h-6 ${hasLiked ? 'fill-current' : ''}`} />
                      <span className="font-semibold">{likes}</span>
                    </button>
                    
                    <button 
                      onClick={focusCommentInput}
                      className="flex items-center gap-2 text-gray-400 hover:text-[hsl(var(--primary))] transition-colors"
                    >
                      <MessageCircle className="w-6 h-6" />
                      <span className="font-semibold">{comments.length}</span>
                    </button>
                  </div>
                  
                  <div className="text-gray-400 text-sm">
                    {new Date(post.publishedAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="grid grid-cols-4 gap-2">
                  <button 
                    onClick={handleLike}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-colors ${
                      hasLiked 
                        ? 'bg-red-500/20 text-red-500' 
                        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-red-500'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${hasLiked ? 'fill-current' : ''}`} />
                    <span className="text-xs font-medium">Like</span>
                  </button>
                  
                  <button 
                    onClick={focusCommentInput}
                    className="flex flex-col items-center gap-1 p-3 rounded-xl bg-white/5 text-gray-400 hover:bg-white/10 hover:text-[hsl(var(--primary))] transition-colors"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-xs font-medium">Comment</span>
                  </button>
                  
                  <button 
                    onClick={handleShare}
                    className="flex flex-col items-center gap-1 p-3 rounded-xl bg-white/5 text-gray-400 hover:bg-white/10 hover:text-[hsl(var(--primary))] transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                    <span className="text-xs font-medium">Share</span>
                  </button>
                  
                  <button 
                    onClick={handleBookmark}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-colors ${
                      hasBookmarked 
                        ? 'bg-yellow-500/20 text-yellow-500' 
                        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-yellow-500'
                    }`}
                  >
                    <Bookmark className={`w-5 h-5 ${hasBookmarked ? 'fill-current' : ''}`} />
                    <span className="text-xs font-medium">Save</span>
                  </button>
                </div>
              </div>

              {/* Comments Section */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  Comments
                  <span className="text-sm font-normal text-gray-500 bg-white/10 px-2 py-1 rounded-full">
                    {comments.length}
                  </span>
                </h3>

                {/* Comment Form */}
                <div className="mb-6">
                  {user ? (
                    <form onSubmit={handleCommentSubmit} className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-[hsl(var(--primary))] rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="font-bold text-white">
                            {user.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1">
                          <input 
                            ref={commentInputRef}
                            type="text" 
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a comment..." 
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[hsl(var(--primary))]"
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between pl-13">
                        <div className="text-xs text-gray-500">
                          Posting as <strong className="text-white">{user}</strong>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            type="submit" 
                            disabled={!newComment.trim() || isSubmitting}
                            className="px-4 py-2 bg-[hsl(var(--primary))] text-white rounded-lg hover:bg-[hsl(var(--primary))]/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
                          >
                            {isSubmitting ? 'Posting...' : 'Post'}
                          </button>
                          <button 
                            type="button"
                            onClick={() => {
                              localStorage.removeItem('atbu_user'); 
                              setUser(null);
                              setAuthorName('');
                            }}
                            className="px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
                          >
                            Logout
                          </button>
                        </div>
                      </div>
                    </form>
                  ) : (
                    <form onSubmit={handleLogin} className="space-y-3">
                      <div className="flex gap-3">
                        <input 
                          type="text" 
                          value={authorName}
                          onChange={(e) => setAuthorName(e.target.value)}
                          placeholder="Enter your name to comment" 
                          className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[hsl(var(--primary))]"
                        />
                        <button 
                          type="submit"
                          disabled={!authorName.trim()}
                          className="px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 disabled:opacity-50 font-semibold whitespace-nowrap"
                        >
                          Join Discussion
                        </button>
                      </div>
                    </form>
                  )}
                </div>

                {/* Comments List */}
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {comments.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageCircle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-500">No comments yet. Start the conversation!</p>
                    </div>
                  ) : (
                    comments.map((comment, idx) => (
                      <div key={idx} className="bg-white/5 p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-white">
                              {comment.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-white text-sm">{comment.name}</span>
                                <span className="text-xs text-gray-500">•</span>
                                <span className="text-xs text-gray-500">
                                  {new Date(comment.timestamp).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <p className="text-gray-300 text-sm leading-relaxed">{comment.text}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}