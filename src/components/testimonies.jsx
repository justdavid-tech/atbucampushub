import { useState, useEffect } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const testimonials = [
    {
      name: 'Aisha Mohammed',
      department: 'Computer Science',
      level: '300 Level',
      avatar: 'AM',
      rating: 5,
      text: 'This helped me sell my phone within 2 days! The marketplace is so convenient and everyone here is a verified student. No more dealing with scammers outside campus.',
      category: 'Marketplace',
      color: 'from-[hsl(var(--primary))] to-[hsl(var(--primary))]'
    },
    {
      name: 'Ibrahim Yusuf',
      department: 'Mechanical Engineering',
      level: '400 Level',
      avatar: 'IY',
      rating: 5,
      text: 'The confession page is fire! Finally, a safe space where I can share my thoughts without judgment. It\'s therapeutic and helps me connect with others going through similar experiences.',
      category: 'Confessions',
      color: 'from-[hsl(var(--primary))] to-[hsl(var(--primary))]'
    },
    {
      name: 'Fatima Abdullahi',
      department: 'Pharmacy',
      level: '200 Level',
      avatar: 'FA',
      rating: 5,
      text: 'I found my lost ID through the Lost & Found feature! Someone posted it and I got it back the same day. This platform is a lifesaver.',
      category: 'Resources',
      color: 'from-[hsl(var(--primary))] to-[hsl(var(--primary))]'
    },
    {
      name: 'David Okafor',
      department: 'Electrical Engineering',
      level: '500 Level',
      avatar: 'DO',
      rating: 5,
      text: 'The forum discussions have been incredibly helpful for my final year project. I connected with seniors who guided me through challenges. Best platform for academic support!',
      category: 'Forum',
      color: 'from-[hsl(var(--primary))] to-[hsl(var(--primary))]'
    },
    {
      name: 'Blessing Adeyemi',
      department: 'Mass Communication',
      level: '300 Level',
      avatar: 'BA',
      rating: 5,
      text: 'I never miss any campus event anymore! The news section keeps me updated on everything happening. From departmental meetings to campus-wide events, I\'m always in the know.',
      category: 'News & Updates',
      color: 'from-[hsl(var(--primary))] to-[hsl(var(--primary))]' 
    },
    {
      name: 'Musa Bello',
      department: 'Architecture',
      level: '400 Level',
      avatar: 'MB',
      rating: 5,
      text: 'Found my hostel through the Hostel Finder feature. The reviews from other students were honest and helped me make the right choice. Saved me so much stress!',
      category: 'Hostel Finder',
      color: 'from-[hsl(var(--primary))] to-[hsl(var(--primary))]' 
    },
    {
      name: 'Chioma Nwankwo',
      department: 'Biochemistry',
      level: '200 Level',
      avatar: 'CN',
      rating: 5,
      text: 'The marketplace services section is amazing! I found affordable makeup and hair services right here on campus. Supporting fellow students while looking good!',
      category: 'Services',
      color: 'from-[hsl(var(--primary))] to-[hsl(var(--primary))]' 
    },
    {
      name: 'Ahmed Suleiman',
      department: 'Civil Engineering',
      level: '300 Level',
      avatar: 'AS',
      rating: 5,
      text: 'This platform helped me build connections with students from other departments. The community here is amazing and everyone is willing to help. True campus unity!',
      category: 'Community',
      color: 'from-[hsl(var(--primary))] to-[hsl(var(--primary))]' 
    }
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      nextTestimonial();
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, currentIndex]);

  const getVisibleTestimonials = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      visible.push(testimonials[(currentIndex + i) % testimonials.length]);
    }
    return visible;
  };

  return (
    <section className="relative py-20 lg:py-32 bg-gradient-to-b from-[hsl(210,45%,16%)] via-[hsl(var(--background))] to-[hsl(210,45%,16%)] overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-[hsl(var(--primary))]/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-[hsl(var(--secondary))]/5 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:64px_64px] opacity-30"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[hsl(var(--primary))]/10 border border-[hsl(var(--primary))]/20 rounded-full text-[hsl(var(--primary))] text-sm font-medium mb-6 backdrop-blur-sm">
            <Star className="w-4 h-4 fill-current" />
            <span>5-Star Reviews</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            What ATBU Students
            <span className="block mt-2 bg-[hsl(var(--primary))] from-[hsl(var(--primary))] via-[hsl(var(--secondary))] to-[hsl(var(--primary))] bg-clip-text text-transparent">
              Are Saying
            </span>
          </h2>

          <p className="text-lg text-gray-300 leading-relaxed">
            Real experiences from thousands of students using CampusHub daily
          </p>
        </div>

        {/* Desktop View - 3 Cards */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-8 mb-12">
          {getVisibleTestimonials().map((testimonial, index) => (
            <div
              key={`${testimonial.name}-${index}`}
              className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl"
              style={{
                animation: `fadeIn 0.6s ease-out ${index * 0.1}s both`
              }}
            >
              {/* Quote Icon */}
              <div className={`absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br ${testimonial.color} rounded-xl flex items-center justify-center shadow-lg transform -rotate-6 group-hover:rotate-0 transition-transform duration-300`}>
                <Quote className="w-6 h-6 text-white" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[hsl(var(--secondary))] text-[hsl(var(--secondary))]" />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-gray-300 leading-relaxed mb-6 group-hover:text-white transition-colors duration-300">
                "{testimonial.text}"
              </p>

              {/* Category Badge */}
              <div className={`inline-flex items-center px-3 py-1 bg-gradient-to-r ${testimonial.color} bg-opacity-10 rounded-full text-xs font-medium text-white mb-4`}>
                {testimonial.category}
              </div>

              {/* User Info */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-white font-bold shadow-lg`}>
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="text-white font-semibold">{testimonial.name}</p>
                  <p className="text-gray-400 text-sm">{testimonial.department}</p>
                  <p className="text-gray-500 text-xs">{testimonial.level}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile View - Single Card */}
        <div className="lg:hidden mb-8">
          <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            {/* Quote Icon */}
            <div className={`absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br ${testimonials[currentIndex].color} rounded-xl flex items-center justify-center shadow-lg transform -rotate-6`}>
              <Quote className="w-6 h-6 text-white" />
            </div>

            {/* Rating */}
            <div className="flex gap-1 mb-4">
              {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-[hsl(var(--secondary))] text-[hsl(var(--secondary))]" />
              ))}
            </div>

            {/* Testimonial Text */}
            <p className="text-gray-300 leading-relaxed mb-6">
              "{testimonials[currentIndex].text}"
            </p>

            {/* Category Badge */}
            <div className={`inline-flex items-center px-3 py-1 bg-gradient-to-r ${testimonials[currentIndex].color} bg-opacity-10 rounded-full text-xs font-medium text-white mb-4`}>
              {testimonials[currentIndex].category}
            </div>

            {/* User Info */}
            <div className="flex items-center gap-3 pt-4 border-t border-white/10">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonials[currentIndex].color} flex items-center justify-center text-white font-bold shadow-lg`}>
                {testimonials[currentIndex].avatar}
              </div>
              <div>
                <p className="text-white font-semibold">{testimonials[currentIndex].name}</p>
                <p className="text-gray-400 text-sm">{testimonials[currentIndex].department}</p>
                <p className="text-gray-500 text-xs">{testimonials[currentIndex].level}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => {
              setIsAutoPlaying(false);
              prevTestimonial();
            }}
            className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-110"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Dots Indicator */}
          <div className="flex gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setCurrentIndex(index);
                }}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex
                    ? 'w-8 h-2 bg-[hsl(var(--primary))]'
                    : 'w-2 h-2 bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => {
              setIsAutoPlaying(false);
              nextTestimonial();
            }}
            className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-110"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
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
      `}</style>
    </section>
  );
}