import React from 'react';
import * as LucideIcons from 'lucide-react';

interface CategoryIconProps {
  name: string;
  className?: string;
  color?: string;
  size?: number;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({
  name,
  className = 'w-5 h-5',
  color,
  size
}) => {
  // @ts-ignore
  const IconComponent = (LucideIcons as any)[name] || LucideIcons.Tag;

  return (
    <IconComponent
      className={className}
      style={{ color: color }}
      size={size}
    />
  );
};
