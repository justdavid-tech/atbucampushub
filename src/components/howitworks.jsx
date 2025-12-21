import { UserPlus, Compass, MessageCircle, ArrowRight } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      icon: UserPlus,
      title: 'Create Your Account',
      description: 'Sign up with your ATBU email in seconds. Quick verification and you\'re ready to join the community.',
      features: ['Free & instant setup', 'Secure verification', 'Student-only access'],
      color: 'from-[hsl(var(--primary))] to-[hsl(var(--primary))]',
      bgGlow: 'bg-[hsl(var(--primary))]/20'
    },
    {
      number: '02',
      icon: Compass,
      title: 'Explore Features',
      description: 'Discover news, confessions, marketplace, forums, and campus resources all tailored for ATBU students.',
      features: ['Live campus updates', 'Anonymous confessions', 'Student marketplace', 'Discussion forums'],
      color: 'from-[hsl(var(--primary))] to-[hsl(var(--primary))]',
      bgGlow: 'bg-[hsl(var(--primary))]/20'
    },
    {
      number: '03',
      icon: MessageCircle,
      title: 'Connect, Buy, Sell, Engage',
      description: 'Start interacting with fellow students, find great deals, share experiences, and build connections.',
      features: ['Join conversations', 'Safe transactions', 'Make friends', 'Stay informed'],
      color: 'from-[hsl(var(--primary))] to-[hsl(var(--primary))]',
      bgGlow: 'bg-[hsl(var(--primary))]/20'
    }
  ];

  return (
    <section className="relative py-20 lg:py-32 bg-gradient-to-b from-[hsl(var(--background))] to-[hsl(210,45%,16%)] overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-10 w-96 h-96 bg-[hsl(var(--primary))]/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-10 w-96 h-96 bg-[hsl(var(--secondary))]/5 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Connecting Lines (Desktop) */}
      <div className="absolute inset-0 hidden lg:block">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="lineGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
              <stop offset="100%" stopColor="hsl(var(--secondary))" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          <path
            d="M 25% 50% Q 42% 45%, 50% 50% T 75% 50%"
            stroke="url(#lineGradient1)"
            strokeWidth="2"
            fill="none"
            strokeDasharray="10,5"
            className="animate-dash"
          />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[hsl(var(--secondary))]/10 border border-[hsl(var(--secondary))]/20 rounded-full text-[hsl(var(--secondary))] text-sm font-medium mb-6 backdrop-blur-sm">
            <span>Simple & Fast</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            How It Works
          </h2>

          <p className="text-lg text-gray-300 leading-relaxed">
            Get started in just three simple steps. Join thousands of ATBU students already using CampusHub.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 relative">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative group"
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.2}s both`
              }}
            >
              {/* Connecting Arrow (Mobile) */}
              {index < steps.length - 1 && (
                <div className="lg:hidden flex justify-center my-6">
                  <ArrowRight className="w-8 h-8 text-[hsl(var(--primary))]/30 rotate-90" />
                </div>
              )}

              {/* Card */}
              <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl h-full">
                {/* Step Number */}
                <div className="absolute -top-6 -left-6 w-16 h-16 bg-gradient-to-br from-[hsl(var(--background))] to-[hsl(210,45%,16%)] border-4 border-[hsl(var(--primary))] rounded-2xl flex items-center justify-center shadow-lg rotate-12 group-hover:rotate-0 transition-transform duration-500">
                  <span className="text-2xl font-bold text-[hsl(var(--primary))]">{step.number}</span>
                </div>

                {/* Glow Effect */}
                <div className={`absolute inset-0 ${step.bgGlow} rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`}></div>

                {/* Icon Container */}
                <div className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} p-4 mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <step.icon className="w-full h-full text-white" strokeWidth={2} />
                  
                  {/* Icon Glow */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${step.color} rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity -z-10`}></div>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-white mb-4 text-center group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text transition-all duration-300">
                  {step.title}
                </h3>

                <p className="text-gray-400 leading-relaxed text-center mb-6 group-hover:text-gray-300 transition-colors duration-300">
                  {step.description}
                </p>

                {/* Feature List */}
                <ul className="space-y-3">
                  {step.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3 text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                      <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${step.color} flex-shrink-0`}></div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Decorative Corner */}
                <div className={`absolute bottom-6 right-6 w-12 h-12 bg-gradient-to-br ${step.color} opacity-10 rounded-tl-3xl group-hover:opacity-20 transition-opacity duration-300`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 lg:mt-24 text-center">
          <div className="inline-flex flex-col items-center gap-6 bg-gradient-to-r from-[hsl(var(--primary))]/5 via-[hsl(var(--secondary))]/5 to-[hsl(var(--primary))]/5 border border-[hsl(var(--primary))]/20 rounded-2xl p-8 lg:p-10 backdrop-blur-sm max-w-2xl">
            <div>
              <p className="text-white font-semibold text-xl lg:text-2xl mb-2">
                Ready to get started?
              </p>
              <p className="text-gray-400">
                Join the ATBU community and experience campus life like never before
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <button className="group relative px-8 py-4 bg-[hsl(var(--primary))] text-white rounded-xl font-semibold overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(239,45,86,0.4)]">
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Create Free Account
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))] opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>

              <button className="group px-8 py-4 bg-transparent text-white border-2 border-white/20 rounded-xl font-semibold backdrop-blur-sm hover:bg-white/5 hover:border-white/40 transition-all duration-300">
                <span className="flex items-center justify-center gap-2">
                  Watch Demo
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </span>
              </button>
            </div>
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

        @keyframes dash {
          to {
            stroke-dashoffset: -100;
          }
        }

        .animate-dash {
          animation: dash 20s linear infinite;
        }
      `}</style>
    </section>
  );
}