'use client';

import { createContext, useContext, useState } from 'react';

export const defaultTheme = {
  backgroundColor: '#D9E4DD',
  textColor: '#000000',
  fontFamily: 'Poppins, sans-serif',
  cardColor: '#F6F8F5',
  primaryColor: '#2563eb',
    secondaryColor: '#9CB89D',
  chartColorsPayment: [
      '#A66C91', // muted pink
      '#B08CCC', // lavender
      '#F3A99F', // coral
      '#FDD49E', // peach
      '#60a5fa', // light blue
    ],
  chartColorsCategory: [
      '#66C2A5', // teal
      '#FC9272', // coral (moved to 2nd for contrast)
      '#9E9AC8', // lavender
      '#FCD34D', // yellow
      '#7DD3FC', // sky
      '#F472B6', // pink
      '#A3E635', // green
  ],
};

type ThemeType = typeof defaultTheme;

const ThemeContext = createContext<{
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}>({
  theme: defaultTheme,
  setTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState(defaultTheme);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div
        style={{
          backgroundColor: theme.backgroundColor,
          color: theme.textColor,
          fontFamily: theme.fontFamily,
          transition: 'all 0.3s ease',
          minHeight: '100vh',
        }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
};
