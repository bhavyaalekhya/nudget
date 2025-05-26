'use client';

import React from 'react';
import { useTheme } from '@/app/context/themecontext';

type ButtonProps = {
  lbl: string;
  click: () => void;
};

const Button: React.FC<ButtonProps> = ({ lbl, click }) => {
  const { theme } = useTheme();

  return (
    <button
      onClick={click}
      style={{
        color: theme.textColor,
        fontFamily: theme.fontFamily,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = theme.secondaryColor)}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = theme.primaryColor)}
      className="px-6 py-3 rounded-sm transition"
    >
      {lbl}
    </button>
  );
};

export default Button;
