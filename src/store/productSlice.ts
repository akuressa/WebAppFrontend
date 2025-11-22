import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Product, ProductState } from '../types/product';
import { fetchProducts } from '../services/api';

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
  filters: {
    searchTerm: '',
    category: '',
    minPrice: null,
    maxPrice: null,
    sortBy: 'name',
  },
  pagination: {
    currentPage: 1,
    itemsPerPage: 15,
  },
};

export const getProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const products = await fetchProducts();
      return products;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch products'
      );
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setCategory: (state, action: PayloadAction<string>) => {
      state.filters.category = action.payload;
      state.pagination.currentPage = 1;
    },
    setPriceRange: (state, action: PayloadAction<{ min: number | null; max: number | null }>) => {
      state.filters.minPrice = action.payload.min;
      state.filters.maxPrice = action.payload.max;
      state.pagination.currentPage = 1;
    },
    setSortBy: (state, action: PayloadAction<'name' | 'price-low' | 'price-high' | 'rating'>) => {
      state.filters.sortBy = action.payload;
      state.pagination.currentPage = 1;
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.filters.searchTerm = action.payload;
      state.pagination.currentPage = 1;
    },
    clearFilters: (state) => {
      state.filters = {
        searchTerm: '',
        category: '',
        minPrice: null,
        maxPrice: null,
        sortBy: 'name',
      };
      state.pagination.currentPage = 1;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.loading = false;
        state.products = action.payload;
        state.error = null;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSearchTerm, setCategory, setPriceRange, setSortBy, clearFilters, setCurrentPage } = productSlice.actions;

export default productSlice.reducer;

