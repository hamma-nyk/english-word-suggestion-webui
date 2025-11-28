import React, { createContext, useEffect, useState, useContext } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // Load initial theme from localStorage (no flicker)
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("theme") as Theme) || "light";
    }
    return "light";
  });

  // Apply initial theme immediately (no animation on first paint)
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, []); // run once

  // When theme changes, trigger synchronized transition
  useEffect(() => {
    const html = document.documentElement;

    // 1) add transition helper class first
    html.classList.add("theme-transition");

    // 2) wait one frame so the browser registers the transition class
    requestAnimationFrame(() => {
      // toggle dark class in next paint/frame
      html.classList.toggle("dark", theme === "dark");
      localStorage.setItem("theme", theme);
    });

    // 3) remove transition helper after duration (slightly above CSS duration)
    const cleanup = window.setTimeout(() => {
      html.classList.remove("theme-transition");
    }, 420); // match/just above CSS 350ms

    return () => {
      clearTimeout(cleanup);
      // guard: remove class if unmounted early
      html.classList.remove("theme-transition");
    };
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
