import React, { createContext, useContext, useState, useEffect } from "react";

// 1. CREEZ CONTEXT-UL
const ThemeContext = createContext();

// 2. CUSTOM HOOK pentru ușurința utilizării
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme trebuie folosit în interiorul ThemeProvider");
  }
  return context;
};

// 3. PROVIDER COMPONENT
export const ThemeProvider = ({ children }) => {
  // HELPER FUNCTION pentru detectarea temei inițiale
  const getInitialTheme = () => {
    // 1. Încearcă să încarce din localStorage
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme && (savedTheme === "light" || savedTheme === "dark")) {
      return savedTheme;
    }

    // 2. Detectează preferința sistemului utilizatorului
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    return prefersDark ? "dark" : "light";
  };

  // State cu tema corectă de la început
  const [theme, setTheme] = useState(getInitialTheme);
  const [isInitialized, setIsInitialized] = useState(false);

  // INIȚIALIZAREA - aplicăm tema și marcăm ca inițializat
  useEffect(() => {
    // Aplicăm tema pe documentul HTML
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.className =
      theme === "dark" ? "dark-theme" : "light-theme";

    // Marcăm ca inițializat
    setIsInitialized(true);
  }, []); // Rulează o singură dată

  // PERSISTENȚA - salvează doar după inițializare
  useEffect(() => {
    if (isInitialized) {
      // Salvează în localStorage doar după inițializare
      localStorage.setItem("theme", theme);

      // Aplicăm tema pe documentul HTML
      document.documentElement.setAttribute("data-theme", theme);
      document.documentElement.className =
        theme === "dark" ? "dark-theme" : "light-theme";

      console.log(`🎨 Tema schimbată la: ${theme}`); // Debug helper
    }
  }, [theme, isInitialized]); // Rulează când tema se schimbă

  // BONUS: DETECTAREA SCHIMBĂRILOR SISTEMULUI în timp real
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleSystemThemeChange = (e) => {
      // Schimbă tema doar dacă nu avem preferință salvată
      const savedTheme = localStorage.getItem("theme");
      if (!savedTheme) {
        const newTheme = e.matches ? "dark" : "light";
        console.log(`🔄 Sistemul a schimbat tema la: ${newTheme}`);
        setTheme(newTheme);
      }
    };

    // Adăugă listener pentru schimbări
    mediaQuery.addEventListener("change", handleSystemThemeChange);

    // Cleanup la unmount
    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, []);

  // FUNCȚIA de toggle între teme
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  // FUNCȚIA pentru setarea unei teme specifice
  const setSpecificTheme = (newTheme) => {
    if (newTheme === "light" || newTheme === "dark") {
      setTheme(newTheme);
    }
  };

  // FUNCȚIA pentru resetarea la preferințele sistemului
  const resetToSystemTheme = () => {
    // Șterge preferința salvată
    localStorage.removeItem("theme");

    // Detectează și aplică tema sistemului
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const systemTheme = prefersDark ? "dark" : "light";

    console.log(`🔄 Reset la tema sistemului: ${systemTheme}`);
    setTheme(systemTheme);
  };

  // VALOAREA pe care o oferă Context-ul
  const value = {
    theme, // tema curentă: 'light' | 'dark'
    toggleTheme, // funcția de toggle
    setTheme: setSpecificTheme, // funcția pentru setare specifică
    resetToSystemTheme, // funcția pentru reset la tema sistemului
    isDark: theme === "dark", // boolean convenience
    isLight: theme === "light", // boolean convenience
    isInitialized, // boolean pentru loading state
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

// 4. EXPORT default pentru Provider
export default ThemeProvider;

/*
📚 EXPLICAȚIE CONCEPTE:

1. createContext() - Creează un "canal de comunicare" global
   - Permite transmiterea datelor fără "prop drilling"
   - Componentele pot accesa datele de oriunde din arbore

2. useContext() - Hook pentru consumarea Context-ului
   - Alternativă la <Context.Consumer>
   - Mai clean și mai ușor de folosit

3. Custom Hook Pattern - useTheme()
   - Încapsulează logica de utilizare a Context-ului
   - Oferă type safety și error handling
   - Mai ușor de folosit decât useContext(ThemeContext)

4. localStorage - Pentru persistența preferințelor
   - Păstrează setarea și după refresh/restart browser
   - Sincronizare între tab-uri

5. data-attribute - Pentru aplicarea temei în CSS
   - document.documentElement.setAttribute('data-theme', theme)
   - Permite CSS selectori: [data-theme="dark"] { ... }
*/
