import { ArrowRight, Sparkles } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen py-20 bg-gradient-to-br from-[hsl(var(--background))] via-[hsl(210,45%,16%)] to-[hsl(var(--background))] overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[hsl(var(--primary))]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[hsl(var(--secondary))]/10 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-[hsl(var(--primary))]/5 rounded-full blur-2xl"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[calc(100vh-8rem)]">
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-8 animate-fadeIn">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[hsl(var(--primary))]/10 border border-[hsl(var(--primary))]/20 rounded-full text-[hsl(var(--primary))] text-sm font-medium backdrop-blur-sm">
              <Sparkles className="w-4 h-4" />
              <span>Your Campus, Connected</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
              <span className="text-white">ATBU CampusHub </span>
              <br />
              <span className="bg-gradient-to-r from-[hsl(var(--primary))] via-[hsl(var(--secondary))] to-[hsl(var(--primary))] bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                Your Number One
              </span>
              <br />
              <span className="text-white">Student Place.</span>
            </h1>

            {/* Subtext */}
            <p className="text-lg sm:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              News, confessions, marketplace, forums, events and everything happening on campus all in one place.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <button className="group relative px-8 py-4 bg-[hsl(var(--primary))] text-white rounded-lg font-semibold text-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(239,45,86,0.4)]">
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Get Started
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))] opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>

              <button className="group px-8 py-4 bg-transparent text-white border-2 border-white/20 rounded-lg font-semibold text-lg backdrop-blur-sm hover:bg-white/5 hover:border-white/40 transition-all duration-300">
                <span className="flex items-center justify-center gap-2">
                  Explore Blog
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 max-w-lg mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <div className="text-2xl sm:text-3xl font-bold text-[hsl(var(--primary))]">5K+</div>
                <div className="text-sm text-gray-400 mt-1">Active Students</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl sm:text-3xl font-bold text-[hsl(var(--secondary))]">500+</div>
                <div className="text-sm text-gray-400 mt-1">Daily Posts</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl sm:text-3xl font-bold text-[hsl(var(--primary))]">24/7</div>
                <div className="text-sm text-gray-400 mt-1">Active Community</div>
              </div>
            </div>
          </div>

          {/* Right Content - App Mockup */}
          <div className="relative lg:h-[600px] flex items-center justify-center">
            {/* Floating Cards Animation */}
            <div className="absolute inset-0">
              {/* Card 1 - News */}
              <div className="absolute top-10 right-0 w-64 bg-white/5 z-10 backdrop-blur-md border border-white/10 rounded-xl p-4 shadow-2xl animate-float">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-[hsl(var(--primary))] rounded-lg flex items-center justify-center">
                    <span className="text-white text-xl">📰</span>
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">Campus News</div>
                    <div className="text-gray-400 text-xs">2 mins ago</div>
                  </div>
                </div>
                <div className="text-gray-300 text-sm">New semester schedule released...</div>
              </div>

              {/* Card 2 - Marketplace */}
              <div className="absolute bottom-12 lg:bottom-32 z-10 left-0 w-60 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 shadow-2xl animate-float-delayed">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-[hsl(var(--secondary))] rounded-lg flex items-center justify-center">
                    <span className="text-white text-xl">🛒</span>
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">Marketplace</div>
                    <div className="text-gray-400 text-xs">Hot deals</div>
                  </div>
                </div>
                <div className="text-gray-300 text-sm">iPhone 13 Pro - ₦350k</div>
              </div>

              {/* Card 3 - Confession */}
              <div className="absolute z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 shadow-2xl animate-float-slow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--secondary))] rounded-lg flex items-center justify-center">
                    <span className="text-white text-xl">💭</span>
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">Anonymous</div>
                    <div className="text-gray-400 text-xs">Confession</div>
                  </div>
                </div>
                <div className="text-gray-300 text-sm">"Best decision joining this platform..."</div>
              </div>
            </div>

            {/* Main Phone Mockup */}
            <div className="relative z-0 w-64 sm:w-80 h-[500px] sm:h-[600px] bg-gradient-to-br from-gray-900 to-black rounded-[3rem] border-8 border-gray-800 shadow-2xl overflow-hidden">
              {/* Phone Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-black rounded-b-3xl z-20"></div>
              
              {/* App Screen */}
              <div className="h-full bg-gradient-to-br from-[hsl(var(--background))] to-[hsl(210,45%,16%)] p-6 overflow-hidden">
                <div className="space-y-4 mt-8">
                  {/* App Header */}
                  <div className="flex items-center justify-between">
                    <div className="text-[hsl(var(--primary))] font-bold text-xl">CampusHub</div>
                    <div className="w-10 h-10 bg-[hsl(var(--primary))] rounded-full"></div>
                  </div>

                  {/* Feed Items */}
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="bg-white/5 rounded-xl p-3 backdrop-blur-sm border border-white/10">
                        <div className="flex gap-2 mb-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--secondary))] rounded-full"></div>
                          <div className="flex-1">
                            <div className="h-2 bg-white/20 rounded w-24 mb-1"></div>
                            <div className="h-2 bg-white/10 rounded w-16"></div>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="h-2 bg-white/20 rounded w-full"></div>
                          <div className="h-2 bg-white/20 rounded w-4/5"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
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

        @keyframes scroll {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(12px);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 1s ease-out;
        }

        .animate-gradient {
          animation: gradient 3s ease infinite;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float 3s ease-in-out infinite;
          animation-delay: 0.5s;
        }

        .animate-float-slow {
          animation: float 4s ease-in-out infinite;
          animation-delay: 1s;
        }

        .animate-scroll {
          animation: scroll 1.5s ease-in-out infinite;
        }

        .delay-700 {
          animation-delay: 700ms;
        }
      `}</style>
    </section>
  );
}