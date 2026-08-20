import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { CATEGORIES } from '../data/products';
import { CategoryType, SortOption } from '../types';
import { Search, SlidersHorizontal, X, ArrowUpDown, Filter, Sparkles } from 'lucide-react';

export const CatalogView: React.FC = () => {
  const {
    products,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    sortOption,
    setSortOption
  } = useApp();

  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');

  // Filter and sort products
  let filtered = products.filter((p) => {
    // Category match
    if (selectedCategory !== 'Semua' && p.cat !== selectedCategory) {
      return false;
    }
    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchDesc = p.desc.toLowerCase().includes(q);
      const matchTagline = p.tagline.toLowerCase().includes(q);
      const matchCat = p.cat.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchTagline && !matchCat) {
        return false;
      }
    }
    // Platform match
    if (selectedPlatform !== 'all') {
      if (!p.platform.toLowerCase().includes(selectedPlatform.toLowerCase())) {
        return false;
      }
    }
    return true;
  });

  // Sort
  if (sortOption === 'price-asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortOption === 'price-desc') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortOption === 'new') {
    filtered.sort((a, b) => (b.tag === 'new' ? 1 : 0) - (a.tag === 'new' ? 1 : 0));
  } else if (sortOption === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  } else {
    // popular default
    filtered.sort((a, b) => b.reviewsCount - a.reviewsCount);
  }

  const resetFilters = () => {
    setSelectedCategory('Semua');
    setSearchQuery('');
    setSelectedPlatform('all');
    setSortOption('popular');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="text-xs font-bold text-[#00e0c6] uppercase tracking-wider font-mono">
            Repositori Aplikasi
          </span>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-white mt-1">
            Katalog Software Bisnis
          </h1>
          <p className="text-sm text-[#9291ab] mt-1">
            Temukan aplikasi native berkecepatan tinggi dengan lisensi seumur hidup.
          </p>
        </div>

        <div className="text-xs text-[#9291ab] font-mono">
          Menampilkan <strong className="text-white">{filtered.length}</strong> dari {products.length} software
        </div>
      </div>

      {/* Filter and Search Bar Control */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Field */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-[#9291ab] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari berdasarkan nama software, fitur, atau kebutuhan bisnis..."
              className="w-full pl-10 pr-10 py-3 rounded-xl bg-white/[0.03] border border-white/15 text-sm text-white placeholder-[#615f78] focus:outline-none focus:border-[#7c5cff] focus:ring-2 focus:ring-[#7c5cff]/20 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9291ab] hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-56">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="w-full appearance-none bg-white/[0.04] border border-white/15 rounded-xl px-4 py-3 text-xs font-semibold text-white focus:outline-none focus:border-[#7c5cff] transition-colors pr-8 cursor-pointer"
              >
                <option value="popular" className="bg-[#0c0c16]">Urutkan: Terpopuler</option>
                <option value="rating" className="bg-[#0c0c16]">Rating Tertinggi</option>
                <option value="new" className="bg-[#0c0c16]">Rilis Terbaru</option>
                <option value="price-asc" className="bg-[#0c0c16]">Harga: Termurah</option>
                <option value="price-desc" className="bg-[#0c0c16]">Harga: Termahal</option>
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 text-[#9291ab] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'gradient-btn font-bold text-[#0a0a12] shadow-md shadow-[#7c5cff]/30'
                  : 'bg-white/[0.03] text-[#9291ab] hover:text-white hover:bg-white/[0.08] border border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Secondary Platform Chips */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-[#9291ab] pt-1">
          <span className="font-semibold text-white/70 flex items-center gap-1">
            <Filter className="w-3 h-3 text-[#00e0c6]" /> Platform OS:
          </span>
          {[
            { id: 'all', label: 'Semua OS' },
            { id: 'windows', label: 'Windows' },
            { id: 'mac', label: 'macOS' },
            { id: 'linux', label: 'Linux' },
            { id: 'web', label: 'Web Browser' }
          ].map((pf) => (
            <button
              key={pf.id}
              onClick={() => setSelectedPlatform(pf.id)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors ${
                selectedPlatform === pf.id
                  ? 'bg-[#00e0c6]/20 text-[#00e0c6] border border-[#00e0c6]/40 font-bold'
                  : 'bg-white/[0.02] text-[#9291ab] hover:text-white border border-white/5'
              }`}
            >
              {pf.label}
            </button>
          ))}

          {(selectedCategory !== 'Semua' || searchQuery || selectedPlatform !== 'all') && (
            <button
              onClick={resetFilters}
              className="text-[11px] text-[#ff4fd8] hover:underline ml-auto font-medium"
            >
              Reset Semua Filter
            </button>
          )}
        </div>
      </div>

      {/* Product Grid or Empty State */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-3xl bg-white/[0.02] border border-white/10 max-w-xl mx-auto space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-[#9291ab]">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-display font-bold text-lg text-white">
            Tidak ada software yang cocok
          </h3>
          <p className="text-xs text-[#9291ab] max-w-sm mx-auto leading-relaxed">
            Kata kunci "{searchQuery}" atau kombinasi filter saat ini tidak menemukan hasil. Coba gunakan kata kunci umum atau reset filter.
          </p>
          <button
            onClick={resetFilters}
            className="gradient-btn px-6 py-2.5 rounded-xl text-xs font-bold font-display inline-flex items-center gap-1.5"
          >
            Tampilkan Semua Software
          </button>
        </div>
      )}
    </div>
  );
};
