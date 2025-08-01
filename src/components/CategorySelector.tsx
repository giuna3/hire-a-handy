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
      
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((category) => (
          <div key={category.key} className="flex flex-col">
            <Badge 
              variant={selectedCategory === category.key ? "default" : "secondary"}
              className="px-4 py-2 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors whitespace-nowrap"
              onClick={() => handleCategoryClick(category.key)}
            >
              {t(category.translationKey)}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySelector;