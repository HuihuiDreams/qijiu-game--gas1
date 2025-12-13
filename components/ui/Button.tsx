import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', className = '', children, ...props }) => {
  // Wuxia style: Serif font, stone/jade colors
  const baseStyles = "px-8 py-2 border transition-all duration-500 font-serif tracking-widest active:scale-95 text-lg relative overflow-hidden group";
  
  const variants = {
    // Ink & Jade style
    primary: "bg-stone-900/80 hover:bg-emerald-900/50 text-emerald-100 border-stone-600 hover:border-emerald-500/50 shadow-[0_0_15px_rgba(0,0,0,0.5)] backdrop-blur-sm",
    // Paper style
    secondary: "bg-stone-800/50 hover:bg-stone-700/50 text-stone-200 border-stone-700 hover:border-stone-500",
    // Transparent
    ghost: "bg-transparent hover:bg-white/5 text-stone-400 hover:text-stone-200 border-transparent"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};