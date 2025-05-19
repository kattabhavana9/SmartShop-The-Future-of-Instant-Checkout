import React from 'react';
import { Link } from 'react-router-dom';
import { Category } from '../../types/product';

interface CategoryCardProps {
  category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <Link 
      to={`/products?category=${encodeURIComponent(category.name)}`}
      className="group relative rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="aspect-square overflow-hidden">
        <img 
          src={category.image} 
          alt={category.name}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="text-white font-bold text-lg">{category.name}</h3>
        {category.description && (
          <p className="text-white/80 text-sm mt-1">{category.description}</p>
        )}
      </div>
    </Link>
  );
};

export default CategoryCard;