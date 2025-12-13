"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X, ChevronDown, ChevronUp } from "lucide-react";

export default function SearchFilters({ 
  categories = [], 
  collections = [], 
  brands = [],
  onFilterChange,
  initialFilters = {}
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    collection: true,
    brand: true,
    price: true,
  });
  
  const [filters, setFilters] = useState({
    categoryIds: initialFilters.categoryIds || [],
    collectionIds: initialFilters.collectionIds || [],
    brandIds: initialFilters.brandIds || [],
    minPrice: initialFilters.minPrice || "",
    maxPrice: initialFilters.maxPrice || "",
    sortBy: initialFilters.sortBy || "newest",
  });

  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleCheckboxChange = (key, id) => {
    const currentIds = filters[key] || [];
    const newIds = currentIds.includes(id)
      ? currentIds.filter(i => i !== id)
      : [...currentIds, id];
    handleFilterChange(key, newIds);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    router.push(`/search?${params.toString()}`);
    router.refresh();
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      categoryIds: [],
      collectionIds: [],
      brandIds: [],
      minPrice: "",
      maxPrice: "",
      sortBy: "newest",
    };
    setFilters(clearedFilters);
    onFilterChange?.(clearedFilters);
  };

  const activeFilterCount = 
    filters.categoryIds.length + 
    filters.collectionIds.length + 
    filters.brandIds.length + 
    (filters.minPrice ? 1 : 0) + 
    (filters.maxPrice ? 1 : 0);

  const MobileFilterContent = () => (
    <div className="flex flex-col gap-6">
      {/* Class/Category Filter */}
      <div className="border-b border-gray-200 pb-4">
        <button 
          onClick={() => toggleSection("category")}
          className="flex items-center justify-between w-full text-left font-semibold text-indigo-900 mb-3"
        >
          Class
          {expandedSections.category ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        {expandedSections.category && (
          <div className="flex flex-col gap-2">
            {categories.map((cat) => (
              <label key={cat.id} className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-1 rounded">
                <input
                  type="checkbox"
                  checked={filters.categoryIds.includes(cat.id)}
                  onChange={() => handleCheckboxChange("categoryIds", cat.id)}
                  className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">{cat.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Subject/Collection Filter */}
      <div className="border-b border-gray-200 pb-4">
        <button 
          onClick={() => toggleSection("collection")}
          className="flex items-center justify-between w-full text-left font-semibold text-indigo-900 mb-3"
        >
          Subject
          {expandedSections.collection ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        {expandedSections.collection && (
          <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
            {collections.map((col) => (
              <label key={col.id} className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-1 rounded">
                <input
                  type="checkbox"
                  checked={filters.collectionIds.includes(col.id)}
                  onChange={() => handleCheckboxChange("collectionIds", col.id)}
                  className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">{col.title}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Board/Brand Filter */}
      <div className="border-b border-gray-200 pb-4">
        <button 
          onClick={() => toggleSection("brand")}
          className="flex items-center justify-between w-full text-left font-semibold text-indigo-900 mb-3"
        >
          Board
          {expandedSections.brand ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        {expandedSections.brand && (
          <div className="flex flex-col gap-2">
            {brands.map((brand) => (
              <label key={brand.id} className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-1 rounded">
                <input
                  type="checkbox"
                  checked={filters.brandIds.includes(brand.id)}
                  onChange={() => handleCheckboxChange("brandIds", brand.id)}
                  className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">{brand.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Range Filter */}
      <div className="border-b border-gray-200 pb-4">
        <button 
          onClick={() => toggleSection("price")}
          className="flex items-center justify-between w-full text-left font-semibold text-indigo-900 mb-3"
        >
          Price Range
          {expandedSections.price ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        {expandedSections.price && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="₹ Min"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-indigo-500"
              />
              <span className="text-gray-400">-</span>
              <input
                type="number"
                placeholder="₹ Max"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Clear Filters */}
      {activeFilterCount > 0 && (
        <button
          onClick={clearAllFilters}
          className="text-sm text-red-500 hover:text-red-600 font-medium"
        >
          Clear All Filters ({activeFilterCount})
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Search Bar */}
      <div className="w-full bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for books by title, subject, class..."
                className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
              />
            </div>
            <button
              type="submit"
              className="bg-indigo-900 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:translate-y-[-1px] transition-transform"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Sort & Mobile Filter Bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => setShowMobileFilters(true)}
            className="md:hidden flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium"
          >
            <SlidersHorizontal size={16} />
            Filters
            {activeFilterCount > 0 && (
              <span className="bg-indigo-900 text-white text-xs px-2 py-0.5 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </button>
          
          <div className="hidden md:block text-sm text-gray-500">
            {activeFilterCount > 0 && `${activeFilterCount} filter(s) applied`}
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-600">Sort by:</label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange("sortBy", e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
            </select>
          </div>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowMobileFilters(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between z-10">
              <h2 className="font-bold text-lg text-indigo-900">Filters</h2>
              <button onClick={() => setShowMobileFilters(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="p-4">
              <MobileFilterContent />
            </div>
            <div className="sticky bottom-0 bg-white border-t p-4">
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full bg-indigo-900 text-white py-3 rounded-full font-semibold"
              >
                Show Results
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
