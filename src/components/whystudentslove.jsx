import { Shield, Zap, ShoppingBag, Layers, Smartphone, Users } from 'lucide-react';

export default function WhyStudentsLove() {
  const features = [
    {
      icon: Shield,
      title: 'Anonymous Confessions, Safe Space',
      description: 'Share your thoughts freely without judgment. Your identity stays protected while you connect with fellow students.',
      color: 'bg-[hsl(var(--primary))]'
    },
    {
      icon: Zap,
      title: 'Fast Campus Updates',
      description: 'Never miss important announcements, events, or academic news. Get real-time updates straight from campus.',
      color: 'bg-[hsl(var(--primary))]' 
    },
    {
      icon: ShoppingBag,
      title: 'Students Selling to Students, No Scam',
      description: 'Buy and sell with confidence within the ATBU community. Verified students only, transparent transactions.',
      color: 'bg-[hsl(var(--primary))]'
    },
    {
      icon: Layers,
      title: 'All-in-One Platform',
      description: 'News, marketplace, forums, confessions, and resources, everything you need in a single, unified platform.',
      color: 'bg-[hsl(var(--primary))]'
    },
    {
      icon: Smartphone,
      title: 'Lightweight & Mobile-Friendly',
      description: 'Fast loading, smooth performance, and works perfectly on any device. Access campus life on the go.',
      color: 'bg-[hsl(var(--primary))]'
    },
    {
      icon: Users,
      title: 'Designed Specifically for ATBU Students',
      description: 'Built by students, for students. Every feature is tailored to meet the unique needs of the ATBU community.',
      color: 'bg-[hsl(var(--primary))]'
    }
  ];

  return (
    <section className="relative py-20 lg:py-32 bg-gradient-to-b from-[hsl(var(--background))] via-[hsl(210,45%,14%)] to-[hsl(var(--background))] overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-[hsl(var(--primary))]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-[hsl(var(--secondary))]/5 rounded-full blur-3xl"></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:64px_64px] opacity-30"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[hsl(var(--primary))]/10 border border-[hsl(var(--primary))]/20 rounded-full text-[hsl(var(--primary))] text-sm font-medium mb-6 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[hsl(var(--primary))] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[hsl(var(--primary))]"></span>
            </span>
            Trusted by Thousands
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Why Students Love
            <span className="block mt-2 text-[hsl(var(--primary))]">
              CampusHub
            </span>
          </h2>

          <p className="text-lg text-gray-300 leading-relaxed">
            Join thousands of ATBU students who have made CampusHub their go-to platform for everything campus life.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 lg:p-8 hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl"
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
              }}
            >

              {/* Icon */}
              <div className={`relative w-14 h-14 rounded-xl bg-hsl(var(--primary)) ${feature.color} p-3 mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                <feature.icon className="w-full h-full text-white" strokeWidth={2} />
                
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text transition-all duration-300">
                {feature.title}
              </h3>

              <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 lg:mt-24 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-gradient-to-r from-[hsl(var(--primary))]/10 via-[hsl(var(--secondary))]/10 to-[hsl(var(--primary))]/10 border border-[hsl(var(--primary))]/20 rounded-2xl p-8 backdrop-blur-sm">
            <div className="text-left">
              <p className="text-white font-semibold text-lg mb-1">
                Ready to experience the difference?
              </p>
              <p className="text-gray-400 text-sm">
                Join the ATBU CampusHub community today
              </p>
            </div>
            <button className="group relative px-8 py-4 bg-[hsl(var(--primary))] text-white rounded-lg font-semibold overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(239,45,86,0.4)] whitespace-nowrap">
              <span className="relative z-10 flex items-center gap-2">
                Get Started Now
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))] opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
          </div>
        </div>
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
  );
}