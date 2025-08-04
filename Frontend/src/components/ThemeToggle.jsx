import React from "react";
import { useTheme } from "../context/ThemeContext";
import "./ThemeToggle.scss";

/**
 * 🌓 THEME TOGGLE COMPONENT
 *
 * Componenta pentru schimbarea între light și dark mode
 * Demonstrează utilizarea useContext prin custom hook-ul useTheme
 */
const ThemeToggle = () => {
  const { theme, toggleTheme, isDark, isLight } = useTheme();

  return (
    <button
      className={`theme-toggle ${
        isDark ? "theme-toggle--dark" : "theme-toggle--light"
      }`}
      onClick={toggleTheme}
      title={`Comută la tema ${isDark ? "deschisă" : "întunecată"}`}
      aria-label={`Comută la tema ${isDark ? "deschisă" : "întunecată"}`}
    >
      {/* ICON CONTAINER cu animații */}
      <div className="theme-toggle__icon-container">
        {/* SUN ICON - pentru light mode */}
        <div
          className={`theme-toggle__icon theme-toggle__sun ${
            isLight ? "active" : ""
          }`}
        >
          ☀️
        </div>

        {/* MOON ICON - pentru dark mode */}
        <div
          className={`theme-toggle__icon theme-toggle__moon ${
            isDark ? "active" : ""
          }`}
        >
          🌙
        </div>
      </div>

      {/* INDICATOR SLIDER */}
      <div className="theme-toggle__slider">
        <div className="theme-toggle__slider-thumb"></div>
      </div>

      {/* LABEL TEXT (opțional) */}
      <span className="theme-toggle__label">{isDark ? "Dark" : "Light"}</span>
    </button>
  );
};

/**
 * 📚 CONCEPTE IMPORTANTE demonstrare în această componentă:
 *
 * 1. CUSTOM HOOK USAGE:
 *    - useTheme() returnează { theme, toggleTheme, isDark, isLight }
 *    - Nu mai trebuie să facem useContext(ThemeContext) manual
 *    - Clean și reutilizabil în orice componentă
 *
 * 2. CONDITIONAL RENDERING & STYLING:
 *    - Clase CSS conditional: `${isDark ? 'dark' : 'light'}`
 *    - Template literals pentru clase dinamice
 *    - Boolean props pentru activarea elementelor
 *
 * 3. ACCESSIBILITY (a11y):
 *    - aria-label pentru screen readers
 *    - title pentru tooltip
 *    - Semantic button element
 *
 * 4. STATE-DRIVEN UI:
 *    - UI-ul reflectă automat starea din context
 *    - Schimbările sunt reactive (Re-render automat)
 *    - Separarea logicii de business de prezentare
 *
 * 5. CSS COMPOSITION:
 *    - Clase BEM pentru organizare
 *    - Modifier classes pentru state-uri
 *    - CSS custom properties integration
 */

export default ThemeToggle;
