import { useState, useEffect } from 'react';
import { isPostingDay, getConfessionStats, getTopConfession } from '../lib/confessionQueries';

// Imported confession components
import ConfessionHero from '../confessionComponents/confessionHero';
import ConfessionForm from '../confessionComponents/confessionForm';
import ConfessionsFeed from '../confessionComponents/confessionFeed';
import ConfessionModal from '../confessionComponents/confessionModal';

import Navbar from '../components/navbar';
import Footer from '../components/footer';

export default function ConfessionsPage() {
  const [showForm, setShowForm] = useState(false);
  const [selectedConfession, setSelectedConfession] = useState(null);
  const [stats, setStats] = useState(null);
  const [topConfession, setTopConfession] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    loadStats();
    loadTopConfession();
  }, [refreshKey]);

  useEffect(() => {
    // Auto-show form if it's posting day
    setShowForm(isPostingDay());
  }, []);

  const loadStats = async () => {
    try {
      const data = await getConfessionStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadTopConfession = async () => {
    try {
      const data = await getTopConfession();
      setTopConfession(data);
    } catch (error) {
      console.error('Error loading top confession:', error);
    }
  };

  const handleConfessionSuccess = () => {
    // Refresh the feed after successful submission
    setRefreshKey(prev => prev + 1);
    
    // Scroll to feed
    const feedElement = document.getElementById('confessions-feed');
    if (feedElement) {
      feedElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleConfessionClick = (confession) => {
    setSelectedConfession(confession);
  };

  const handleCloseModal = () => {
    setSelectedConfession(null);
    // Refresh in case likes/replies changed
    setRefreshKey(prev => prev + 1);
  };

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gradient-to-b from-[hsl(var(--background))] via-[hsl(210,45%,14%)] to-[hsl(var(--background))]">
      {/* Hero Section */}
      <ConfessionHero stats={stats} />

      {/* Submission Form - Only visible on Tue/Fri */}
      {showForm && isPostingDay() && (
        <ConfessionForm onSuccess={handleConfessionSuccess} />
      )}

      {/* Confessions Feed */}
      <div id="confessions-feed">
        <ConfessionsFeed 
          key={refreshKey}
          onConfessionClick={handleConfessionClick}
          topConfession={topConfession}
        />
      </div>

      {/* Full Confession Modal */}
      {selectedConfession && (
        <ConfessionModal
          confession={selectedConfession}
          onClose={handleCloseModal}
        />
      )}
    </div>
    <Footer />
    </>
  );
}