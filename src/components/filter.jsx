import { useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';

export default function FilterBar({ onFilterChange, totalResults = 0 }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [showFilters, setShowFilters] = useState(false);

  const sortOptions = [
    { value: 'latest', label: 'Latest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'most-viewed', label: 'Most Viewed' },
    { value: 'alphabetical-asc', label: 'A to Z' },
    { value: 'alphabetical-desc', label: 'Z to A' }
  ];

  // Handle search
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Call parent callback with filters
    if (onFilterChange) {
      onFilterChange({
        search: value,
        sort: sortBy
      });
    }
  };

  // Handle sort change
  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortBy(value);
    
    if (onFilterChange) {
      onFilterChange({
        search: searchQuery,
        sort: value
      });
    }
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setSortBy('latest');
    
    if (onFilterChange) {
      onFilterChange({
        search: '',
        sort: 'latest'
      });
    }
  };

  // Check if filters are active
  const hasActiveFilters = searchQuery || sortBy !== 'latest';

  return (
    <div className="relative bg-[hsl(var(--background))] border border-[hsl(var(--primary))]/20  p-4 lg:p-6 shadow-[0_0_30px_rgba(239,45,86,0.1)] overflow-hidden">
      {/* Accent Glow */}
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[hsl(var(--primary))]/5 blur-[80px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
      
      {/* Main Filter Row */}
      <div className="relative z-10 flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
        {/* Search Bar */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search posts by title, content, or tags..."
            className="w-full pl-12 pr-10 py-3 bg-white/5 border border-white/10  text-white placeholder-gray-500 focus:outline-none focus:border-[hsl(var(--primary))] focus:bg-white/10 transition-all duration-300"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                if (onFilterChange) {
                  onFilterChange({ search: '', sort: sortBy });
                }
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={handleSortChange}
            className="appearance-none w-full lg:w-auto pl-4 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[hsl(var(--primary))] focus:bg-white/10 transition-all duration-300 cursor-pointer"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value} className="bg-[hsl(var(--background))] text-white">
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Mobile Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden flex items-center justify-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all duration-300"
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span className="font-medium">Filters</span>
        </button>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-[hsl(var(--primary))]/10 hover:border-[hsl(var(--primary))]/30 hover:text-[hsl(var(--primary))] transition-all duration-300"
          >
            <X className="w-5 h-5" />
            <span className="font-medium">Clear</span>
          </button>
        )}
      </div>

      {/* Results Counter */}
      <div className="relative z-10 mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
        <p className="text-sm text-gray-400">
          {totalResults > 0 ? (
            <>
              Showing <span className="font-semibold text-white">{totalResults}</span> {totalResults === 1 ? 'post' : 'posts'}
              {searchQuery && (
                <span> for "<span className="text-[hsl(var(--primary))]">{searchQuery}</span>"</span>
              )}
            </>
          ) : (
            <span>No posts found</span>
          )}
        </p>

        {/* Sort Label (Desktop) */}
        <div className="hidden lg:flex items-center gap-2 text-sm text-gray-400">
          <SlidersHorizontal className="w-4 h-4" />
          <span>Sorted by: <span className="text-white font-medium">{sortOptions.find(opt => opt.value === sortBy)?.label}</span></span>
        </div>
      </div>

      {/* Active Search Indicator */}
      {searchQuery && (
        <div className="relative z-10 mt-4 flex items-center gap-2">
          <span className="text-sm text-gray-400">Active filter:</span>
          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-[hsl(var(--primary))]/10 border border-[hsl(var(--primary))]/20 rounded-full text-sm text-[hsl(var(--primary))]">
            Search: {searchQuery}
            <button
              onClick={() => {
                setSearchQuery('');
                if (onFilterChange) {
                  onFilterChange({ search: '', sort: sortBy });
                }
              }}
              className="hover:bg-[hsl(var(--primary))]/20 rounded-full p-0.5 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </span>
        </div>
      )}

      {/* Mobile Filters Panel (Hidden by default) */}
      {showFilters && (
        <div className="lg:hidden mt-4 pt-4 border-t border-white/10 space-y-4 animate-slideDown">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="w-full pl-4 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[hsl(var(--primary))] focus:bg-white/10 transition-all duration-300"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value} className="bg-[hsl(var(--background))] text-white">
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}