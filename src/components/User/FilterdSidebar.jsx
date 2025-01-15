import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Checkbox } from "../ui/checkbox";
import axiosInstance from "../../AxiosInstance";

const FilterSidebar = ({ className, selectedFilters, setSelectedFilters }) => {
  const [categories, setCategories] = useState([]);
  const sizes = ["S", "M", "L"];

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get("/user/categories");
      if (response.data.success) {
        setCategories(response.data.categories);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [selectedFilters]);

  const handleFilterChange = async (filterType, option) => {
    setSelectedFilters((prev) => {
      const currentOptions = prev[filterType];
      const updatedOptions = currentOptions.includes(option)
        ? currentOptions.filter((item) => item !== option)
        : [...currentOptions, option];
      return {
        ...prev,
        [filterType]: updatedOptions,
      };
    });
  };

  const clearAllFilters = () => {
    setSelectedFilters({
      category: [],
      size: [],
    });
  };

  const filterOptions = {
    Category: categories.map((cat) => cat.name),
    size: sizes,
  };

  const hasActiveFilters = selectedFilters.category.length > 0 || selectedFilters.size.length > 0;

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Filters</h2>
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllFilters}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <X className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      <Accordion type="single" collapsible className="w-full">
        {Object.keys(filterOptions).map((filter) => (
          <AccordionItem key={filter} value={filter}>
            <AccordionTrigger className="text-sm font-medium">
              {filter}
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {filterOptions[filter].map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      checked={selectedFilters[filter.toLowerCase()].includes(option)}
                      onCheckedChange={() =>
                        handleFilterChange(filter.toLowerCase(), option)
                      }
                    />
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default FilterSidebar;