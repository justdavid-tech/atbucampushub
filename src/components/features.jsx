import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, ShoppingCart, Users, Newspaper, Calendar, Search, Home, BookOpen, User } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Confessions",
      description: "Anonymous, moderated platform for campus confessions. Share your thoughts every Tuesday & Friday.",
      days: "Tues & Fri",
      path: "/confessions"
    },
    {
      icon: <ShoppingCart className="w-8 h-8" />,
      title: "Marketplace",
      description: "Buy & sell items on campus. Connect with fellow students for great deals.",
      path: "/marketplace"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Forum",
      description: "Group chats by departments, hostels, and interests. Open discussions for everyone.",
      path: "/forum"
    },
    {
      icon: <Newspaper className="w-8 h-8" />,
      title: "Campus News & Blog",
      description: "Announcements, events, academics, sports, and entertainment updates.",
      path: "/news"
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Events Calendar",
      description: "See upcoming shows, parties, programs, and campus events all in one place.",
      path: "/events"
    },
    {
      icon: <Search className="w-8 h-8" />,
      title: "Lost & Found",
      description: "Post items lost or found instantly. Help reunite belongings with owners.",
      path: "/lost-and-found"
    },
    {
      icon: <Home className="w-8 h-8" />,
      title: "Hostel Finder",
      description: "Complete list of hostels with reviews, prices, and availability information.",
      path: "/hostels"
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Course Materials",
      description: "Download PDFs, notes, and past questions to ace your exams.",
      path: "/resources"
    },
    {
      icon: <User className="w-8 h-8" />,
      title: "Profiles & Messaging",
      description: "See students' profiles and message sellers or group members directly.",
      path: "/profiles"
    }
  ];

  return (
    <section 
      className="py-16 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: 'hsl(var(--background))' }}
    >
      <div className="max-w-7xl mx-auto">
         {/* Badge */}
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex text-center items-center gap-2 px-4 py-2 bg-[hsl(var(--primary))]/10 border border-[hsl(var(--primary))]/20 rounded-full text-[hsl(var(--primary))] text-sm font-medium mb-6 backdrop-blur-sm">
            <div className="w-2 h-2 bg-[hsl(var(--primary))] rounded-full animate-pulse"></div>
            <span>Features</span>
          </div>
          <h2 className="text-4xl font-bold mb-4 text-white">
            Campus Hub <span className="text-[hsl(var(--primary))]">Features</span>
          </h2>
          <p className="text-lg max-w-3xl mx-auto text-gray-300">
            Everything you need for campus life in one place. Connect, share, and explore with fellow students.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Link
              key={index}
              to={feature.path}
              className="group relative rounded-2xl p-8 transition-all duration-500 hover:-translate-y-2 block"
              style={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                cursor: 'pointer'
              }}
            >
              {/* Gradient Border/Glow Effect on Hover */}
              <div 
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: 'linear-gradient(to bottom right, hsl(var(--primary) / 0.1), transparent)',
                  pointerEvents: 'none'
                }}
              />

              <div className="relative z-10">
                {/* Icon Container */}
                <div 
                  className="mb-6 inline-flex p-4 rounded-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-lg"
                  style={{ 
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))'
                  }}
                >
                  <div style={{ color: 'hsl(var(--primary))' }}>
                    {React.cloneElement(feature.icon, { className: "w-10 h-10" })}
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <h3 
                      className="text-2xl font-bold transition-colors group-hover:text-primary"
                      style={{ color: 'hsl(var(--foreground))' }}
                    >
                      {feature.title}
                    </h3>
                    {feature.days && (
                      <span 
                        className="text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider shrink-0"
                        style={{ 
                          backgroundColor: 'hsl(var(--primary) / 0.1)',
                          color: 'hsl(var(--primary))'
                        }}
                      >
                        {feature.days}
                      </span>
                    )}
                  </div>
                  
                  <p 
                    className="text-base leading-relaxed"
                    style={{ color: 'hsl(var(--muted))' }}
                  >
                    {feature.description}
                  </p>
                </div>

                {/* Interactive Footer */}
                <div className="mt-8 flex items-center gap-2 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0" style={{ color: 'hsl(var(--primary))' }}>
                  <span>Explore Feature</span>
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div 
            className="inline-flex items-center justify-center p-1 rounded-full"
            style={{ 
              background: 'linear-gradient(to right, hsl(var(--primary)), hsl(var(--secondary)))'
            }}
          >
            <button 
              className="px-8 py-3 font-semibold text-gray-300 rounded-full transition-colors"
              style={{ 
                backgroundColor: 'hsl(var(--background))',
             
              }}
            >
              Explore All Features
            </button>
          </div>
          <p className="mt-4" style={{ color: 'hsl(var(--muted))' }}>
            Join thousands of students already using Campus Hub
          </p>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;