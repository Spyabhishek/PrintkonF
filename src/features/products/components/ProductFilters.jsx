import { useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';

const ProductFilters = ({ filters, onFilterChange, categories }) => {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    sort: true,
    availability: true,
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const sortOptions = [
    { value: 'createdAt-DESC', label: 'Newest First', sortBy: 'createdAt', direction: 'DESC' },
    { value: 'createdAt-ASC', label: 'Oldest First', sortBy: 'createdAt', direction: 'ASC' },
    { value: 'price-ASC', label: 'Price: Low to High', sortBy: 'price', direction: 'ASC' },
    { value: 'price-DESC', label: 'Price: High to Low', sortBy: 'price', direction: 'DESC' },
    { value: 'name-ASC', label: 'Name: A to Z', sortBy: 'name', direction: 'ASC' },
    { value: 'name-DESC', label: 'Name: Z to A', sortBy: 'name', direction: 'DESC' },
  ];

  const currentSort = `${filters.sortBy}-${filters.sortDirection}`;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h3>
        {(filters.categoryId || currentSort !== 'createdAt-DESC') && (
          <button
            onClick={() => onFilterChange({
              categoryId: '',
              sortBy: 'createdAt',
              sortDirection: 'DESC',
            })}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('category')}
          className="flex items-center justify-between w-full mb-3"
        >
          <span className="font-medium text-gray-900 dark:text-white">Category</span>
          {expandedSections.category ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </button>
        
        {expandedSections.category && (
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="category"
                checked={!filters.categoryId}
                onChange={() => onFilterChange({ categoryId: '' })}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                All Categories
              </span>
            </label>
            
            {categories.map(category => (
              <label key={category.categoryId} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="category"
                  checked={filters.categoryId === category.categoryId}
                  onChange={() => onFilterChange({ categoryId: category.categoryId })}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {category.name}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Sort Filter */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('sort')}
          className="flex items-center justify-between w-full mb-3"
        >
          <span className="font-medium text-gray-900 dark:text-white">Sort By</span>
          {expandedSections.sort ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </button>
        
        {expandedSections.sort && (
          <div className="space-y-2">
            {sortOptions.map(option => (
              <label key={option.value} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="sort"
                  checked={currentSort === option.value}
                  onChange={() => onFilterChange({
                    sortBy: option.sortBy,
                    sortDirection: option.direction,
                  })}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductFilters;