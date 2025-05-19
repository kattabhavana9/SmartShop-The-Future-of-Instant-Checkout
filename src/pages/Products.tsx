import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Check, ChevronDown, SlidersHorizontal } from 'lucide-react';
import ProductCard from '../components/product/ProductCard';
import { products as allProducts, searchProducts } from '../data/products';
import { categories } from '../data/categories';
import { Product } from '../types/product';

const Products: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);

  const categoryParam = searchParams.get('category');
  const searchQuery = searchParams.get('search');
  const sortParam = searchParams.get('sort');

  useEffect(() => {
    // Simulate loading
    setLoading(true);
    
    setTimeout(() => {
      let filteredResults = [...allProducts];
      
      // Apply category filter from URL
      if (categoryParam) {
        filteredResults = filteredResults.filter(p => p.category === categoryParam);
        if (!selectedCategories.includes(categoryParam)) {
          setSelectedCategories([categoryParam]);
        }
      }
      
      // Apply search query from URL
      if (searchQuery) {
        filteredResults = searchProducts(searchQuery);
      }
      
      // Apply sort from URL
      if (sortParam === 'popular') {
        filteredResults = filteredResults.filter(p => p.isPopular);
        setSortBy('popular');
      }
      
      setProducts(filteredResults);
      setFilteredProducts(filteredResults);
      
      // Get min and max prices from available products
      if (filteredResults.length > 0) {
        const prices = filteredResults.map(p => p.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        setPriceRange([minPrice, maxPrice]);
      }
      
      setLoading(false);
    }, 500);
  }, [categoryParam, searchQuery, sortParam]);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...products];
    
    // Apply category filters
    if (selectedCategories.length > 0) {
      result = result.filter(p => selectedCategories.includes(p.category));
    }
    
    // Apply price filter
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    
    // Apply sorting
    if (sortBy) {
      switch (sortBy) {
        case 'price-low':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          result.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          result.sort((a, b) => b.rating - a.rating);
          break;
        case 'popular':
          result = result.filter(p => p.isPopular);
          break;
        default:
          break;
      }
    }
    
    setFilteredProducts(result);
  }, [selectedCategories, priceRange, sortBy, products]);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = parseInt(e.target.value);
    setPriceRange(prev => {
      const newRange = [...prev] as [number, number];
      newRange[index] = value;
      return newRange;
    });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 1000]);
    setSortBy('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {categoryParam ? categoryParam : searchQuery ? `Search: ${searchQuery}` : 'All Products'}
          </h1>
          {searchQuery && (
            <p className="text-gray-600 mt-2">
              Showing {filteredProducts.length} results for "{searchQuery}"
            </p>
          )}
        </div>
        
        {/* Mobile filter toggle */}
        <div className="md:hidden mb-4">
          <button
            onClick={toggleFilter}
            className="w-full flex items-center justify-between p-3 bg-white rounded-lg shadow-sm border border-gray-200"
          >
            <div className="flex items-center">
              <SlidersHorizontal className="h-5 w-5 mr-2 text-gray-600" />
              <span>Filters & Sorting</span>
            </div>
            <ChevronDown className={`h-5 w-5 transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
        
        <div className="flex flex-col md:flex-row md:gap-6">
          {/* Filters - Desktop */}
          <div className={`md:block md:w-1/4 mb-6 md:mb-0 ${filterOpen ? 'block' : 'hidden'}`}>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Filter Header */}
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <div className="flex items-center">
                  <Filter className="h-5 w-5 mr-2 text-gray-600" />
                  <h3 className="font-medium">Filters</h3>
                </div>
                <button 
                  onClick={clearFilters} 
                  className="text-sm text-primary-600 hover:text-primary-800"
                >
                  Clear All
                </button>
              </div>
              
              {/* Category Filter */}
              <div className="p-4 border-b border-gray-200">
                <h4 className="font-medium mb-3">Categories</h4>
                <div className="space-y-2">
                  {categories.map(category => (
                    <label key={category.id} className="flex items-center space-x-2 cursor-pointer">
                      <div className={`w-5 h-5 border rounded flex items-center justify-center ${
                        selectedCategories.includes(category.name) 
                          ? 'bg-primary-600 border-primary-600' 
                          : 'border-gray-300'
                      }`}>
                        {selectedCategories.includes(category.name) && (
                          <Check className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <span className="text-sm">{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Price Range Filter */}
              <div className="p-4 border-b border-gray-200">
                <h4 className="font-medium mb-3">Price Range</h4>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">₹{priceRange[0]}</span>
                  <span className="text-sm">₹{priceRange[1]}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={priceRange[0]}
                  onChange={(e) => handlePriceChange(e, 0)}
                  className="w-full"
                />
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={priceRange[1]}
                  onChange={(e) => handlePriceChange(e, 1)}
                  className="w-full"
                />
              </div>
              
              {/* Sort Options - Mobile Only */}
              <div className="p-4 md:hidden">
                <h4 className="font-medium mb-3">Sort By</h4>
                <select
                  value={sortBy}
                  onChange={handleSortChange}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="">Relevance</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="popular">Popularity</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Products Grid */}
          <div className="flex-1">
            {/* Sort Dropdown - Desktop */}
            <div className="hidden md:flex justify-between items-center mb-4">
              <p className="text-sm text-gray-600">
                Showing {filteredProducts.length} products
              </p>
              <div className="flex items-center">
                <span className="text-sm mr-2">Sort By:</span>
                <select
                  value={sortBy}
                  onChange={handleSortChange}
                  className="p-2 border border-gray-300 rounded bg-white"
                >
                  <option value="">Relevance</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="popular">Popularity</option>
                </select>
              </div>
            </div>
            
            {/* Loading State */}
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm h-72 animate-pulse">
                    <div className="h-40 bg-gray-200 rounded-t-lg"></div>
                    <div className="p-4">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-10">
                <div className="text-primary-600 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No products found</h3>
                <p className="text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;