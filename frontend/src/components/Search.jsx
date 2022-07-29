import { useEffect } from "preact/hooks";
import React, { useCallback, useState } from "react";

const DebounceSrcatch = ({ onSearch }) => {
  const queryParams = new URLSearchParams(window.location.search);
  const [searchText, setSearchText] = useState(queryParams.get("q"))

  useEffect(() => {
    onSearch(searchText)
  },[])
  const debounce = (func) => {
    let timer;
    return function (...args) {
      const context = this;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        timer = null;
        func.apply(context, args);
      }, 500);
    };
  };

  const handleChange = (value) => {
    updateURL(value)
    setSearchText(value)
    onSearch(value)
  };

  const updateURL = (query) => {
    const url = new URL(window.location);
    url.searchParams.set('q', query);
    window.history.pushState({}, '', url);
  }

  const optimizedFn = useCallback(debounce(handleChange), []);

  return (
    <div class="px-8 lg:px-36 py-5 sticky top-0 border-b bg-white dark:bg-blacks-900 dark:border-blacks-400  shadow-lg">

      <label for="default-search"
        class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-gray-300">Search</label>
      <div class="relative">
        <div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
          <svg aria-hidden="true" class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none"
            stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        <input type="search" id="default-search"
          class="
             block 
             p-4 
             pl-10 
             w-full 
             text-sm 
             text-gray-900 
             bg-gray-50 
             rounded-lg 
             border 
             border-gray-300 
             dark:bg-gray-800 
             dark:border-gray-600 
             dark:placeholder-gray-400 
             dark:text-white 
             focus:ring-2
             focus:outline-none 
             focus:ring-green-500 
            
             "

          placeholder="Search Mockups, Logos..."
          value={searchText}
          onChange={(e) => optimizedFn(e.target.value)}
        />

        <button type="submit"
          class="
             text-white 
             absolute 
             right-2.5 
             bottom-2.5 
             bg-green-700 
             hover:bg-green-800 
             
             font-medium 
             rounded-lg 
             text-sm px-4 py-2
              dark:bg-green-600 
              dark:hover:bg-green-700 

              focus:ring-2
              focus:outline-none 
             focus:ring-green-500
              ">Search</button>
      </div>
    </div>
  );
};

export default DebounceSrcatch;