'use client'

import { SearchType } from '@/util/search-type';
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the RolesDataDto type


// Define the context type
interface SearchTypeContextType {
    searchType: SearchType
    setSearchType: React.Dispatch<React.SetStateAction<SearchType>>;
    
}

// Create the context
const SearchTypeContext = createContext<SearchTypeContextType | undefined>(undefined);

// Create a provider component
export const SearchTypeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [searchType, setSearchType] = useState<SearchType>(SearchType.TITLE);

    return (
        <SearchTypeContext.Provider value={{ searchType, setSearchType}}>
            {children}
        </SearchTypeContext.Provider>
    );
};

// Create a custom hook to use the RolesContext
export const useSearchTypeContext = (): SearchTypeContextType => {
    const context = useContext(SearchTypeContext);
    if (context === undefined) {
        throw new Error('useSearchTypeContext must be used within an SearchTypeContext.Provider');
    }
    return context;
};