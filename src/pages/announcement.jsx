import { Megaphone, ChevronRight, Bell, TrendingUp, Clock, Calendar, User, ArrowRight, Tag, AlertCircle, Trophy, Music } from 'lucide-react';
import FilterBar from "../components/filter";
import Pagination from '../components/pagination';
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import PostDetailModal from "../components/PostDetailModal";
import { useState, useMemo, useEffect } from 'react';
import { getPostsByCategory } from '../lib/sanityQueries';

function Announcement() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(6);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('latest');
    const [selectedPost, setSelectedPost] = useState(null);

    // Fetch posts from Sanity
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const data = await getPostsByCategory('announcements'); // Fetch only announcements
                setPosts(data);
            } catch (err) {
                console.error("Failed to fetch posts:", err);
                setError("Failed to load announcements. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    const stats = [
    { icon: Bell, label: 'Active Announcements', value: '24', color: 'from-[hsl(var(--primary))] to-[hsl(var(--primary))] ' },
    { icon: TrendingUp, label: 'This Week', value: '8', color: 'from-[hsl(var(--primary))] to-[hsl(var(--primary))] ' },
    { icon: Clock, label: 'Latest Update', value: '2h ago', color: 'from-[hsl(var(--primary))] to-[hsl(var(--primary))] ' }
  ];

  // Category configurations
  const categoryConfig = {
    announcements: {
      icon: AlertCircle,
      color: 'from-[hsl(var(--primary))] to-pink-600',
      bgColor: 'bg-[hsl(var(--primary))]/10',
      textColor: 'text-[hsl(var(--primary))]',
      label: 'Announcement'
    },
    events: {
      icon: Calendar,
      color: 'from-purple-500 to-violet-600',
      bgColor: 'bg-purple-500/10',
      textColor: 'text-purple-400',
      label: 'Event'
    },
    academics: {
      icon: User,
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-500/10',
      textColor: 'text-blue-400',
      label: 'Academic'
    },
    sports: {
      icon: Trophy,
      color: 'from-emerald-500 to-teal-600',
      bgColor: 'bg-emerald-500/10',
      textColor: 'text-emerald-400',
      label: 'Sports'
    },
    entertainment: {
      icon: Music,
      color: 'from-pink-500 to-rose-600',
      bgColor: 'bg-pink-500/10',
      textColor: 'text-pink-400',
      label: 'Entertainment'
    }
  };

  // Filter and Sort Logic
  const filteredPosts = useMemo(() => {
    let result = [...posts];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(post => 
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        (post.tags && post.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }

    // Sort
    result.sort((a, b) => {
      const dateA = new Date(a.publishedAt);
      const dateB = new Date(b.publishedAt);

      switch (sortBy) {
        case 'latest':
          return dateB - dateA;
        case 'oldest':
          return dateA - dateB;
        case 'alphabetical-asc':
            return a.title.localeCompare(b.title);
        case 'alphabetical-desc':
            return b.title.localeCompare(a.title);
        default:
          return dateB - dateA;
      }
    });

    return result;
  }, [posts, searchQuery, sortBy]);

  // Pagination Logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  // Handlers
  const handleFilterChange = (filters) => {
    if (filters.search !== undefined) setSearchQuery(filters.search);
    if (filters.sort !== undefined) setSortBy(filters.sort);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Priority badge
  const getPriorityBadge = (priority) => {
    if (!priority || priority === 'normal') return null;
    
    const config = {
      urgent: { icon: '🔴', label: 'Urgent', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
      important: { icon: '🟡', label: 'Important', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' }
    };

    const badge = config[priority];
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${badge.color}`}>
        <span>{badge.icon}</span>
        {badge.label}
      </span>
    );
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));

    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
      return (
          <>
            <Navbar />
            <div className="min-h-screen bg-[hsl(var(--background))] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-[hsl(var(--primary))] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-400 animate-pulse">Loading announcements...</p>
                </div>
            </div>
            <Footer />
          </>
      );
  }

  if (error) {
      return (
          <>
            <Navbar />
            <div className="min-h-screen bg-[hsl(var(--background))] flex items-center justify-center">
                <div className="text-center max-w-md px-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 mb-6">
                        <AlertCircle className="w-8 h-8 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-3">Oops! Something went wrong</h2>
                    <p className="text-gray-400 mb-6">{error}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-[hsl(var(--primary))] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
                    >
                        Try Again
                    </button>
                </div>
            </div>
            <Footer />
          </>
      );
  }

  return (
    <>
    <Navbar />  
    <section className="relative bg-gradient-to-br from-[hsl(var(--background))] via-[hsl(210,45%,14%)] to-[hsl(var(--background))] overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[hsl(var(--primary))]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[hsl(var(--secondary))]/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] opacity-30"></div>

      {/* Animated Megaphone Icon Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5">
        <Megaphone className="w-[600px] h-[600px] text-white animate-float" strokeWidth={0.5} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-8 flex-wrap">
          <a 
            href="/" 
            className="text-gray-400 hover:text-[hsl(var(--primary))] transition-colors duration-300 flex items-center gap-1"
          >
            Home
          </a>
          <ChevronRight className="w-4 h-4 text-gray-600" />
          <a 
            href="/news" 
            className="text-gray-400 hover:text-[hsl(var(--primary))] transition-colors duration-300"
          >
            News
          </a>
          <ChevronRight className="w-4 h-4 text-gray-600" />
          <span className="text-white font-medium">Announcements</span>
        </nav>

        {/* Hero Content */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center py-8 lg:py-12">
          {/* Left Content */}
          <div className="space-y-6 animate-fadeIn">
            {/* Category Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[hsl(var(--primary))]/20 to-[hsl(var(--secondary))]/20 border border-[hsl(var(--primary))]/30 rounded-full backdrop-blur-sm">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[hsl(var(--primary))] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[hsl(var(--primary))]"></span>
              </div>
              <span className="text-[hsl(var(--primary))] font-medium text-sm">Official Campus Announcements</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-white">Stay Informed with</span>
              <br />
              <span className="bg-gradient-to-r from-[hsl(var(--primary))] via-[hsl(var(--secondary))] to-[hsl(var(--primary))] bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                Official Updates
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg text-gray-300 leading-relaxed max-w-xl">
              Get the latest official announcements, important notices, and critical updates from ATBU administration and departments. Never miss what matters.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="group relative px-6 py-3 bg-[hsl(var(--primary))] text-white rounded-lg font-semibold overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(239,45,86,0.4)]">
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Bell className="w-5 h-5" />
                  Subscribe to Updates
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))] opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>

              <button className="group px-6 py-3 bg-transparent text-white border-2 border-white/20 rounded-lg font-semibold backdrop-blur-sm hover:bg-white/5 hover:border-white/40 transition-all duration-300">
                <span className="flex items-center justify-center gap-2">
                  View Archive
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </div>
          </div>

          {/* Right Content - Stats & Icon */}
          <div className="relative flex items-center justify-center">
            {/* Large Icon Container */}
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--primary))]/20 to-[hsl(var(--secondary))]/20 rounded-full blur-3xl animate-pulse"></div>
              
              {/* Main Icon */}
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-gradient-to-br from-[hsl(var(--primary))]/10 to-[hsl(var(--secondary))]/10 border border-white/10 flex items-center justify-center backdrop-blur-sm animate-float">
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--secondary))] flex items-center justify-center shadow-2xl">
                  <Megaphone className="w-16 h-16 sm:w-20 sm:h-20 text-white" strokeWidth={2} />
                </div>
              </div>

              {/* Floating Stats Cards */}
              <div className="absolute -bottom-4 -left-4 sm:-left-8 w-40 sm:w-48 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-3 sm:p-4 shadow-2xl animate-float-delayed">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--primary))] rounded-lg flex items-center justify-center">
                    <Bell className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-lg">24</div>
                    <div className="text-gray-400 text-xs">Active</div>
                  </div>
                </div>
              </div>

              <div className="absolute -top-4 -right-4 sm:-right-8 w-40 sm:w-48 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-3 sm:p-4 shadow-2xl animate-float-slow">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--primary))] rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-lg">8 New</div>
                    <div className="text-gray-400 text-xs">This Week</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Stats Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 pt-8 lg:pt-12 border-t border-white/10">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105"
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
              }}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 1s ease-out;
        }

        .animate-gradient {
          animation: gradient 3s ease infinite;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float 4s ease-in-out infinite;
          animation-delay: 0.5s;
        }

        .animate-float-slow {
          animation: float 5s ease-in-out infinite;
          animation-delay: 1s;
        }
      `}</style>
    </section>
    <FilterBar onFilterChange={handleFilterChange} totalResults={filteredPosts.length} />

    {/* News Grid */}
        <section className="relative py-12 bg-[hsl(var(--background))] border-t border-[hsl(var(--primary))]/10 overflow-hidden">
      {/* Accent Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[500px] bg-[hsl(var(--primary))]/5 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentPosts.map((post, index) => {
            const config = categoryConfig[post.category] || categoryConfig['announcements'];
            const Icon = config.icon || Bell;

            return (
              <article
                key={post._id}
                className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 hover:border-[hsl(var(--primary))]/30 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(239,45,86,0.15)] cursor-pointer"
                onClick={() => setSelectedPost(post)}
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                }}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.imageUrl || 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800'}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`inline-flex items-center gap-2 px-3 py-1.5 ${config?.bgColor} backdrop-blur-md rounded-full text-xs font-medium ${config?.textColor} border border-white/10`}>
                      <Icon className="w-3.5 h-3.5" />
                      {config?.label || post.category}
                    </span>
                  </div>

                  {/* Priority Badge */}
                  {post.priority && (
                    <div className="absolute top-4 right-4">
                      {getPriorityBadge(post.priority)}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Date */}
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                    <Calendar className="w-4 h-4" />
                    <time>{formatDate(post.publishedAt)}</time>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-[hsl(var(--primary))] transition-colors duration-300">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.slice(0, 3).map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-white/5 rounded-full text-xs text-gray-400 group-hover:text-white group-hover:bg-[hsl(var(--primary))]/20 transition-all duration-300"
                        >
                          <Tag className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Read More Button */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPost(post);
                    }}
                    className="group/btn flex items-center gap-2 text-sm font-semibold text-[hsl(var(--primary))] hover:gap-3 transition-all duration-300"
                  >
                    Read More
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>

                {/* Hover Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${config?.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none rounded-2xl`}></div>
              </article>
            );
          })}
        </div>

        {/* Empty State (show when no posts) */}
        {currentPosts.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 mb-6">
              <AlertCircle className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">No posts found</h3>
            <p className="text-gray-400 mb-6">
              There are no posts in this category yet. Check back later!
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
      postsPerPage={postsPerPage}
      totalPosts={filteredPosts.length}
    />

    {/* Post Detail Modal */}
    {selectedPost && (
      <PostDetailModal 
        post={selectedPost} 
        onClose={() => setSelectedPost(null)} 
      />
    )}

    <Footer />
    </>
    );
};

export default Announcement;
