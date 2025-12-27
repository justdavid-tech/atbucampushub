import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export default function Pagination({ 
  currentPage = 1, 
  totalPages = 10, 
  onPageChange,
  postsPerPage = 12,
  totalPosts = 120 
}) {
  
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show smart pagination with ellipsis
      if (currentPage <= 3) {
        // Near start
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near end
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        // Middle
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();
  
  // Calculate range
  const startPost = (currentPage - 1) * postsPerPage + 1;
  const endPost = Math.min(currentPage * postsPerPage, totalPosts);

  // Navigation handlers
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange?.(page);
      // Scroll to top smoothly
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToFirstPage = () => goToPage(1);
  const goToLastPage = () => goToPage(totalPages);
  const goToPrevious = () => goToPage(currentPage - 1);
  const goToNext = () => goToPage(currentPage + 1);

  // Don't show pagination if only 1 page
  if (totalPages <= 1) return null;

  return (
    <div className="relative">
      {/* Decorative Line */}
      <div className="absolute top-1/2 left-0 w-full h-px bg-[hsl(var(--primary))]/20 -z-10"></div>

      <div className="w-full mx-auto">
        <div className="bg-[hsl(var(--background))] border border-[hsl(var(--primary))]/20 p-6 shadow-[0_0_30px_rgba(239,45,86,0.1)] relative overflow-hidden">
          {/* Accent Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[hsl(var(--primary))]/5 blur-[80px] rounded-full pointer-events-none"></div>

          <div className="relative z-10">
            {/* Results Info */}
            <div className="text-center mb-6">
              <p className="text-sm text-gray-400">
                Showing <span className="font-semibold text-white">{startPost}</span> to{' '}
                <span className="font-semibold text-white">{endPost}</span> of{' '}
                <span className="font-semibold text-white">{totalPosts}</span> posts
              </p>
            </div>

            {/* Pagination Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {/* Previous Buttons */}
              <div className="flex items-center gap-2">
                {/* First Page */}
                <button
                  onClick={goToFirstPage}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg border transition-all duration-300 ${
                    currentPage === 1
                      ? 'bg-white/5 border-white/10 text-gray-600 cursor-not-allowed'
                      : 'bg-white/5 border-white/10 text-white hover:bg-[hsl(var(--primary))]/10 hover:border-[hsl(var(--primary))]/30 hover:text-[hsl(var(--primary))] hover:scale-110'
                  }`}
                  aria-label="First page"
                >
                  <ChevronsLeft className="w-5 h-5" />
                </button>

                {/* Previous Page */}
                <button
                  onClick={goToPrevious}
                  disabled={currentPage === 1}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-300 ${
                    currentPage === 1
                      ? 'bg-white/5 border-white/10 text-gray-600 cursor-not-allowed'
                      : 'bg-white/5 border-white/10 text-white hover:bg-[hsl(var(--primary))]/10 hover:border-[hsl(var(--primary))]/30 hover:text-[hsl(var(--primary))] hover:scale-105'
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span className="hidden sm:inline font-medium">Previous</span>
                </button>
              </div>

              {/* Page Numbers */}
              <div className="flex items-center gap-2">
                {pageNumbers.map((page, index) => {
                  if (page === '...') {
                    return (
                      <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
                        ...
                      </span>
                    );
                  }

                  const isActive = page === currentPage;

                  return (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`min-w-[40px] h-10 rounded-lg font-medium transition-all duration-300 ${
                        isActive
                          ? 'bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))] text-white shadow-lg scale-110 border-2 border-[hsl(var(--primary))]'
                          : 'bg-white/5 border border-white/10 text-white hover:bg-[hsl(var(--primary))]/10 hover:border-[hsl(var(--primary))]/30 hover:text-[hsl(var(--primary))] hover:scale-105'
                      }`}
                      aria-label={`Page ${page}`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>

              {/* Next Buttons */}
              <div className="flex items-center gap-2">
                {/* Next Page */}
                <button
                  onClick={goToNext}
                  disabled={currentPage === totalPages}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-300 ${
                    currentPage === totalPages
                      ? 'bg-white/5 border-white/10 text-gray-600 cursor-not-allowed'
                      : 'bg-white/5 border-white/10 text-white hover:bg-[hsl(var(--primary))]/10 hover:border-[hsl(var(--primary))]/30 hover:text-[hsl(var(--primary))] hover:scale-105'
                  }`}
                >
                  <span className="hidden sm:inline font-medium">Next</span>
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Last Page */}
                <button
                  onClick={goToLastPage}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg border transition-all duration-300 ${
                    currentPage === totalPages
                      ? 'bg-white/5 border-white/10 text-gray-600 cursor-not-allowed'
                      : 'bg-white/5 border-white/10 text-white hover:bg-[hsl(var(--primary))]/10 hover:border-[hsl(var(--primary))]/30 hover:text-[hsl(var(--primary))] hover:scale-110'
                  }`}
                  aria-label="Last page"
                >
                  <ChevronsRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Items Per Page Selector (Optional) */}
            <div className="mt-6 flex items-center justify-center gap-3 text-sm">
              <span className="text-gray-400">Posts per page:</span>
              <div className="flex gap-2">
                {[6, 12, 24, 48].map((count) => (
                  <button
                    key={count}
                    onClick={() => {
                      // Handle posts per page change
                      console.log(`Change to ${count} posts per page`);
                    }}
                    className={`px-3 py-1.5 rounded-lg border transition-all duration-300 ${
                      postsPerPage === count
                        ? 'bg-[hsl(var(--primary))]/20 border-[hsl(var(--primary))]/30 text-[hsl(var(--primary))] font-semibold'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-[hsl(var(--primary))]/10 hover:text-[hsl(var(--primary))]'
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Jump (Desktop Only) */}
            <div className="hidden lg:flex items-center justify-center gap-3 mt-6 text-sm">
              <span className="text-gray-400">Jump to page:</span>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max={totalPages}
                  placeholder={currentPage.toString()}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const page = parseInt(e.target.value);
                      if (page >= 1 && page <= totalPages) {
                        goToPage(page);
                        e.target.value = '';
                      }
                    }
                  }}
                  className="w-20 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white text-center focus:outline-none focus:border-[hsl(var(--primary))] focus:bg-white/10 transition-all duration-300"
                />
              </div>
              <span className="text-gray-500">of {totalPages}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}