import React, {
  useState,
  useEffect,
  useContext,
  useMemo,
  useCallback,
  useRef,
  useReducer,
} from "react";
import { useTheme } from "../context/ThemeContext";
import "./HooksDemo.scss";

/**
 * 🎣 REACT HOOKS LEARNING CENTER
 *
 * Pagină educațională interactivă pentru demonstrarea tuturor hook-urilor React
 * Fiecare hook vine cu explicații detaliate și exemple practice
 */

// REDUCER pentru demonstrația useReducer
const countReducer = (state, action) => {
  switch (action.type) {
    case "INCREMENT":
      return { count: state.count + 1, lastAction: "increment" };
    case "DECREMENT":
      return { count: state.count - 1, lastAction: "decrement" };
    case "MULTIPLY":
      return {
        count: state.count * action.payload,
        lastAction: `multiply by ${action.payload}`,
      };
    case "RESET":
      return { count: 0, lastAction: "reset" };
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
};

// FUNCȚIE costisitoare pentru demonstrația useMemo
const expensiveCalculation = (number) => {
  console.log("🔄 Executing expensive calculation...");
  let result = 0;
  for (let i = 0; i < number * 1000000; i++) {
    result += i;
  }
  return result;
};

const HooksDemo = () => {
  // ====================================
  // 1. 🎯 useState DEMONSTRATIONS
  // ====================================
  const [counter, setCounter] = useState(0);
  const [name, setName] = useState("");
  const [isToggled, setIsToggled] = useState(false);
  const [todos, setTodos] = useState([
    { id: 1, text: "Learn useState", completed: false },
    { id: 2, text: "Master useEffect", completed: true },
  ]);

  // ====================================
  // 2. ⚡ useEffect DEMONSTRATIONS
  // ====================================
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [fetchedData, setFetchedData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Effect pentru window resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    // Cleanup function
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty dependency array - rulează o dată

  // Effect pentru fetch simulation
  useEffect(() => {
    if (counter > 5) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setFetchedData(`Data fetched for counter: ${counter}`);
        setIsLoading(false);
      }, 1000);

      return () => clearTimeout(timer); // Cleanup
    }
  }, [counter]); // Depends on counter

  // ====================================
  // 3. 🌐 useContext DEMONSTRATION
  // ====================================
  const { theme, toggleTheme, isDark } = useTheme();

  // ====================================
  // 4. 🧠 useMemo DEMONSTRATION
  // ====================================
  const [memoNumber, setMemoNumber] = useState(1);
  const [rerenderTrigger, setRerenderTrigger] = useState(0);

  const memoizedValue = useMemo(() => {
    return expensiveCalculation(memoNumber);
  }, [memoNumber]); // Only recalculates when memoNumber changes

  // ====================================
  // 5. 🔄 useCallback DEMONSTRATION
  // ====================================
  const [callbackCount, setCallbackCount] = useState(0);
  const [otherState, setOtherState] = useState(0);

  const incrementCallback = useCallback(() => {
    setCallbackCount((prev) => prev + 1);
  }, []); // Empty dependencies - function never changes

  const complexCallback = useCallback(() => {
    setCallbackCount((prev) => prev + otherState);
  }, [otherState]); // Only recreates when otherState changes

  // ====================================
  // 6. 📎 useRef DEMONSTRATIONS
  // ====================================
  const inputRef = useRef(null);
  const renderCount = useRef(0);
  const previousCounter = useRef(counter);

  // Track render count
  renderCount.current += 1;

  // Store previous value
  useEffect(() => {
    previousCounter.current = counter;
  });

  const focusInput = () => {
    inputRef.current.focus();
  };

  // ====================================
  // 7. 🗄️ useReducer DEMONSTRATION
  // ====================================
  const [state, dispatch] = useReducer(countReducer, {
    count: 0,
    lastAction: "initialized",
  });

  // ====================================
  // HELPER FUNCTIONS
  // ====================================
  const addTodo = () => {
    if (name.trim()) {
      setTodos([...todos, { id: Date.now(), text: name, completed: false }]);
      setName("");
    }
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  return (
    <div className="hooks-demo">
      <div className="hooks-demo__header">
        <h1>🎣 React Hooks Learning Center</h1>
        <p>Demonstrații interactive pentru toate hook-urile React populare</p>
      </div>

      <div className="hooks-grid">
        {/* ========== useState SECTION ========== */}
        <div className="hook-card">
          <div className="hook-header">
            <h2>🎯 useState</h2>
            <span className="hook-type">State Hook</span>
          </div>

          <div className="hook-explanation">
            <p>
              <strong>Ce face:</strong> Gestionează state-ul local al
              componentei
            </p>
            <p>
              <strong>Când să folosești:</strong> Pentru valori care se schimbă
              și influențează UI-ul
            </p>
            <code>const [state, setState] = useState(initialValue)</code>
          </div>

          <div className="demo-section">
            <h3>🔢 Counter Demo</h3>
            <div className="demo-controls">
              <button onClick={() => setCounter(counter - 1)}>-</button>
              <span className="counter-display">{counter}</span>
              <button onClick={() => setCounter(counter + 1)}>+</button>
            </div>
            <p>
              Counter value: <strong>{counter}</strong>
            </p>

            <h3>📝 Input Demo</h3>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Type your name..."
            />
            <p>
              Hello, <strong>{name || "Anonymous"}</strong>!
            </p>

            <h3>🔄 Toggle Demo</h3>
            <button onClick={() => setIsToggled(!isToggled)}>
              {isToggled ? "🌟 ON" : "⭕ OFF"}
            </button>

            <h3>📋 Todo List Demo</h3>
            <div className="todo-input">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Add new todo..."
                onKeyDown={(e) => e.key === "Enter" && addTodo()}
              />
              <button onClick={addTodo}>Add</button>
            </div>
            <ul className="todo-list">
              {todos.map((todo) => (
                <li key={todo.id} className={todo.completed ? "completed" : ""}>
                  <label>
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id)}
                    />
                    {todo.text}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ========== useEffect SECTION ========== */}
        <div className="hook-card">
          <div className="hook-header">
            <h2>⚡ useEffect</h2>
            <span className="hook-type">Effect Hook</span>
          </div>

          <div className="hook-explanation">
            <p>
              <strong>Ce face:</strong> Gestionează side effects (API calls,
              subscriptions, DOM updates)
            </p>
            <p>
              <strong>Când să folosești:</strong> Pentru operații care "ies din"
              componenta (fetch, timers, etc.)
            </p>
            <code>useEffect(() =&gt; {"{/* effect */"}, [dependencies])</code>
          </div>

          <div className="demo-section">
            <h3>📏 Window Resize Listener</h3>
            <p>
              Window width: <strong>{windowWidth}px</strong>
            </p>
            <small>Resize browser window to see live updates</small>

            <h3>🔄 Conditional Data Fetching</h3>
            <p>Counter: {counter} (increment above 5 to trigger fetch)</p>
            {isLoading && <p>🔄 Loading data...</p>}
            {fetchedData && <p>📦 {fetchedData}</p>}

            <h3>📊 Effect Dependencies</h3>
            <div className="effect-types">
              <div className="effect-example">
                <strong>[] Empty array:</strong> Runs once on mount
              </div>
              <div className="effect-example">
                <strong>[counter]:</strong> Runs when counter changes
              </div>
              <div className="effect-example">
                <strong>No array:</strong> Runs on every render
              </div>
            </div>
          </div>
        </div>

        {/* ========== useContext SECTION ========== */}
        <div className="hook-card">
          <div className="hook-header">
            <h2>🌐 useContext</h2>
            <span className="hook-type">Context Hook</span>
          </div>

          <div className="hook-explanation">
            <p>
              <strong>Ce face:</strong> Accesează valori din React Context fără
              prop drilling
            </p>
            <p>
              <strong>Când să folosești:</strong> Pentru state global (theme,
              user, language)
            </p>
            <code>const value = useContext(MyContext)</code>
          </div>

          <div className="demo-section">
            <h3>🌓 Theme Context Demo</h3>
            <p>
              Current theme: <strong>{theme}</strong>
            </p>
            <p>
              Is dark mode: <strong>{isDark ? "Yes" : "No"}</strong>
            </p>
            <button onClick={toggleTheme}>
              Switch to {isDark ? "Light" : "Dark"} Mode
            </button>
            <div className="context-explanation">
              <p>
                ☝️ Acest buton folosește useContext să acceseze tema globală
                fără să trebuiască să primească props de la parent!
              </p>
            </div>
          </div>
        </div>

        {/* ========== useMemo SECTION ========== */}
        <div className="hook-card">
          <div className="hook-header">
            <h2>🧠 useMemo</h2>
            <span className="hook-type">Performance Hook</span>
          </div>

          <div className="hook-explanation">
            <p>
              <strong>Ce face:</strong> Memoizează rezultatul unei calculații
              costisitoare
            </p>
            <p>
              <strong>Când să folosești:</strong> Pentru calculații scumpe care
              nu trebuie refăcute la fiecare render
            </p>
            <code>
              const memoizedValue = useMemo(() =&gt; calculation, [deps])
            </code>
          </div>

          <div className="demo-section">
            <h3>💰 Expensive Calculation Demo</h3>
            <div className="demo-controls">
              <label>
                Number for calculation:
                <input
                  type="number"
                  value={memoNumber}
                  onChange={(e) => setMemoNumber(Number(e.target.value))}
                  min="1"
                  max="100"
                />
              </label>
            </div>
            <p>
              Memoized result: <strong>{memoizedValue}</strong>
            </p>

            <button onClick={() => setRerenderTrigger((prev) => prev + 1)}>
              Force Re-render (Trigger: {rerenderTrigger})
            </button>

            <div className="memo-explanation">
              <p>🔍 Deschide Console să vezi când se execută calculația!</p>
              <p>
                ✨ useMemo recalculează doar când 'memoNumber' se schimbă, nu la
                fiecare re-render!
              </p>
            </div>
          </div>
        </div>

        {/* ========== useCallback SECTION ========== */}
        <div className="hook-card">
          <div className="hook-header">
            <h2>🔄 useCallback</h2>
            <span className="hook-type">Performance Hook</span>
          </div>

          <div className="hook-explanation">
            <p>
              <strong>Ce face:</strong> Memoizează o funcție pentru a preveni
              recrearea ei
            </p>
            <p>
              <strong>Când să folosești:</strong> Pentru funcții pasate ca props
              la componente memo-izate
            </p>
            <code>
              const memoizedFn = useCallback(() =&gt; {"{/* fn */"}, [deps])
            </code>
          </div>

          <div className="demo-section">
            <h3>🎯 Function Memoization Demo</h3>
            <p>
              Callback Count: <strong>{callbackCount}</strong>
            </p>
            <p>
              Other State: <strong>{otherState}</strong>
            </p>

            <div className="demo-controls">
              <button onClick={incrementCallback}>
                Simple Increment (useCallback with [])
              </button>
              <button onClick={complexCallback}>
                Add Other State (useCallback with [otherState])
              </button>
              <button onClick={() => setOtherState((prev) => prev + 1)}>
                Change Other State: {otherState}
              </button>
            </div>

            <div className="callback-explanation">
              <p>
                🎯 <code>incrementCallback</code> nu se recreează niciodată ([]
                dependencies)
              </p>
              <p>
                🔄 <code>complexCallback</code> se recreează doar când{" "}
                <code>otherState</code> se schimbă
              </p>
            </div>
          </div>
        </div>

        {/* ========== useRef SECTION ========== */}
        <div className="hook-card">
          <div className="hook-header">
            <h2>📎 useRef</h2>
            <span className="hook-type">Ref Hook</span>
          </div>

          <div className="hook-explanation">
            <p>
              <strong>Ce face:</strong> Creează o referință care persistă între
              render-uri
            </p>
            <p>
              <strong>Când să folosești:</strong> Pentru DOM access, storing
              previous values, counters
            </p>
            <code>const ref = useRef(initialValue)</code>
          </div>

          <div className="demo-section">
            <h3>🎯 DOM Access Demo</h3>
            <input
              ref={inputRef}
              type="text"
              placeholder="Click button to focus me"
            />
            <button onClick={focusInput}>Focus Input</button>

            <h3>📊 Render Counter Demo</h3>
            <p>
              Component has rendered <strong>{renderCount.current}</strong>{" "}
              times
            </p>
            <p>
              Previous counter value: <strong>{previousCounter.current}</strong>
            </p>
            <p>
              Current counter value: <strong>{counter}</strong>
            </p>

            <div className="ref-explanation">
              <p>🔄 useRef nu cauzează re-render când se schimbă</p>
              <p>💾 Valorile persistă între render-uri</p>
              <p>🎯 Perfect pentru DOM references și valori "de fundal"</p>
            </div>
          </div>
        </div>

        {/* ========== useReducer SECTION ========== */}
        <div className="hook-card">
          <div className="hook-header">
            <h2>🗄️ useReducer</h2>
            <span className="hook-type">State Hook</span>
          </div>

          <div className="hook-explanation">
            <p>
              <strong>Ce face:</strong> Gestionează state complex cu reducer
              pattern
            </p>
            <p>
              <strong>Când să folosești:</strong> Pentru state complex cu multe
              acțiuni sau logică intricate
            </p>
            <code>
              const [state, dispatch] = useReducer(reducer, initialState)
            </code>
          </div>

          <div className="demo-section">
            <h3>🎮 Complex State Management</h3>
            <p>
              Count: <strong>{state.count}</strong>
            </p>
            <p>
              Last Action: <strong>{state.lastAction}</strong>
            </p>

            <div className="demo-controls">
              <button onClick={() => dispatch({ type: "INCREMENT" })}>
                +1 Increment
              </button>
              <button onClick={() => dispatch({ type: "DECREMENT" })}>
                -1 Decrement
              </button>
              <button
                onClick={() => dispatch({ type: "MULTIPLY", payload: 2 })}
              >
                ×2 Multiply
              </button>
              <button
                onClick={() => dispatch({ type: "MULTIPLY", payload: 5 })}
              >
                ×5 Multiply
              </button>
              <button onClick={() => dispatch({ type: "RESET" })}>
                🔄 Reset
              </button>
            </div>

            <div className="reducer-explanation">
              <p>🎯 useReducer este ideal pentru state cu multe acțiuni</p>
              <p>📋 Reducer-ul centralizează toată logica de update</p>
              <p>🔄 Predictabil și ușor de testat</p>
            </div>
          </div>
        </div>
      </div>

      {/* ========== SUMMARY SECTION ========== */}
      <div className="hooks-summary">
        <h2>📚 Rezumat Hook-uri React</h2>
        <div className="summary-grid">
          <div className="summary-item">
            <strong>useState</strong> - State local simplu
          </div>
          <div className="summary-item">
            <strong>useEffect</strong> - Side effects și cleanup
          </div>
          <div className="summary-item">
            <strong>useContext</strong> - Access la state global
          </div>
          <div className="summary-item">
            <strong>useMemo</strong> - Memoizare calculații
          </div>
          <div className="summary-item">
            <strong>useCallback</strong> - Memoizare funcții
          </div>
          <div className="summary-item">
            <strong>useRef</strong> - Referințe și DOM access
          </div>
          <div className="summary-item">
            <strong>useReducer</strong> - State complex cu reducer
          </div>
        </div>
      </div>
    </div>
  );
};

export default HooksDemo;
