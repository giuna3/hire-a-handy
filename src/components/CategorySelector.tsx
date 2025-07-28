import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { CATEGORIES, Category, SubCategory } from "@/types/categories";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface CategorySelectorProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onClearFilter: () => void;
}

const CategorySelector = ({ selectedCategory, onCategoryChange, onClearFilter }: CategorySelectorProps) => {
  const { t } = useTranslation();
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const toggleCategory = (categoryKey: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryKey) 
        ? prev.filter(key => key !== categoryKey)
        : [...prev, categoryKey]
    );
  };

  const handleCategoryClick = (categoryKey: string) => {
    onCategoryChange(categoryKey);
  };

  const handleSubcategoryClick = (subcategoryKey: string) => {
    onCategoryChange(subcategoryKey);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{t('clientHome.popularCategories')}</h3>
        {selectedCategory && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={onClearFilter}
          >
            {t('clientHome.clearFilter')}
          </Button>
        )}
      </div>
      
      <div className="space-y-2">
        {CATEGORIES.map((category) => (
          <div key={category.key} className="border rounded-lg p-2">
            <div className="flex items-center justify-between">
              <Badge 
                variant={selectedCategory === category.key ? "default" : "secondary"}
                className="px-4 py-2 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => handleCategoryClick(category.key)}
              >
                {t(category.translationKey)}
              </Badge>
              
              {category.subcategories && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleCategory(category.key)}
                >
                  {expandedCategories.includes(category.key) ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </Button>
              )}
            </div>
            
            {category.subcategories && expandedCategories.includes(category.key) && (
              <div className="mt-2 ml-4 flex flex-wrap gap-2">
                {category.subcategories.map((subcategory) => (
                  <Badge
                    key={subcategory.key}
                    variant={selectedCategory === subcategory.key ? "default" : "outline"}
                    className="px-3 py-1 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors text-sm"
                    onClick={() => handleSubcategoryClick(subcategory.key)}
                  >
                    {t(subcategory.translationKey)}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySelector;