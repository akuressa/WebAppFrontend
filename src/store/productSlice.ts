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
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.filters.searchTerm = action.payload;
    },
    setCategory: (state, action: PayloadAction<string>) => {
      state.filters.category = action.payload;
    },
    setPriceRange: (state, action: PayloadAction<{ min: number | null; max: number | null }>) => {
      state.filters.minPrice = action.payload.min;
      state.filters.maxPrice = action.payload.max;
    },
    setSortBy: (state, action: PayloadAction<'name' | 'price-low' | 'price-high' | 'rating'>) => {
      state.filters.sortBy = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {
        searchTerm: '',
        category: '',
        minPrice: null,
        maxPrice: null,
        sortBy: 'name',
      };
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

export const { setSearchTerm, setCategory, setPriceRange, setSortBy, clearFilters } = productSlice.actions;

export default productSlice.reducer;

