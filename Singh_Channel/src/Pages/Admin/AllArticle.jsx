import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Eye, Edit, Trash2, Search, Filter } from "lucide-react";
import adminService from "../../Services/adminService";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { Panel } from "../../Components";

// Debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

function formatDate(dateString) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
  });
}

function AllArticle() {
  const { getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalCount: 0 });
  const [error, setError] = useState(null);
  const [statusCounts, setStatusCounts] = useState({});
  const [deleteLoading, setDeleteLoading] = useState(null); // Track which article is being deleted
  
  // Separate immediate filters (like status) from debounced filters (like search)
  const [immediateFilters, setImmediateFilters] = useState({
    status: "all",
    sortBy: "createdAt",
    sortOrder: "desc"
  });
  const [searchInput, setSearchInput] = useState("");
  
  // Debounce search input with 500ms delay
  const debouncedSearch = useDebounce(searchInput, 500);
  
  // Memoize final filters object to prevent unnecessary re-renders
  const filters = useMemo(() => ({
    ...immediateFilters,
    search: debouncedSearch
  }), [immediateFilters, debouncedSearch]);

  // Memoized fetch function to prevent recreation on every render
  const fetchArticles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = await getAccessTokenSilently();
      const data = await adminService.getAllArticlesForAdmin({ 
        page, 
        limit, 
        ...filters,
        token 
      });
      setArticles(data.articles || []);
      setPagination(data.pagination || { currentPage: 1, totalPages: 1, totalCount: 0 });
      setStatusCounts(data.statusCounts || {});
    } catch (err) {
      console.error("Failed to fetch articles:", err);
      setError("Failed to fetch articles. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, filters, getAccessTokenSilently]);

  // Effect for API calls - only triggers when necessary
  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => Math.min(pagination.totalPages, p + 1));

  // Immediate filter changes (no debounce needed)
  const handleFilterChange = useCallback((key, value) => {
    setImmediateFilters(prev => ({ ...prev, [key]: value }));
    setPage(1); // Reset to first page when filters change
  }, []);

  // Search input change (will be debounced)
  const handleSearchChange = useCallback((searchTerm) => {
    setSearchInput(searchTerm);
    setPage(1);
  }, []);

  // Manual refresh function
  const handleRefresh = useCallback(() => {
    fetchArticles();
  }, [fetchArticles]);

  // Handle delete article
  const handleDeleteArticle = async (articleId) => {
    if (!window.confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
      return;
    }

    setDeleteLoading(articleId);
    try {
      const token = await getAccessTokenSilently();
      await adminService.deleteArticle(articleId, token);
      
      // Remove the deleted article from the current list
      setArticles(prev => prev.filter(article => article._id !== articleId));
      
      // Update pagination count
      setPagination(prev => ({
        ...prev,
        totalCount: prev.totalCount - 1
      }));
      
      alert('Article deleted successfully!');
    } catch (error) {
      console.error('Error deleting article:', error);
      setError(error.message || 'Failed to delete article');
    } finally {
      setDeleteLoading(null);
    }
  };

  // Handle edit article
  const handleEditArticle = (articleId) => {
    navigate(`/admin/edit-article/${articleId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 px-2 py-4 sm:px-4 sm:py-6">
      <div className="mx-auto max-w-6xl rounded-xl bg-white p-2 shadow-md sm:p-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">All Articles</h1>
          
          {/* Status Filter, Search, and Refresh */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-600" />
              <select
                value={immediateFilters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="rounded border border-gray-300 px-3 py-1 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="all">All Status</option>
                <option value="publish">Published ({statusCounts.publish || 0})</option>
                <option value="draft">Draft ({statusCounts.draft || 0})</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <Search size={18} className="text-gray-600" />
              <input
                type="text"
                placeholder="Search articles... (debounced)"
                value={searchInput}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="rounded border border-gray-300 px-3 py-1 text-sm focus:border-blue-500 focus:outline-none"
              />
              {debouncedSearch !== searchInput && (
                <span className="text-xs text-gray-500">Searching...</span>
              )}
            </div>
            
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600 disabled:opacity-50"
            >
              {isLoading ? "Loading..." : "Refresh"}
            </button>
          </div>
        </div>
        
        {error && <div className="mb-4 rounded bg-red-100 px-4 py-2 text-red-700">{error}</div>}
        {/* Table for md+ screens, cards for mobile */}
        <div className="hidden min-w-full overflow-x-auto md:block">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Title</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Author</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Views</th>
                <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-4" colSpan={6}>
                      <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200"></div>
                    </td>
                  </tr>
                ))
              ) : articles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    No articles found.
                  </td>
                </tr>
              ) : (
                articles.map((article) => (
                  <tr key={article.slug} className="hover:bg-blue-50">
                    <td className="px-4 py-4 font-medium text-gray-900">
                      <div className="flex items-center gap-2">
                        {article.headline}
                        {article.isfeatured && (
                          <span className="rounded bg-yellow-100 px-2 py-0.5 text-xs text-yellow-700">Featured</span>
                        )}
                        {article.isBreaking && (
                          <span className="rounded bg-red-100 px-2 py-0.5 text-xs text-red-700">Breaking</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-gray-700">{article.author || '-'}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                        article.status === "publish" 
                          ? "bg-green-100 text-green-700" 
                          : article.status === "draft"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700"
                      }`}>
                        {article.status === "publish" ? "Published" : article.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-gray-600">{formatDate(article.updatedAt)}</td>
                    <td className="px-4 py-4 text-gray-600">{article.views?.toLocaleString() ?? 0}</td>
                    <td className="px-4 py-4 text-center">
                      <button 
                        className="mx-1 rounded p-1 text-blue-600 hover:bg-blue-100" 
                        title="View"
                        onClick={() => window.open(`/article/${article.slug}`, '_blank')}
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        className="mx-1 rounded p-1 text-green-600 hover:bg-green-100" 
                        title="Edit"
                        onClick={() => handleEditArticle(article._id)}
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        className="mx-1 rounded p-1 text-red-600 hover:bg-red-100" 
                        title="Delete"
                        onClick={() => handleDeleteArticle(article._id)}
                        disabled={deleteLoading === article._id}
                      >
                        {deleteLoading === article._id ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent"></div>
                        ) : (
                          <Trash2 size={18} />
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Card layout for mobile */}
        <div className="block md:hidden">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="mb-4 rounded-lg border bg-gray-50 p-4 shadow animate-pulse">
                <div className="h-4 w-2/3 rounded bg-gray-200 mb-2"></div>
                <div className="h-3 w-1/3 rounded bg-gray-200 mb-2"></div>
                <div className="h-3 w-1/4 rounded bg-gray-200 mb-2"></div>
                <div className="h-3 w-1/2 rounded bg-gray-200 mb-2"></div>
                <div className="h-3 w-1/4 rounded bg-gray-200" />
              </div>
            ))
          ) : articles.length === 0 ? (
            <div className="py-8 text-center text-gray-500">No articles found.</div>
          ) : (
            articles.map((article) => (
              <Panel key={article.slug} variant="card" className="mb-4">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex-1">
                    <span className="font-semibold text-gray-900">{article.headline}</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {article.isfeatured && (
                        <span className="rounded bg-yellow-100 px-2 py-0.5 text-xs text-yellow-700">Featured</span>
                      )}
                      {article.isBreaking && (
                        <span className="rounded bg-red-100 px-2 py-0.5 text-xs text-red-700">Breaking</span>
                      )}
                    </div>
                  </div>
                  <span className={`ml-2 rounded-full px-2 py-0.5 text-xs font-semibold ${
                    article.status === "publish" 
                      ? "bg-green-100 text-green-700" 
                      : article.status === "draft"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-700"
                  }`}>
                    {article.status === "publish" ? "Published" : article.status}
                  </span>
                </div>
                <div className="mb-1 text-sm text-gray-700">By {article.author || '-'}</div>
                <div className="mb-1 text-xs text-gray-500">{formatDate(article.updatedAt)}</div>
                <div className="mb-2 text-xs text-gray-500 flex items-center gap-1">
                  <Eye size={14} /> {article.views?.toLocaleString() ?? 0}
                </div>
                <div className="flex gap-2">
                  <button 
                    className="rounded p-1 text-blue-600 hover:bg-blue-100" 
                    title="View"
                    onClick={() => window.open(`/article/${article.slug}`, '_blank')}
                  >
                    <Eye size={18} />
                  </button>
                  <button 
                    className="rounded p-1 text-green-600 hover:bg-green-100" 
                    title="Edit"
                    onClick={() => handleEditArticle(article._id)}
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    className="rounded p-1 text-red-600 hover:bg-red-100" 
                    title="Delete"
                    onClick={() => handleDeleteArticle(article._id)}
                    disabled={deleteLoading === article._id}
                  >
                    {deleteLoading === article._id ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent"></div>
                    ) : (
                      <Trash2 size={18} />
                    )}
                  </button>
                </div>
              </Panel>
            ))
          )}
        </div>
        {/* Pagination Controls */}
        <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="text-sm text-gray-600">
            <div className="flex flex-col gap-1 sm:flex-row sm:gap-4">
              <span>Page {pagination.currentPage} of {pagination.totalPages}</span>
              <span>Total: {pagination.totalCount} articles</span>
              {immediateFilters.status !== "all" && (
                <span>Filtered by: {immediateFilters.status}</span>
              )}
              {debouncedSearch && (
                <span>Search: "{debouncedSearch}"</span>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePrev}
              disabled={isLoading || pagination.currentPage === 1}
              className="rounded bg-gray-200 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <span className="flex items-center px-2 text-sm text-gray-600">
              {pagination.currentPage} / {pagination.totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={isLoading || pagination.currentPage === pagination.totalPages}
              className="rounded bg-gray-200 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AllArticle;