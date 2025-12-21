import { useState } from 'react';
import { Plus, Minus, Shield, Lock, CheckCircle, Users, CreditCard, TrendingUp, MessageCircle } from 'lucide-react';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: 'Is the confession page truly anonymous?',
      answer: 'Yes, absolutely! Your confessions are 100% anonymous. We do not track or store any identifying information that could link confessions back to you. Your identity is completely protected, and no one—including moderators—can see who posted what. We take your privacy seriously and use advanced encryption to ensure your anonymity.',
      icon: Shield,
      color: 'from-[hsl(var(--primary))] to-[hsl(var(--primary))]'
    },
    {
      question: 'Do I need an account to use the marketplace?',
      answer: 'Yes, you need to create an account to buy or sell on the marketplace. This helps us maintain a safe, verified community of ATBU students only. Account creation is quick, free, and only requires your ATBU student email for verification. This ensures all transactions happen between verified students, reducing scams and building trust.',
      icon: Users,
      color: 'from-[hsl(var(--primary))] to-[hsl(var(--primary))]'
    },
    {
      question: 'Is the platform safe?',
      answer: 'Absolutely! Security is our top priority. We verify all users with their ATBU student email, use encrypted connections for all data, and have a dedicated moderation team monitoring for suspicious activity. We also have a reporting system for any concerns, and our community guidelines ensure a safe environment for everyone. Your data is never shared with third parties.',
      icon: Lock,
      color: 'from-[hsl(var(--primary))] to-[hsl(var(--primary))]'
    },
    {
      question: 'How do I verify my account?',
      answer: 'Account verification is simple and takes less than 2 minutes! After signing up, you\'ll receive a verification email at your ATBU student email address. Click the verification link in the email, and your account will be instantly verified. This one-time process ensures you\'re a genuine ATBU student and gives you full access to all platform features.',
      icon: CheckCircle,
      color: 'from-[hsl(var(--primary))] to-[hsl(var(--primary))]'
    },
    {
      question: 'Do I need to be an ATBU student?',
      answer: 'Yes, CampusHub is exclusively for ATBU students. You must have a valid ATBU student email address (@atbu.edu.ng) to create an account. This exclusivity ensures the platform remains a safe, trusted space where all members are part of the same community. It helps maintain quality interactions and reduces the risk of scams or external interference.',
      icon: Users,
      color: 'from-[hsl(var(--primary))] to-[hsl(var(--primary))]'
    },
    {
      question: 'Is registration free?',
      answer: 'Yes, registration is 100% free! There are no hidden charges, subscription fees, or premium tiers. All features—marketplace, confessions, forums, news, and resources—are completely free for all ATBU students. Our mission is to serve the student community, not to profit from it. You only pay when making purchases in the marketplace from other students.',
      icon: CreditCard,
      color: 'from-[hsl(var(--primary))] to-[hsl(var(--primary))]'
    },
    {
      question: 'How can sellers promote their products?',
      answer: 'Sellers have multiple ways to promote their products! You can post in the marketplace with detailed descriptions and photos, share your listings in relevant forum groups, and use our featured listing option to get more visibility. Products that receive positive reviews and ratings naturally get boosted. You can also share your listings through the platform\'s share feature to reach more potential buyers.',
      icon: TrendingUp,
      color: 'from-[hsl(var(--primary))] to-[hsl(var(--primary))]'
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative py-20 lg:py-32 bg-gradient-to-b from-[hsl(210,45%,16%)] via-[hsl(var(--background))] to-[hsl(var(--background))] overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-[hsl(var(--primary))]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-[hsl(var(--primary))]/5 rounded-full blur-3xl"></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:64px_64px] opacity-30"></div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[hsl(var(--primary))]/10 border border-[hsl(var(--primary))]/20 rounded-full text-[hsl(var(--primary))] text-sm font-medium mb-6 backdrop-blur-sm">
            <MessageCircle className="w-4 h-4" />
            <span>Got Questions?</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Frequently Asked
            <span className="block mt-2 bg-gradient-to-r from-[hsl(var(--primary))] via-[hsl(var(--primary))] to-[hsl(var(--primary))] bg-clip-text text-transparent">
              Questions
            </span>
          </h2>

          <p className="text-lg text-gray-300 leading-relaxed">
            Everything you need to know about CampusHub. Can't find what you're looking for? Contact our support team.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-300"
              style={{
                animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`
              }}
            >
              {/* Question Button */}
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-start gap-4 p-6 lg:p-8 text-left transition-all duration-300"
              >
                {/* Icon */}
                <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${faq.color} p-2.5 shadow-lg transition-transform duration-300 ${openIndex === index ? 'scale-110' : 'group-hover:scale-105'}`}>
                  <faq.icon className="w-full h-full text-white" strokeWidth={2} />
                </div>

                {/* Question Text */}
                <div className="flex-1 pt-1">
                  <h3 className="text-lg lg:text-xl font-semibold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text transition-all duration-300">
                    {faq.question}
                  </h3>
                </div>

                {/* Toggle Icon */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center transition-all duration-300 ${openIndex === index ? 'bg-[hsl(var(--primary))]/20 rotate-180' : 'group-hover:bg-white/10'}`}>
                  {openIndex === index ? (
                    <Minus className="w-5 h-5 text-[hsl(var(--primary))]" />
                  ) : (
                    <Plus className="w-5 h-5 text-gray-400 group-hover:text-white" />
                  )}
                </div>
              </button>

              {/* Answer */}
              <div
                className={`transition-all duration-500 ease-in-out ${
                  openIndex === index
                    ? 'max-h-96 opacity-100'
                    : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 lg:px-8 pb-6 lg:pb-8">
                  <div className="pl-16 pr-12">
                    <p className="text-gray-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>

              {/* Glow Effect */}
              <div className={`absolute inset-0 bg-gradient-to-r ${faq.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl pointer-events-none`}></div>
            </div>
          ))}
        </div>

        {/* Still Have Questions CTA */}
        <div className="mt-16 lg:mt-20">
          <div className="relative bg-gradient-to-r from-[hsl(var(--primary))]/10 via-[hsl(var(--secondary))]/10 to-[hsl(var(--primary))]/10 border border-[hsl(var(--primary))]/20 rounded-2xl p-8 lg:p-10 backdrop-blur-sm overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[hsl(var(--primary))]/10 rounded-full blur-3xl"></div>
            
            <div className="relative text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--secondary))] mb-6 shadow-lg">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>

              <h3 className="text-2xl lg:text-3xl font-bold text-white mb-3">
                Still have questions?
              </h3>
              
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Can't find the answer you're looking for? Our support team is here to help you 24/7.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="group relative px-8 py-4 bg-[hsl(var(--primary))] text-white rounded-xl font-semibold overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(239,45,86,0.4)]">
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Contact Support
                    <MessageCircle className="w-5 h-5" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>

                <button className="group px-8 py-4 bg-transparent text-white border-2 border-white/20 rounded-xl font-semibold backdrop-blur-sm hover:bg-white/5 hover:border-white/40 transition-all duration-300">
                  <span className="flex items-center justify-center gap-2">
                    Browse Help Center
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

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
    </section>
  );
}