import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * 🎣 ADVANCED CUSTOM HOOKS COLLECTION
 * 
 * Hook-uri avansate pentru funcționalități comune în aplicații React
 */

// 1. 🔍 Hook pentru debounced search
export const useDebounce = (value, delay) => {
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

// 2. 📱 Hook pentru responsive design
export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
};

// 3. 🔄 Hook pentru async operations cu loading/error states
export const useAsync = (asyncFunction, immediate = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);

    try {
      const result = await asyncFunction(...args);
      
      if (mountedRef.current) {
        setData(result);
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err);
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [asyncFunction]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return { data, loading, error, execute };
};

// 4. 💾 Hook pentru localStorage cu sync
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
      
      // Trigger storage event for cross-tab sync
      window.dispatchEvent(new Event('localStorage'));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Listen for storage changes from other tabs
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const item = window.localStorage.getItem(key);
        if (item) {
          setStoredValue(JSON.parse(item));
        }
      } catch (error) {
        console.error(`Error syncing localStorage key "${key}":`, error);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('localStorage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorage', handleStorageChange);
    };
  }, [key]);

  return [storedValue, setValue];
};

// 5. 🎯 Hook pentru intersection observer (lazy loading, infinite scroll)
export const useIntersectionObserver = (options = {}) => {
  const [entry, setEntry] = useState(null);
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setEntry(entry);
    }, options);

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [options]);

  return [elementRef, entry];
};

// 6. ⚡ Hook pentru optimistic updates
export const useOptimisticUpdate = (queryKey, mutationFn) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onMutate: async (newData) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData(queryKey);

      // Optimistically update to the new value
      queryClient.setQueryData(queryKey, (old) => {
        // Update logic based on your data structure
        return Array.isArray(old) 
          ? [...old, { ...newData, id: Date.now() }]
          : newData;
      });

      // Return a context object with the snapshotted value
      return { previousData };
    },
    onError: (err, newData, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      queryClient.setQueryData(queryKey, context.previousData);
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey });
    },
  });
};

// 7. 📊 Hook pentru form validation
export const useFormValidation = (initialValues, validationRules) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validate = useCallback((fieldName, value) => {
    const rule = validationRules[fieldName];
    if (!rule) return '';

    if (rule.required && (!value || value.toString().trim() === '')) {
      return rule.message || `${fieldName} is required`;
    }

    if (rule.minLength && value.length < rule.minLength) {
      return rule.message || `${fieldName} must be at least ${rule.minLength} characters`;
    }

    if (rule.pattern && !rule.pattern.test(value)) {
      return rule.message || `${fieldName} format is invalid`;
    }

    if (rule.custom && !rule.custom(value)) {
      return rule.message || `${fieldName} is invalid`;
    }

    return '';
  }, [validationRules]);

  const handleChange = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    if (touched[name]) {
      const error = validate(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  }, [touched, validate]);

  const handleBlur = useCallback((name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validate(name, values[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  }, [validate, values]);

  const isValid = Object.values(errors).every(error => !error);

  return {
    values,
    errors,
    touched,
    isValid,
    handleChange,
    handleBlur,
    setValues,
    setErrors
  };
};

// Utilizare în CarList.jsx:
/*
// Pentru search debouncing
const debouncedFilter = useDebounce(filterBy, 300);

// Pentru responsive design
const isMobile = useMediaQuery('(max-width: 768px)');

// Pentru form validation în CreateCar
const formValidation = useFormValidation(initialValues, {
  brand: { required: true, minLength: 2, message: 'Brand must be at least 2 characters' },
  model: { required: true, minLength: 1 },
  year: { 
    required: true, 
    custom: (value) => value >= 1900 && value <= new Date().getFullYear(),
    message: 'Year must be between 1900 and current year'
  }
});
*/
