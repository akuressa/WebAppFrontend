import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './store';
import { Product } from '../types/product';

export const selectAllProducts = (state: RootState) => state.products.products;
export const selectFilters = (state: RootState) => state.products.filters;

export const selectFilteredAndSortedProducts = createSelector(
  [selectAllProducts, selectFilters],
  (products: Product[], filters) => {
    let filtered = [...products];

    // Filter by search term
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.title.toLowerCase().includes(searchLower) ||
          product.category.toLowerCase().includes(searchLower)
      );
    }

    // Filter by category
    if (filters.category) {
      filtered = filtered.filter((product) => product.category === filters.category);
    }

    // Filter by price range
    if (filters.minPrice !== null) {
      filtered = filtered.filter((product) => product.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== null) {
      filtered = filtered.filter((product) => product.price <= filters.maxPrice!);
    }

    // Sort products
    switch (filters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating.rate - a.rating.rate);
        break;
      case 'name':
      default:
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    return filtered;
  }
);

export const selectUniqueCategories = createSelector([selectAllProducts], (products: Product[]) => {
  const categories = new Set(products.map((product) => product.category));
  return Array.from(categories).sort();
});

export const selectPriceRange = createSelector([selectAllProducts], (products: Product[]) => {
  if (products.length === 0) return { min: 0, max: 0 };
  const prices = products.map((product) => product.price);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };
});

