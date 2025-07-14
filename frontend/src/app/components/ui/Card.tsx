'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const Card = ({
  children,
  className = '',
  onClick,
  hoverable = false,
  padding = 'md',
}: CardProps) => {
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-8',
  };

  const baseClasses = 'bg-white rounded-lg shadow-md overflow-hidden';
  const hoverClasses = hoverable ? 'cursor-pointer transition-all duration-200 hover:shadow-lg' : '';
  const paddingClass = paddingClasses[padding];
  
  const cardClasses = `${baseClasses} ${hoverClasses} ${paddingClass} ${className}`;

  if (onClick) {
    return (
      <motion.div
        className={cardClasses}
        onClick={onClick}
        whileHover={hoverable ? { scale: 1.02 } : {}}
        whileTap={hoverable ? { scale: 0.98 } : {}}
      >
        {children}
      </motion.div>
    );
  }

  return <div className={cardClasses}>{children}</div>;
};

export default Card;