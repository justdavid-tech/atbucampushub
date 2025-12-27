import Navbar from "../components/navbar";
import Footer from "../components/footer";

import { useState, useEffect, useMemo } from "react";
import FilterBar from "../components/filter";
import PostDetailModal from "../components/PostDetailModal";
import { getPostsByCategory } from "../lib/sanityQueries";
import {
  Film,
  Music,
  Mic,
  Users,
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Tag
} from "lucide-react";


function Entertainments() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = await getPostsByCategory('entertainment');
        setPosts(data);
      } catch (err) {
        console.error("Failed to fetch entertainment posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

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

  const handleFilterChange = (filters) => {
    if (filters.search !== undefined) setSearchQuery(filters.search);
    if (filters.sort !== undefined) setSortBy(filters.sort);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const stats = [
    {
      label: "Entertainment Events",
      value: "60+",
      icon: Film,
      color: "from-[hsl(var(--primary))] to-[hsl(var(--secondary))]",
    },
    {
      label: "Creative Talents",
      value: "200+",
      icon: Mic,
      color: "from-[hsl(var(--primary))] to-[hsl(var(--secondary))]",
    },
    {
      label: "Student Audience",
      value: "10k+",
      icon: Users,
      color: "from-[hsl(var(--primary))] to-[hsl(var(--secondary))]",
    },
  ];

    return (
        <>
            <Navbar />
              <div className="min-h-screen bg-[hsl(var(--background))]">
      <section className="relative bg-gradient-to-br from-[hsl(var(--background))] via-[hsl(210,45%,14%)] to-[hsl(var(--background))] overflow-hidden">

        {/* Background Glow */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[hsl(var(--primary))]/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[hsl(var(--secondary))]/10 rounded-full blur-3xl animate-pulse"></div>
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] opacity-30"></div>

        {/* Background Icon */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5">
          <Music className="w-[600px] h-[600px] text-white animate-float" strokeWidth={0.5} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-10">
            <a href="/" className="text-gray-400 hover:text-[hsl(var(--primary))]">Home</a>
            <ChevronRight className="w-4 h-4 text-gray-600" />
            <a href="/news" className="text-gray-400 hover:text-[hsl(var(--primary))]">News</a>
            <ChevronRight className="w-4 h-4 text-gray-600" />
            <span className="text-white font-medium">Entertainment</span>
          </nav>

          {/* Hero Grid */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left Content */}
            <div className="space-y-6 animate-fadeIn">

              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[hsl(var(--primary))]/20 to-[hsl(var(--secondary))]/20 border border-[hsl(var(--primary))]/30 rounded-full">
                <Sparkles className="w-4 h-4 text-[hsl(var(--primary))]" />
                <span className="text-[hsl(var(--primary))] text-sm font-medium">
                  Music • Movies • Culture • Comedy
                </span>
              </div>

              {/* Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-white">Experience</span><br />
                <span className="bg-gradient-to-r from-[hsl(var(--primary))] via-[hsl(var(--secondary))] to-[hsl(var(--primary))] bg-clip-text text-transparent animate-gradient">
                  Campus Entertainment
                </span><br />
                <span className="text-white">Like Never Before</span>
              </h1>

              {/* Description */}
              <p className="text-lg text-gray-300 max-w-xl leading-relaxed">
                From concerts and movie nights to comedy shows and talent hunts,
                discover the fun side of campus life and stay updated on all entertainment activities.
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button className="px-6 py-3 bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))] text-white rounded-lg font-semibold hover:scale-105 transition-all flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  View Entertainment Events
                </button>

                <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-all flex items-center gap-2">
                  <Mic className="w-5 h-5" />
                  Showcase Your Talent
                </button>
              </div>

              {/* Quick Info */}
              <div className="flex items-center gap-4 text-sm text-gray-400 pt-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[hsl(var(--primary))]" />
                  <span>Updated Weekly</span>
                </div>
                <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[hsl(var(--secondary))]" />
                  <span>All Event Venues</span>
                </div>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative flex items-center justify-center">
              <div className="relative w-72 h-72 rounded-full bg-gradient-to-br from-[hsl(var(--primary))]/10 to-[hsl(var(--secondary))]/10 border border-white/10 flex items-center justify-center backdrop-blur-sm animate-float">
                <div className="w-36 h-36 rounded-full bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--secondary))] flex items-center justify-center shadow-2xl">
                  <Music className="w-18 h-18 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid sm:grid-cols-3 gap-6 pt-12 border-t border-white/10 mt-12">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/10 rounded-xl p-6 flex items-center gap-4 hover:scale-105 transition-all"
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* --- Filter Bar --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <FilterBar 
          onFilterChange={handleFilterChange} 
          totalResults={filteredPosts.length} 
        />
      </div>

       {/* Entertainment News Grid */}
       <section className="py-20 pt-12 relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Entertainment News</h2>
            <p className="text-gray-400">Latest movies, shows, and cultural events</p>
          </div>
        </div>

        {loading ? (
           <div className="flex justify-center py-20">
             <div className="w-12 h-12 border-4 border-[hsl(var(--primary))] border-t-transparent rounded-full animate-spin"></div>
           </div>
        ) : filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <article 
                key={post._id}
                className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-[hsl(var(--primary))]/30 hover:bg-white/10 transition-all duration-300 flex flex-col h-full cursor-pointer"
                onClick={() => setSelectedPost(post)}
                style={{
                  animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`
                }}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={post.imageUrl || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop'} 
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-[hsl(var(--primary))]/90 backdrop-blur-md rounded-full text-xs font-bold text-white">
                      <Tag className="w-3 h-3" />
                      {post.entertainmentType || 'Entertainment'}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                    <Calendar className="w-4 h-4 text-[hsl(var(--primary))]" />
                    <time>{formatDate(post.publishedAt)}</time>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[hsl(var(--primary))] transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-400 text-sm line-clamp-3 mb-6 flex-1">
                    {post.excerpt}
                  </p>

                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPost(post);
                    }}
                    className="w-full py-3 bg-white/5 hover:bg-[hsl(var(--primary))] text-white rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                  >
                    Read More
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
            <Film className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Entertainment News Found</h3>
            <p className="text-gray-400">Try adjusting your search or check back later.</p>
          </div>
        )}
      </section>

      {/* Post Detail Modal */}
      {selectedPost && (
        <PostDetailModal 
          post={selectedPost} 
          onClose={() => setSelectedPost(null)} 
        />
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
            <Footer />
        </>
    )
}

export default Entertainments