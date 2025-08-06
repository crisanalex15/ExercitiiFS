import { createContext, useContext, useReducer, useCallback, useEffect } from 'react';

/**
 * 🗄️ ADVANCED STATE MANAGEMENT PATTERNS
 * 
 * Pattern-uri avansate pentru gestionarea state-ului în aplicații React complexe
 */

// ================================
// 1. 🎯 COMPLEX REDUCER PATTERN
// ================================

// Action types cu namespace
const CAR_ACTIONS = {
  LOAD_CARS_START: 'cars/loadStart',
  LOAD_CARS_SUCCESS: 'cars/loadSuccess',
  LOAD_CARS_ERROR: 'cars/loadError',
  ADD_CAR: 'cars/add',
  UPDATE_CAR: 'cars/update',
  DELETE_CAR: 'cars/delete',
  FILTER_CARS: 'cars/filter',
  SORT_CARS: 'cars/sort',
  SELECT_CAR: 'cars/select',
  CLEAR_SELECTION: 'cars/clearSelection',
  SET_VIEW_MODE: 'cars/setViewMode'
};

// Initial state cu structură complexă
const initialCarState = {
  // Data state
  cars: [],
  selectedCars: [],
  
  // UI state
  loading: false,
  error: null,
  viewMode: 'grid', // 'grid' | 'list' | 'table'
  
  // Filter & Sort state
  filters: {
    brand: '',
    model: '',
    minYear: null,
    maxYear: null,
    priceRange: [0, 100000],
    transmission: '',
    fuelType: ''
  },
  
  sort: {
    field: 'brand',
    direction: 'asc' // 'asc' | 'desc'
  },
  
  // Pagination state
  pagination: {
    currentPage: 1,
    itemsPerPage: 12,
    totalItems: 0
  },
  
  // Cache și optimizations
  lastFetch: null,
  isDirty: false
};

// Reducer cu pattern-uri avansate
const carReducer = (state, action) => {
  switch (action.type) {
    case CAR_ACTIONS.LOAD_CARS_START:
      return {
        ...state,
        loading: true,
        error: null
      };

    case CAR_ACTIONS.LOAD_CARS_SUCCESS:
      return {
        ...state,
        loading: false,
        cars: action.payload.cars,
        pagination: {
          ...state.pagination,
          totalItems: action.payload.total
        },
        lastFetch: Date.now(),
        isDirty: false
      };

    case CAR_ACTIONS.LOAD_CARS_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload.error
      };

    case CAR_ACTIONS.ADD_CAR: {
      const newCar = { ...action.payload, id: Date.now() };
      return {
        ...state,
        cars: [...state.cars, newCar],
        isDirty: true
      };
    }

    case CAR_ACTIONS.UPDATE_CAR: {
      const updatedCars = state.cars.map(car =>
        car.id === action.payload.id 
          ? { ...car, ...action.payload.updates }
          : car
      );
      
      return {
        ...state,
        cars: updatedCars,
        isDirty: true
      };
    }

    case CAR_ACTIONS.DELETE_CAR: {
      const filteredCars = state.cars.filter(car => car.id !== action.payload.id);
      const updatedSelection = state.selectedCars.filter(id => id !== action.payload.id);
      
      return {
        ...state,
        cars: filteredCars,
        selectedCars: updatedSelection,
        isDirty: true
      };
    }

    case CAR_ACTIONS.FILTER_CARS:
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload
        },
        pagination: {
          ...state.pagination,
          currentPage: 1 // Reset pagination when filtering
        }
      };

    case CAR_ACTIONS.SORT_CARS: {
      const { field } = action.payload;
      const newDirection = 
        state.sort.field === field && state.sort.direction === 'asc' 
          ? 'desc' 
          : 'asc';
      
      return {
        ...state,
        sort: {
          field,
          direction: newDirection
        }
      };
    }

    case CAR_ACTIONS.SELECT_CAR: {
      const { carId, isMultiSelect } = action.payload;
      
      if (!isMultiSelect) {
        return {
          ...state,
          selectedCars: [carId]
        };
      }
      
      const isSelected = state.selectedCars.includes(carId);
      const newSelection = isSelected
        ? state.selectedCars.filter(id => id !== carId)
        : [...state.selectedCars, carId];
      
      return {
        ...state,
        selectedCars: newSelection
      };
    }

    case CAR_ACTIONS.CLEAR_SELECTION:
      return {
        ...state,
        selectedCars: []
      };

    case CAR_ACTIONS.SET_VIEW_MODE:
      return {
        ...state,
        viewMode: action.payload.mode
      };

    default:
      return state;
  }
};

// ================================
// 2. 🏪 CONTEXT + REDUCER PATTERN
// ================================

const CarContext = createContext();

export const CarProvider = ({ children }) => {
  const [state, dispatch] = useReducer(carReducer, initialCarState);

  // ================================
  // 3. 🎯 ACTION CREATORS
  // ================================
  
  const actions = {
    loadCars: useCallback(async (params = {}) => {
      dispatch({ type: CAR_ACTIONS.LOAD_CARS_START });
      
      try {
        // Simulare API call
        const response = await fetch('/api/cars?' + new URLSearchParams(params));
        const data = await response.json();
        
        dispatch({ 
          type: CAR_ACTIONS.LOAD_CARS_SUCCESS, 
          payload: { 
            cars: data.cars, 
            total: data.total 
          } 
        });
      } catch (error) {
        dispatch({ 
          type: CAR_ACTIONS.LOAD_CARS_ERROR, 
          payload: { error: error.message } 
        });
      }
    }, []),

    addCar: useCallback((car) => {
      dispatch({ type: CAR_ACTIONS.ADD_CAR, payload: car });
    }, []),

    updateCar: useCallback((id, updates) => {
      dispatch({ 
        type: CAR_ACTIONS.UPDATE_CAR, 
        payload: { id, updates } 
      });
    }, []),

    deleteCar: useCallback((id) => {
      dispatch({ type: CAR_ACTIONS.DELETE_CAR, payload: { id } });
    }, []),

    filterCars: useCallback((filters) => {
      dispatch({ type: CAR_ACTIONS.FILTER_CARS, payload: filters });
    }, []),

    sortCars: useCallback((field) => {
      dispatch({ type: CAR_ACTIONS.SORT_CARS, payload: { field } });
    }, []),

    selectCar: useCallback((carId, isMultiSelect = false) => {
      dispatch({ 
        type: CAR_ACTIONS.SELECT_CAR, 
        payload: { carId, isMultiSelect } 
      });
    }, []),

    clearSelection: useCallback(() => {
      dispatch({ type: CAR_ACTIONS.CLEAR_SELECTION });
    }, []),

    setViewMode: useCallback((mode) => {
      dispatch({ type: CAR_ACTIONS.SET_VIEW_MODE, payload: { mode } });
    }, [])
  };

  // ================================
  // 4. 🧮 COMPUTED VALUES (SELECTORS)
  // ================================
  
  const selectors = {
    // Filtered and sorted cars
    getFilteredCars: useCallback(() => {
      let filtered = state.cars;

      // Apply filters
      if (state.filters.brand) {
        filtered = filtered.filter(car => 
          car.brand.toLowerCase().includes(state.filters.brand.toLowerCase())
        );
      }

      if (state.filters.minYear) {
        filtered = filtered.filter(car => car.year >= state.filters.minYear);
      }

      if (state.filters.maxYear) {
        filtered = filtered.filter(car => car.year <= state.filters.maxYear);
      }

      // Apply sorting
      filtered.sort((a, b) => {
        const field = state.sort.field;
        const direction = state.sort.direction === 'asc' ? 1 : -1;
        
        if (typeof a[field] === 'string') {
          return a[field].localeCompare(b[field]) * direction;
        }
        
        return (a[field] - b[field]) * direction;
      });

      return filtered;
    }, [state.cars, state.filters, state.sort]),

    // Paginated cars
    getPaginatedCars: useCallback(() => {
      const filtered = selectors.getFilteredCars();
      const start = (state.pagination.currentPage - 1) * state.pagination.itemsPerPage;
      const end = start + state.pagination.itemsPerPage;
      
      return filtered.slice(start, end);
    }, [selectors.getFilteredCars, state.pagination]),

    // Selected car objects
    getSelectedCars: useCallback(() => {
      return state.cars.filter(car => state.selectedCars.includes(car.id));
    }, [state.cars, state.selectedCars]),

    // Statistics
    getStats: useCallback(() => {
      const filtered = selectors.getFilteredCars();
      
      return {
        total: state.cars.length,
        filtered: filtered.length,
        selected: state.selectedCars.length,
        avgPrice: filtered.reduce((sum, car) => sum + (car.price || 0), 0) / filtered.length || 0,
        brands: [...new Set(filtered.map(car => car.brand))].length
      };
    }, [state.cars, state.selectedCars, selectors.getFilteredCars])
  };

  // ================================
  // 5. 🔄 SIDE EFFECTS
  // ================================
  
  // Auto-save la modificări
  useEffect(() => {
    if (state.isDirty) {
      const timeoutId = setTimeout(() => {
        console.log('Auto-saving changes...');
        // Aici ai face API call pentru salvare
      }, 2000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [state.isDirty]);

  // Cache invalidation
  useEffect(() => {
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;
    
    if (state.lastFetch && (now - state.lastFetch) > fiveMinutes) {
      console.log('Cache expired, refetching...');
      actions.loadCars();
    }
  }, [state.lastFetch, actions.loadCars]);

  // Context value cu memoization
  const contextValue = {
    // State
    ...state,
    
    // Actions
    ...actions,
    
    // Selectors
    filteredCars: selectors.getFilteredCars(),
    paginatedCars: selectors.getPaginatedCars(),
    selectedCarObjects: selectors.getSelectedCars(),
    stats: selectors.getStats()
  };

  return (
    <CarContext.Provider value={contextValue}>
      {children}
    </CarContext.Provider>
  );
};

// ================================
// 6. 🎣 CUSTOM HOOK PENTRU CONTEXT
// ================================

export const useCars = () => {
  const context = useContext(CarContext);
  
  if (!context) {
    throw new Error('useCars must be used within CarProvider');
  }
  
  return context;
};

// ================================
// 7. 🎯 SPECIALIZED HOOKS
// ================================

export const useCarSelection = () => {
  const { selectedCars, selectCar, clearSelection, selectedCarObjects } = useCars();
  
  return {
    selectedCarIds: selectedCars,
    selectedCars: selectedCarObjects,
    selectCar,
    clearSelection,
    hasSelection: selectedCars.length > 0,
    selectionCount: selectedCars.length
  };
};

export const useCarFilters = () => {
  const { filters, filterCars, stats } = useCars();
  
  const setFilter = useCallback((key, value) => {
    filterCars({ [key]: value });
  }, [filterCars]);

  const clearFilters = useCallback(() => {
    filterCars({
      brand: '',
      model: '',
      minYear: null,
      maxYear: null,
      priceRange: [0, 100000],
      transmission: '',
      fuelType: ''
    });
  }, [filterCars]);

  return {
    filters,
    setFilter,
    clearFilters,
    hasActiveFilters: Object.values(filters).some(v => v && v !== '' && v !== 0),
    resultCount: stats.filtered
  };
};

export const useCarPagination = () => {
  const { pagination, dispatch } = useCars();
  
  const goToPage = useCallback((page) => {
    dispatch({ 
      type: 'cars/setPagination', 
      payload: { currentPage: page } 
    });
  }, [dispatch]);

  const setItemsPerPage = useCallback((items) => {
    dispatch({ 
      type: 'cars/setPagination', 
      payload: { itemsPerPage: items, currentPage: 1 } 
    });
  }, [dispatch]);

  return {
    ...pagination,
    goToPage,
    setItemsPerPage,
    totalPages: Math.ceil(pagination.totalItems / pagination.itemsPerPage)
  };
};

/*
// ================================
// 8. 💡 UTILIZARE ÎN COMPONENTE
// ================================

// În CarList.jsx:
const CarList = () => {
  const { 
    paginatedCars, 
    loading, 
    error, 
    viewMode, 
    setViewMode 
  } = useCars();
  
  const { 
    filters, 
    setFilter, 
    clearFilters, 
    hasActiveFilters 
  } = useCarFilters();
  
  const { 
    selectedCars, 
    selectCar, 
    hasSelection 
  } = useCarSelection();

  return (
    <div className="car-list">
      // UI components here
    </div>
  );
};

// În App.jsx:
function App() {
  return (
    <CarProvider>
      <CarList />
      <CarFilters />
      <CarStats />
    </CarProvider>
  );
}
*/
