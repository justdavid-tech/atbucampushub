import { Users, Zap, Heart, TrendingUp } from 'lucide-react';

export default function MissionSection() {
  const features = [
    {
      icon: Users,
      title: "Campus Connection",
      description: "Connect with fellow students across all departments, faculties, and hostels in one unified space.",
      color: "from-[hsl(var(--primary))] to-[hsl(var(--secondary))]"
    },
    {
      icon: Heart,
      title: "Community Building",
      description: "Build lasting relationships, share experiences, and create memories with your campus community.",
      color: "from-[hsl(var(--primary))] to-[hsl(var(--secondary))]"
    },
    {
      icon: Zap,
      title: "Easy Access",
      description: "Get instant access to news, events, resources, and everything you need in one convenient platform.",
      color: "from-[hsl(var(--primary))] to-[hsl(var(--secondary))]"
    },
    {
      icon: TrendingUp, 
      title: "Student Life",
      description: "Enhance your campus experience with tools designed specifically for the modern ATBU student.",
      color: "from-[hsl(var(--primary))] to-[hsl(var(--secondary))]"
    }
  ];

  return (
    <section className="relative py-20 lg:py-32 bg-gradient-to-b from-[hsl(var(--background))] to-[hsl(210,45%,8%)] overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[hsl(var(--primary))]/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[hsl(var(--secondary))]/5 rounded-full blur-3xl"></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:64px_64px]"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[hsl(var(--primary))]/10 border border-[hsl(var(--primary))]/20 rounded-full text-[hsl(var(--primary))] text-sm font-medium mb-6 backdrop-blur-sm">
            <div className="w-2 h-2 bg-[hsl(var(--primary))] rounded-full animate-pulse"></div>
            <span>Our Mission</span>
          </div>

          {/* Main Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Built For{" "}
            <span className="bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))] bg-clip-text text-transparent">
              Every ATBU Student
            </span>
          </h2>

          {/* Mission Statement */}
          <p className="text-lg sm:text-xl text-gray-300 leading-relaxed">
            CampusHub brings every ATBU student together to share, buy, read, connect, learn, and stay updated effortlessly. We're transforming campus life by creating a digital ecosystem where information flows freely, connections are made instantly, and every student has a voice.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(239,45,86,0.2)]"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Icon Container */}
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[hsl(var(--primary))] transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                {feature.description}
              </p>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[hsl(var(--primary))]/0 to-[hsl(var(--secondary))]/0 group-hover:from-[hsl(var(--primary))]/5 group-hover:to-[hsl(var(--secondary))]/5 transition-all duration-300"></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 lg:mt-24 text-center">
          <div className="inline-block bg-gradient-to-r from-[hsl(var(--background))] via-[hsl(210,45%,16%)] to-[hsl(var(--background))] border border-white/10 rounded-2xl p-8 sm:p-12 backdrop-blur-sm">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Ready to join the community?
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Join thousands of ATBU students already using CampusHub to enhance their university experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="group relative px-8 py-4 bg-[hsl(var(--primary))] text-white rounded-lg font-semibold overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(239,45,86,0.4)]">
                <span className="relative z-10">Join CampusHub Today</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))] opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
              <button className="px-8 py-4 bg-transparent text-white border-2 border-white/20 rounded-lg font-semibold backdrop-blur-sm hover:bg-white/5 hover:border-white/40 transition-all duration-300">
                Learn More
              </button>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-1/2 left-0 w-1 h-32 bg-gradient-to-b from-transparent via-[hsl(var(--primary))] to-transparent opacity-20"></div>
        <div className="absolute top-1/2 right-0 w-1 h-32 bg-gradient-to-b from-transparent via-[hsl(var(--secondary))] to-transparent opacity-20"></div>
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

        .group {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </section>
  );
}