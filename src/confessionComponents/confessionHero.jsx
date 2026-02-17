
import { useState, useEffect } from 'react';
import { MessageCircle, ChevronRight, Lock, Clock, TrendingUp, Heart } from 'lucide-react';
import { isPostingDay, getNextPostingDay } from '../lib/confessionQueries';

export default function ConfessionHero({ stats }) {
  const [isOpen, setIsOpen] = useState(false);
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    // Check if today is posting day
    setIsOpen(isPostingDay());

    // Update countdown every second
    const interval = setInterval(() => {
      if (isPostingDay()) {
        setIsOpen(true);
        setCountdown('');
      } else {
        const nextDate = getNextPostingDay();
        const now = new Date();
        const diff = nextDate - now;

        if (diff > 0) {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

          if (days > 0) {
            setCountdown(`${days}d ${hours}h`);
          } else {
            setCountdown(`${hours}h ${minutes}m`);
          }
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const quickStats = [
    { icon: MessageCircle, label: 'Total Confessions', value: stats?.total || 0, color: 'from-primary to-primary/80' },
    { icon: TrendingUp, label: 'This Week', value: stats?.thisWeek || 0, color: 'from-primary to-primary/80' },
    { icon: Heart, label: 'Total Likes', value: stats?.totalLikes || 0, color: 'from-primary to-primary/80' }
  ];

  return (
    <section className="relative bg-gradient-to-br from-[hsl(var(--background))] via-[hsl(210,45%,14%)] to-[hsl(var(--background))] overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] opacity-30"></div>

      {/* Animated Background Icon */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5">
        <Lock className="w-[600px] h-[600px] text-white animate-float" strokeWidth={0.5} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-8 flex-wrap">
          <a 
            href="/" 
            className="text-gray-400 hover:text-purple-400 transition-colors duration-300"
          >
            Home
          </a>
          <ChevronRight className="w-4 h-4 text-gray-600" />
          <span className="text-white font-medium">Confessions</span>
        </nav>

        {/* Hero Content */}
        <div className="text-center max-w-4xl mx-auto py-12 lg:py-16">
          {/* Lock Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full  border border-primary backdrop-blur-sm mb-6 animate-float">
            <Lock className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            <span className="text-white">ATBU</span>
            <br />
            <span className="bg-gradient-to-r from-primary via-primary to-primary bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
              Confessions
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg sm:text-xl text-gray-300 leading-relaxed mb-8 max-w-2xl mx-auto">
            Share your thoughts, feelings, and experiences anonymously. Your identity is protected, your voice matters.
          </p>

          {/* Status Banner */}
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md mb-8">
            {isOpen ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </div>
                  <span className="text-green-400 font-semibold text-lg">Confessions are OPEN</span>
                </div>
                <div className="hidden sm:block w-px h-8 bg-white/20"></div>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>Open today until midnight</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-red-400 font-semibold text-lg">Confessions are CLOSED</span>
                </div>
                <div className="hidden sm:block w-px h-8 bg-white/20"></div>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>Opens in {countdown}</span>
                </div>
              </>
            )}
          </div>

          {/* Info Text */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-400 mb-8">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-primary" />
              <span>100% Anonymous</span>
            </div>
            <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-primary" />
              <span>Open Tuesday & Friday</span>
            </div>
            <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
            <div className="text-gray-500">
              No login required
            </div>
          </div>

          {/* CTA Button */}
          {isOpen && (
            <button className="group relative px-8 py-4 bg-gradient-to-r from-primary to-primary/90 text-white rounded-xl font-semibold overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(239,45,86,0.3)] animate-fadeIn">
              <span className="relative z-10 flex items-center justify-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Share Your Confession
              </span>
            </button>
          )}
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 pt-8 border-t border-white/10">
          {quickStats.map((stat, index) => (
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
      `}</style>
    </section>
  );
}