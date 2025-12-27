
import { useState, useEffect, useMemo } from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import FilterBar from '../components/filter';
import PostDetailModal from '../components/PostDetailModal';
import { getPostsByCategory } from '../lib/sanityQueries';
import { Calendar, MapPin, Clock, AlertCircle, ArrowRight, ChevronRight, Users, Plus, Send, Sparkles } from 'lucide-react';

const Events = () => {


  const [showSubmitForm, setShowSubmitForm] = useState(false);

  const stats = [
    { icon: Calendar, label: 'Upcoming Events', value: '12', color: 'from-[hsl(var(--primary))] to-[hsl(var(--secondary))]' },
    { icon: Users, label: 'Total Attendees', value: '1.5K+', color: 'from-[hsl(var(--secondary))] to-[hsl(var(--primary))]' },
    { icon: MapPin, label: 'Event Locations', value: '8', color: 'from-[hsl(var(--primary))] to-[hsl(var(--secondary))]' }
  ];



  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        // category 'events' matches the value in newsPost schema
        const data = await getPostsByCategory('events');
        setEvents(data);
      } catch (err) {
        console.error("Failed to fetch events:", err);
        setError("Failed to load events. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Filter and Sort Logic
  const filteredEvents = useMemo(() => {
    let result = [...events];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(event => 
        event.title.toLowerCase().includes(query) ||
        event.excerpt.toLowerCase().includes(query) ||
        (event.tags && event.tags.some(tag => tag.toLowerCase().includes(query)))
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
  }, [events, searchQuery, sortBy]);

  const handleFilterChange = (filters) => {
    if (filters.search !== undefined) setSearchQuery(filters.search);
    if (filters.sort !== undefined) setSortBy(filters.sort);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date TBA';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'Time TBA';
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[hsl(var(--background))] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-[hsl(var(--primary))] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-400 animate-pulse">Loading upcoming events...</p>
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
                <h2 className="text-2xl font-bold text-white mb-3">Unable to Load Events</h2>
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
      <div className="min-h-screen bg-[hsl(var(--background))]">
    <section className="relative bg-gradient-to-br from-[hsl(var(--background))] via-[hsl(210,45%,14%)] to-[hsl(var(--background))] overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[hsl(var(--primary))]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[hsl(var(--secondary))]/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] opacity-30"></div>

      {/* Animated Calendar Icon Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5">
        <Calendar className="w-[600px] h-[600px] text-white animate-float" strokeWidth={0.5} />
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
          <span className="text-white font-medium">Events</span>
        </nav>

        {/* Hero Content */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center py-8 lg:py-12">
          {/* Left Content */}
          <div className="space-y-6 animate-fadeIn">
            {/* Category Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[hsl(var(--primary))]/20 to-[hsl(var(--secondary))]/20 border border-[hsl(var(--primary))]/30 rounded-full backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-[hsl(var(--primary))]" />
              <span className="text-[hsl(var(--primary))] font-medium text-sm">Campus Events & Activities</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-white">Never Miss</span>
              <br />
              <span className="bg-gradient-to-r from-[hsl(var(--primary))] via-[hsl(var(--secondary))] to-[hsl(var(--primary))] bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                What's Happening
              </span>
              <br />
              <span className="text-white">On Campus</span>
            </h1>

            {/* Description */}
            <p className="text-lg text-gray-300 leading-relaxed max-w-xl">
              From cultural nights to academic seminars, sports competitions to social gatherings - discover all the exciting events happening at ATBU.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="group relative px-6 py-3 bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))] text-white rounded-lg font-semibold overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(239,45,86,0.4)]">
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Calendar className="w-5 h-5" />
                  View All Events
                </span>
              </button>

              <button 
                onClick={() => setShowSubmitForm(true)}
                className="group px-6 py-3 bg-white/5 text-white border-2 border-[hsl(var(--primary))]/30 rounded-lg font-semibold backdrop-blur-sm hover:bg-[hsl(var(--primary))]/10 hover:border-[hsl(var(--primary))]/50 transition-all duration-300"
              >
                <span className="flex items-center justify-center gap-2">
                  <Plus className="w-5 h-5" />
                  Submit Your Event
                </span>
              </button>
            </div>

            {/* Quick Info */}
            <div className="flex flex-wrap items-center gap-4 pt-4 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[hsl(var(--primary))]" />
                <span>Updated Daily</span>
              </div>
              <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[hsl(var(--secondary))]" />
                <span>All Campus Locations</span>
              </div>
            </div>
          </div>

          {/* Right Content - Floating Event Cards */}
          <div className="relative lg:h-[600px] flex items-center justify-center">
            {/* Main Calendar Icon */}
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--primary))]/20 to-[hsl(var(--secondary))]/20 rounded-full blur-3xl animate-pulse"></div>
              
              {/* Main Icon */}
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-gradient-to-br from-[hsl(var(--primary))]/10 to-[hsl(var(--secondary))]/10 border border-white/10 flex items-center justify-center backdrop-blur-sm animate-float">
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--secondary))] flex items-center justify-center shadow-2xl">
                  <Calendar className="w-16 h-16 sm:w-20 sm:h-20 text-white" strokeWidth={2} />
                </div>
              </div>

              {/* Floating Event Cards */}
              <div className="absolute -bottom-4 -left-4 sm:-left-8 w-48 sm:w-56 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 shadow-2xl animate-float-delayed">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--primary))] rounded-lg flex items-center justify-center">
                    <span className="text-white text-xl">🎭</span>
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">Cultural Night</div>
                    <div className="text-gray-400 text-xs">Tomorrow, 6PM</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <MapPin className="w-3 h-3" />
                  <span>Main Auditorium</span>
                </div>
              </div>

              <div className="absolute -top-4 -right-4 sm:-right-8 w-48 sm:w-56 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 shadow-2xl animate-float-slow">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-[hsl(var(--secondary))] to-[hsl(var(--secondary))] rounded-lg flex items-center justify-center">
                    <span className="text-white text-xl">🎓</span>
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">Tech Conference</div>
                    <div className="text-gray-400 text-xs">Next Week</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-[hsl(var(--primary))]">
                  <Users className="w-3 h-3" />
                  <span>250+ Registered</span>
                </div>
              </div>

              <div className="absolute top-1/3 -left-8 w-44 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-3 shadow-2xl animate-float">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--secondary))] rounded-lg flex items-center justify-center">
                    <span className="text-white text-lg">⚽</span>
                  </div>
                  <div>
                    <div className="text-white font-semibold text-xs">Sports Week</div>
                    <div className="text-gray-400 text-xs">Starting Soon</div>
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

      {/* Event Submission Modal */}
      {showSubmitForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="relative bg-gradient-to-b from-[hsl(210,45%,14%)] to-[hsl(var(--background))] border border-white/10 rounded-2xl max-w-2xl w-full p-8 shadow-2xl animate-slideUp">
            {/* Close Button */}
            <button
              onClick={() => setShowSubmitForm(false)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-400 rotate-90" />
            </button>

            {/* Modal Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--secondary))] mb-4">
                <Send className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Submit Your Event</h2>
              <p className="text-gray-400">Have an event? Let us know and we'll feature it!</p>
            </div>

            {/* Form */}
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Event Name *</label>
                <input
                  type="text"
                  placeholder="e.g., Annual Tech Conference 2024"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[hsl(var(--primary))] focus:bg-white/10 transition-all"
                  required
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Date & Time *</label>
                  <input
                    type="datetime-local"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[hsl(var(--primary))] focus:bg-white/10 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Location *</label>
                  <input
                    type="text"
                    placeholder="e.g., Main Auditorium"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[hsl(var(--primary))] focus:bg-white/10 transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
                <textarea
                  rows="4"
                  placeholder="Tell us about your event..."
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[hsl(var(--primary))] focus:bg-white/10 transition-all resize-none"
                  required
                ></textarea>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Your Name *</label>
                  <input
                    type="text"
                    placeholder="Full name"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[hsl(var(--primary))] focus:bg-white/10 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Contact Email *</label>
                  <input
                    type="email"
                    placeholder="your.email@atbu.edu.ng"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[hsl(var(--primary))] focus:bg-white/10 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))] text-white rounded-xl font-semibold hover:shadow-[0_0_30px_rgba(239,45,86,0.4)] transition-all duration-300"
                >
                  Submit Event
                </button>
                <button
                  type="button"
                  onClick={() => setShowSubmitForm(false)}
                  className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl font-semibold hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>

            <p className="text-xs text-gray-500 text-center mt-6">
              We'll review your submission and post it within 24 hours
            </p>
          </div>
        </div>
      )}

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

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(50px);
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

        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
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


        {/* --- Filter Bar --- */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
          <FilterBar 
            onFilterChange={handleFilterChange} 
            totalResults={filteredEvents.length} 
          />
        </div>

        {/* Events Grid */}
        <section className="pb-24 pt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {filteredEvents.length === 0 && !loading ? (
              <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
                <Calendar className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No Upcoming Events</h3>
                <p className="text-gray-400">check back later for new updates.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredEvents.map((event, index) => (
                  <article 
                    key={event._id}
                    className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-[hsl(var(--primary))]/30 hover:bg-white/10 transition-all duration-300 flex flex-col h-full cursor-pointer"
                    onClick={() => setSelectedPost(event)}
                    style={{
                      animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`
                    }}
                  >
                    {/* Event Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={event.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50935339?w=800&auto=format&fit=crop'} 
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                      
                      {/* Date Badge */}
                      <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-2 text-center min-w-[60px]">
                        <span className="block text-xl font-bold text-white">
                            {event.eventDate ? new Date(event.eventDate).getDate() : 'TBA'}
                        </span>
                        <span className="block text-xs text-white/80 uppercase">
                            {event.eventDate ? new Date(event.eventDate).toLocaleString('default', { month: 'short' }) : ''}
                        </span>
                      </div>

                      {/* Event Type Badge */}
                      {event.eventType && (
                        <div className="absolute top-4 right-4">
                            <span className="px-3 py-1 bg-[hsl(var(--primary))]/80 backdrop-blur-sm text-white text-xs font-bold rounded-full uppercase tracking-wider">
                                {event.eventType}
                            </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[hsl(var(--primary))] transition-colors line-clamp-2">
                        {event.title}
                      </h3>
                      
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3 text-gray-400 text-sm">
                          <Clock className="w-4 h-4 text-[hsl(var(--primary))]" />
                          <span>{formatTime(event.eventDate)}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-400 text-sm">
                          <MapPin className="w-4 h-4 text-[hsl(var(--primary))]" />
                          <span>{event.eventLocation || 'Location TBA'}</span>
                        </div>
                      </div>

                      <p className="text-gray-400 text-sm line-clamp-3 mb-6 flex-1">
                        {event.excerpt}
                      </p>

                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPost(event);
                        }}
                        className="w-full py-3 bg-white/5 hover:bg-[hsl(var(--primary))] text-white rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                      >
                        View Details
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
          
          {filteredEvents.length === 0 && !loading && (
             <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
               <Calendar className="w-16 h-16 text-gray-500 mx-auto mb-4" />
               <h3 className="text-xl font-bold text-white mb-2">No Events Found</h3>
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
  );
};

export default Events;