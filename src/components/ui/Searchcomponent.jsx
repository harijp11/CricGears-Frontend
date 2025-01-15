import React, { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/Input";
import _ from "lodash";

export default function SearchComponent({ setsearch,search}) {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [tempSearch, setTempSearch] = useState("");

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  
  const debouncedSetSearch = useMemo(
    () => _.debounce((value) => setsearch(value), 500),
    [setsearch]
  );

  
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setTempSearch(value); 
    debouncedSetSearch(value); 
  };

  return (
    <div className='relative flex items-center justify-end'>
      <div
        className={`absolute right-[44px] top-0 transition-all duration-300 ease-in-out overflow-hidden ${
          isSearchVisible ? "w-64 opacity-100 mr-[10px]" : "w-0 opacity-0 mr-0"
        }`}>
        <Input
          type='search'
          placeholder='Search...'
          className='w-full h-10 pl-3 pr-10'
          value={search}
          onChange={handleSearchChange}
        />
      </div>
      <Button
        variant='outline'
        size='icon'
        onClick={toggleSearch}
        aria-label='Toggle search'
        className='relative z-10'>
        <Search className='h-4 w-4' />
      </Button>
    </div>
  );
}
