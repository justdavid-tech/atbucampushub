import { useState } from 'react';
import { Send, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { submitConfession, containsProfanity, isPostingDay } from '../lib/confessionQueries';

export default function ConfessionForm({ onSuccess }) {
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showWarning, setShowWarning] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const MAX_LENGTH = 500;
  const charCount = text.length;
  const charRemaining = MAX_LENGTH - charCount;

  // Real-time profanity check
  const hasProfanity = text.length > 0 && containsProfanity(text);

  const handleTextChange = (e) => {
    const value = e.target.value;
    if (value.length <= MAX_LENGTH) {
      setText(value);
      setError('');
      setShowWarning(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!text.trim()) {
      setError('Please write your confession');
      return;
    }

    if (text.trim().length < 10) {
      setError('Confession must be at least 10 characters');
      return;
    }

    if (!isPostingDay()) {
      setError('Confessions can only be posted on Tuesdays and Fridays');
      return;
    }

    if (hasProfanity) {
      setShowWarning(true);
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Submit confession
      // NOTE: For full IP tracking, this should go through a serverless function
      // For now, we'll submit with limited metadata
      await submitConfession(text, {
        ip: 'client-side', // In production, get from serverless function
        location: 'Nigeria' // In production, get from IP geolocation
      });

      // Success!
      setShowSuccess(true);
      setText('');

      // Call parent callback
      if (onSuccess) {
        onSuccess();
      }

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);

    } catch (err) {
      setError(err.message || 'Failed to submit confession. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
            <Send className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Share Your Confession</h2>
            <p className="text-sm text-gray-400">Your identity will remain completely anonymous</p>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Text Area */}
          <div className="relative">
            <textarea
              value={text}
              onChange={handleTextChange}
              placeholder="What's on your mind? Share your thoughts, feelings, or experiences..."
              className={`w-full min-h-[200px] px-4 py-3 bg-white/5 border ${
                hasProfanity ? 'border-red-500/50' : 'border-white/10'
              } rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-all resize-none`}
              disabled={isSubmitting}
            />

            {/* Character Counter */}
            <div className={`absolute bottom-3 right-3 text-sm ${
              charRemaining < 50 ? 'text-yellow-400' : 'text-gray-500'
            } ${charRemaining === 0 ? 'text-red-400 font-bold' : ''}`}>
              {charRemaining} / {MAX_LENGTH}
            </div>
          </div>

          {/* Profanity Warning */}
          {hasProfanity && (
            <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl animate-fadeIn">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-400 font-semibold text-sm mb-1">Inappropriate Language Detected</p>
                <p className="text-red-300/80 text-xs">
                  Your confession contains words that violate our community guidelines. Please revise before submitting.
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl animate-fadeIn">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {showSuccess && (
            <div className="flex items-start gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-xl animate-fadeIn">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
              <div>
                <p className="text-green-400 font-semibold text-sm mb-1">Confession Posted!</p>
                <p className="text-green-300/80 text-xs">
                  Your confession has been shared anonymously and will appear in the feed shortly.
                </p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>Anonymous posting • No login required</span>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !text.trim() || hasProfanity || charCount < 10}
              className="relative px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <span className="relative z-10 flex items-center gap-2">
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Posting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Post Anonymously</span>
                  </>
                )}
              </span>
            </button>
          </div>

          {/* Guidelines */}
          <div className="pt-4 border-t border-white/10">
            <p className="text-xs text-gray-500 mb-2">Community Guidelines:</p>
            <ul className="text-xs text-gray-500 space-y-1">
              <li>• Be respectful and considerate of others</li>
              <li>• No hate speech, threats, or harassment</li>
              <li>• No personal information about yourself or others</li>
              <li>• No spam or promotional content</li>
            </ul>
          </div>
        </div>

        {/* Warning Modal */}
        {showWarning && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-gradient-to-b from-[hsl(210,45%,14%)] to-[hsl(var(--background))] border border-white/10 rounded-2xl max-w-md w-full p-8 shadow-2xl animate-slideUp">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/20 mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-400" />
                </div>

                <h3 className="text-2xl font-bold text-white mb-3">Cannot Post</h3>
                <p className="text-gray-300 mb-6">
                  Your confession contains inappropriate language that violates our community guidelines. 
                  Please edit your confession and remove any offensive words.
                </p>

                <button
                  onClick={() => setShowWarning(false)}
                  className="w-full px-6 py-3 bg-white/10 border border-white/20 text-white rounded-xl font-semibold hover:bg-white/20 transition-all"
                >
                  Edit Confession
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}