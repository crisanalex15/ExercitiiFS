import React, { 
  useState, 
  useCallback, 
  useMemo, 
  createContext, 
  useContext,
  cloneElement,
  Children 
} from 'react';

/**
 * 🎨 REACT DESIGN PATTERNS COLLECTION
 * 
 * Demonstrații pentru pattern-urile React avansate
 */

// ================================
// 1. 🎭 RENDER PROPS PATTERN
// ================================
const DataFetcher = ({ url, render }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [url]);

  return render({ data, loading, error });
};

// Utilizare:
/*
<DataFetcher 
  url="/api/cars" 
  render={({ data, loading, error }) => {
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    return <CarList cars={data} />;
  }} 
/>
*/

// ================================
// 2. 🏗️ HIGHER-ORDER COMPONENT (HOC)
// ================================
const withLoading = (WrappedComponent) => {
  return function WithLoadingComponent({ isLoading, ...props }) {
    if (isLoading) {
      return (
        <div className="loading-wrapper">
          <div className="spinner">🔄 Loading...</div>
        </div>
      );
    }
    return <WrappedComponent {...props} />;
  };
};

const withErrorBoundary = (WrappedComponent) => {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
      return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
      console.error('Error caught by HOC:', error, errorInfo);
    }

    render() {
      if (this.state.hasError) {
        return (
          <div className="error-fallback">
            <h2>Oops! Something went wrong</h2>
            <pre>{this.state.error?.message}</pre>
            <button onClick={() => this.setState({ hasError: false, error: null })}>
              Try Again
            </button>
          </div>
        );
      }

      return <WrappedComponent {...this.props} />;
    }
  };
};

// Combinarea mai multor HOC-uri
const withEnhancements = (Component) => 
  withErrorBoundary(withLoading(Component));

// ================================
// 3. 🎪 FUNCTION AS CHILDREN PATTERN
// ================================
const MouseTracker = ({ children }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return children(mousePosition);
};

// Utilizare:
/*
<MouseTracker>
  {({ x, y }) => (
    <div>Mouse is at ({x}, {y})</div>
  )}
</MouseTracker>
*/

// ================================
// 4. 🎮 CONTROL PROPS PATTERN
// ================================
const ControlledCounter = ({ 
  value, 
  onChange, 
  min = 0, 
  max = Infinity,
  step = 1 
}) => {
  const increment = () => {
    if (value + step <= max) {
      onChange(value + step);
    }
  };

  const decrement = () => {
    if (value - step >= min) {
      onChange(value - step);
    }
  };

  return (
    <div className="controlled-counter">
      <button onClick={decrement} disabled={value <= min}>
        -
      </button>
      <span>{value}</span>
      <button onClick={increment} disabled={value >= max}>
        +
      </button>
    </div>
  );
};

// ================================
// 5. 🎯 CUSTOM HOOKS PATTERN PENTRU STATE LOGIC
// ================================
const useCounter = (initialValue = 0, { min = 0, max = Infinity, step = 1 } = {}) => {
  const [count, setCount] = useState(initialValue);

  const increment = useCallback(() => {
    setCount(prev => Math.min(prev + step, max));
  }, [step, max]);

  const decrement = useCallback(() => {
    setCount(prev => Math.max(prev - step, min));
  }, [step, min]);

  const reset = useCallback(() => {
    setCount(initialValue);
  }, [initialValue]);

  const setValue = useCallback((value) => {
    setCount(Math.max(min, Math.min(max, value)));
  }, [min, max]);

  return {
    count,
    increment,
    decrement,
    reset,
    setValue,
    canIncrement: count < max,
    canDecrement: count > min,
  };
};

// ================================
// 6. 🏪 PROVIDER PATTERN PENTRU STATE MANAGEMENT
// ================================
const CarManagerContext = createContext();

export const CarManagerProvider = ({ children }) => {
  const [selectedCars, setSelectedCars] = useState([]);
  const [filters, setFilters] = useState({
    brand: '',
    minYear: null,
    maxYear: null,
    priceRange: [0, 100000]
  });

  const selectCar = useCallback((car) => {
    setSelectedCars(prev => {
      if (prev.find(c => c.id === car.id)) {
        return prev.filter(c => c.id !== car.id);
      }
      return [...prev, car];
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedCars([]);
  }, []);

  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const value = useMemo(() => ({
    selectedCars,
    filters,
    selectCar,
    clearSelection,
    updateFilters,
    hasSelection: selectedCars.length > 0,
    selectionCount: selectedCars.length
  }), [selectedCars, filters, selectCar, clearSelection, updateFilters]);

  return (
    <CarManagerContext.Provider value={value}>
      {children}
    </CarManagerContext.Provider>
  );
};

export const useCarManager = () => {
  const context = useContext(CarManagerContext);
  if (!context) {
    throw new Error('useCarManager must be used within CarManagerProvider');
  }
  return context;
};

// ================================
// 7. 🎪 CHILDREN MANIPULATION PATTERN
// ================================
const EnhancedList = ({ children, spacing = 'md' }) => {
  const enhancedChildren = Children.map(children, (child, index) => {
    if (!React.isValidElement(child)) return child;

    return cloneElement(child, {
      key: child.key || index,
      className: `${child.props.className || ''} list-item spacing-${spacing}`,
      'data-index': index
    });
  });

  return <div className="enhanced-list">{enhancedChildren}</div>;
};

// ================================
// 8. 🔧 POLYMORPHIC COMPONENT PATTERN
// ================================
const Box = ({ 
  as: Component = 'div', 
  children, 
  variant = 'default',
  size = 'md',
  ...props 
}) => {
  const className = `box box--${variant} box--${size} ${props.className || ''}`;

  return (
    <Component {...props} className={className}>
      {children}
    </Component>
  );
};

// Utilizare:
/*
<Box as="button" variant="primary" onClick={handleClick}>
  Click me
</Box>

<Box as="section" variant="card" size="lg">
  <h2>Card content</h2>
</Box>
*/

// ================================
// 9. 🎨 COMPOUND COMPONENTS ADVANCED
// ================================
const Table = ({ children, ...props }) => {
  return (
    <table className="enhanced-table" {...props}>
      {children}
    </table>
  );
};

Table.Header = ({ children }) => (
  <thead className="table-header">{children}</thead>
);

Table.Body = ({ children }) => (
  <tbody className="table-body">{children}</tbody>
);

Table.Row = ({ children, selected = false, ...props }) => (
  <tr className={`table-row ${selected ? 'selected' : ''}`} {...props}>
    {children}
  </tr>
);

Table.Cell = ({ children, header = false, ...props }) => {
  const Component = header ? 'th' : 'td';
  return (
    <Component className="table-cell" {...props}>
      {children}
    </Component>
  );
};

// ================================
// 10. 📋 EXEMPLO DE UTILIZARE ÎN CARLIST
// ================================

// Componenta CarList îmbunătățită cu pattern-uri
const EnhancedCarList = () => {
  const { cars, loading, error } = useCars();
  const { increment, decrement, count, reset } = useCounter(0, { min: 0, max: 10 });
  const { selectedCars, selectCar } = useCarManager();

  return (
    <DataFetcher 
      url="/api/cars"
      render={({ data: cars, loading, error }) => (
        <MouseTracker>
          {({ x, y }) => (
            <div>
              <div>Mouse: ({x}, {y})</div>
              
              <ControlledCounter 
                value={count}
                onChange={setValue}
                min={0}
                max={cars?.length || 0}
              />

              <Table>
                <Table.Header>
                  <Table.Row>
                    <Table.Cell header>Brand</Table.Cell>
                    <Table.Cell header>Model</Table.Cell>
                    <Table.Cell header>Year</Table.Cell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {cars?.slice(0, count).map(car => (
                    <Table.Row 
                      key={car.id}
                      selected={selectedCars.includes(car)}
                      onClick={() => selectCar(car)}
                    >
                      <Table.Cell>{car.brand}</Table.Cell>
                      <Table.Cell>{car.model}</Table.Cell>
                      <Table.Cell>{car.year}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>
          )}
        </MouseTracker>
      )}
    />
  );
};

export {
  DataFetcher,
  withLoading,
  withErrorBoundary,
  withEnhancements,
  MouseTracker,
  ControlledCounter,
  useCounter,
  EnhancedList,
  Box,
  Table,
  EnhancedCarList
};
