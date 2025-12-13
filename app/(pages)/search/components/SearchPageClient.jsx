"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/app/components/Products";
import SearchFilters from "./SearchFilters";
import { Search, BookOpen, Package } from "lucide-react";

export default function SearchPageClient({ 
  products = [], 
  categories = [], 
  collections = [], 
  brands = [],
  searchParams = {}
}) {
  const urlSearchParams = useSearchParams();
  
  // Parse initial filters from URL
  const getInitialFilters = () => {
    return {
      categoryIds: urlSearchParams.get("categories")?.split(",").filter(Boolean) || [],
      collectionIds: urlSearchParams.get("collections")?.split(",").filter(Boolean) || [],
      brandIds: urlSearchParams.get("brands")?.split(",").filter(Boolean) || [],
      minPrice: urlSearchParams.get("minPrice") || "",
      maxPrice: urlSearchParams.get("maxPrice") || "",
      sortBy: urlSearchParams.get("sort") || "newest",
    };
  };

  const [filters, setFilters] = useState(getInitialFilters);
  const searchQuery = urlSearchParams.get("q") || "";

  // Update filters when URL changes
  useEffect(() => {
    setFilters(getInitialFilters());
  }, [urlSearchParams]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Text search
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase().trim();
      const searchTerms = searchLower.split(/\s+/);
      
      result = result.filter((product) => {
        const title = (product?.title || "").toLowerCase();
        const description = (product?.shortDescription || "").toLowerCase();
        
        return searchTerms.some(term => 
          title.includes(term) || description.includes(term)
        );
      });
    }

    // Category filter (Class)
    if (filters.categoryIds.length > 0) {
      result = result.filter((product) => 
        filters.categoryIds.includes(product?.categoryId)
      );
    }

    // Collection filter (Subject)
    if (filters.collectionIds.length > 0) {
      result = result.filter((product) => 
        product?.collectionIds?.some(id => filters.collectionIds.includes(id))
      );
    }

    // Brand filter (Board)
    if (filters.brandIds.length > 0) {
      result = result.filter((product) => 
        product?.brandIds?.some(id => filters.brandIds.includes(id))
      );
    }

    // Price filter
    if (filters.minPrice) {
      result = result.filter((product) => 
        product?.salePrice >= parseFloat(filters.minPrice)
      );
    }
    if (filters.maxPrice) {
      result = result.filter((product) => 
        product?.salePrice <= parseFloat(filters.maxPrice)
      );
    }

    // Sorting
    switch (filters.sortBy) {
      case "price-low":
        result.sort((a, b) => (a?.salePrice || 0) - (b?.salePrice || 0));
        break;
      case "price-high":
        result.sort((a, b) => (b?.salePrice || 0) - (a?.salePrice || 0));
        break;
      case "name-asc":
        result.sort((a, b) => (a?.title || "").localeCompare(b?.title || ""));
        break;
      case "name-desc":
        result.sort((a, b) => (b?.title || "").localeCompare(a?.title || ""));
        break;
      case "newest":
      default:
        // Already sorted by timestamp from server
        break;
    }

    return result;
  }, [products, filters, searchQuery]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Get active filter labels for display
  const getActiveFilterLabels = () => {
    const labels = [];
    
    filters.categoryIds.forEach(id => {
      const cat = categories.find(c => c.id === id);
      if (cat) labels.push({ type: "category", id, label: cat.name });
    });
    
    filters.collectionIds.forEach(id => {
      const col = collections.find(c => c.id === id);
      if (col) labels.push({ type: "collection", id, label: col.title });
    });
    
    filters.brandIds.forEach(id => {
      const brand = brands.find(b => b.id === id);
      if (brand) labels.push({ type: "brand", id, label: brand.name });
    });

    if (filters.minPrice || filters.maxPrice) {
      const priceLabel = `₹${filters.minPrice || "0"} - ₹${filters.maxPrice || "∞"}`;
      labels.push({ type: "price", id: "price", label: priceLabel });
    }
    
    return labels;
  };

  const activeLabels = getActiveFilterLabels();

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Search Filters Component handles search bar and filter sidebar */}
      <div className="flex flex-col">
        <SearchFilters 
          categories={categories}
          collections={collections}
          brands={brands}
          onFilterChange={handleFilterChange}
          initialFilters={filters}
        />
        
        <div className="max-w-7xl mx-auto w-full px-4 py-6">
          <div className="flex gap-6">
            {/* Desktop Sidebar Placeholder - actual sidebar is in SearchFilters */}
            <div className="hidden md:block w-64 flex-shrink-0">
              <div className="sticky top-20 bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                <h2 className="font-bold text-lg text-indigo-900 mb-4 flex items-center gap-2">
                  <Package size={18} />
                  Filters
                </h2>
                <FiltersSidebar 
                  categories={categories}
                  collections={collections}
                  brands={brands}
                  filters={filters}
                  onFilterChange={handleFilterChange}
                />
              </div>
            </div>

            {/* Products Grid */}
            <div className="flex-1">
              {/* Results Header */}
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h1 className="text-2xl font-bold text-indigo-900">
                      {searchQuery ? `Results for "${searchQuery}"` : "All Books"}
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                      {filteredProducts.length} {filteredProducts.length === 1 ? "book" : "books"} found
                    </p>
                  </div>
                </div>

                {/* Active Filter Tags */}
                {activeLabels.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {activeLabels.map((item) => (
                      <span 
                        key={`${item.type}-${item.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
                      >
                        {item.label}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Products Grid */}
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {filteredProducts.map((product) => (
                    <ProductCard product={product} key={product?.id} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-200">
                  <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center mb-6">
                    <BookOpen size={32} className="text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">No books found</h3>
                  <p className="text-gray-500 text-center max-w-md">
                    {searchQuery 
                      ? `We couldn't find any books matching "${searchQuery}". Try adjusting your filters or search terms.`
                      : "Try adjusting your filters to find what you're looking for."
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// Inline Filters Sidebar Component
function FiltersSidebar({ categories, collections, brands, filters, onFilterChange }) {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    collection: true,
    brand: true,
    price: true,
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleCheckboxChange = (key, id) => {
    const currentIds = filters[key] || [];
    const newIds = currentIds.includes(id)
      ? currentIds.filter(i => i !== id)
      : [...currentIds, id];
    onFilterChange({ ...filters, [key]: newIds });
  };

  const handlePriceChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const activeFilterCount = 
    filters.categoryIds.length + 
    filters.collectionIds.length + 
    filters.brandIds.length + 
    (filters.minPrice ? 1 : 0) + 
    (filters.maxPrice ? 1 : 0);

  const clearAllFilters = () => {
    onFilterChange({
      categoryIds: [],
      collectionIds: [],
      brandIds: [],
      minPrice: "",
      maxPrice: "",
      sortBy: "newest",
    });
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Class Filter */}
      <FilterSection 
        title="Class" 
        expanded={expandedSections.category}
        onToggle={() => toggleSection("category")}
      >
        {categories.map((cat) => (
          <FilterCheckbox
            key={cat.id}
            label={cat.name}
            checked={filters.categoryIds.includes(cat.id)}
            onChange={() => handleCheckboxChange("categoryIds", cat.id)}
          />
        ))}
        {categories.length === 0 && (
          <p className="text-xs text-gray-400">No classes available</p>
        )}
      </FilterSection>

      {/* Subject Filter */}
      <FilterSection 
        title="Subject" 
        expanded={expandedSections.collection}
        onToggle={() => toggleSection("collection")}
      >
        <div className="max-h-40 overflow-y-auto">
          {collections.map((col) => (
            <FilterCheckbox
              key={col.id}
              label={col.title}
              checked={filters.collectionIds.includes(col.id)}
              onChange={() => handleCheckboxChange("collectionIds", col.id)}
            />
          ))}
        </div>
        {collections.length === 0 && (
          <p className="text-xs text-gray-400">No subjects available</p>
        )}
      </FilterSection>

      {/* Board Filter */}
      <FilterSection 
        title="Board" 
        expanded={expandedSections.brand}
        onToggle={() => toggleSection("brand")}
      >
        {brands.map((brand) => (
          <FilterCheckbox
            key={brand.id}
            label={brand.name}
            checked={filters.brandIds.includes(brand.id)}
            onChange={() => handleCheckboxChange("brandIds", brand.id)}
          />
        ))}
        {brands.length === 0 && (
          <p className="text-xs text-gray-400">No boards available</p>
        )}
      </FilterSection>

      {/* Price Filter */}
      <FilterSection 
        title="Price Range" 
        expanded={expandedSections.price}
        onToggle={() => toggleSection("price")}
      >
        <div className="flex items-center gap-2 mb-3">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => handlePriceChange("minPrice", e.target.value)}
            className="w-full px-2 py-1.5 border rounded text-sm focus:outline-none focus:border-indigo-500"
          />
          <span className="text-gray-400">-</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => handlePriceChange("maxPrice", e.target.value)}
            className="w-full px-2 py-1.5 border rounded text-sm focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div className="flex flex-wrap gap-1">
          {[
            { label: "<₹200", min: "", max: "200" },
            { label: "₹200-400", min: "200", max: "400" },
            { label: ">₹400", min: "400", max: "" },
          ].map((range) => (
            <button
              key={range.label}
              onClick={() => {
                onFilterChange({ 
                  ...filters, 
                  minPrice: range.min, 
                  maxPrice: range.max 
                });
              }}
              className={`px-2 py-1 text-xs rounded border transition-all ${
                filters.minPrice === range.min && filters.maxPrice === range.max
                  ? "bg-indigo-900 text-white border-indigo-900"
                  : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Clear All */}
      {activeFilterCount > 0 && (
        <button
          onClick={clearAllFilters}
          className="text-sm text-red-500 hover:text-red-600 font-medium text-left"
        >
          Clear All ({activeFilterCount})
        </button>
      )}
    </div>
  );
}

function FilterSection({ title, expanded, onToggle, children }) {
  return (
    <div className="border-b border-gray-100 pb-4">
      <button 
        onClick={onToggle}
        className="flex items-center justify-between w-full text-left font-semibold text-indigo-900 mb-2 text-sm"
      >
        {title}
        <span className="text-gray-400">{expanded ? "−" : "+"}</span>
      </button>
      {expanded && <div className="flex flex-col gap-1">{children}</div>}
    </div>
  );
}

function FilterCheckbox({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded text-sm">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-3.5 h-3.5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
      />
      <span className="text-gray-700">{label}</span>
    </label>
  );
}
