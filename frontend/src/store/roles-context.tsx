'use client'

import { RoleDataDto } from '@/dtos/roles-data.dto';
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the RolesDataDto type


// Define the context type
interface RoleContextType {
    roles: RoleDataDto[];
    setRoles: React.Dispatch<React.SetStateAction<RoleDataDto[]>>;
    
}

// Create the context
const RolesContext = createContext<RoleContextType | undefined>(undefined);

// Create a provider component
export const RolesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [roles, setRoles] = useState<RoleDataDto[]>([]);

    return (
        <RolesContext.Provider value={{ roles, setRoles }}>
            {children}
        </RolesContext.Provider>
    );
};

// Create a custom hook to use the RolesContext
export const useRolesContext = (): RoleContextType => {
    const context = useContext(RolesContext);
    if (context === undefined) {
        throw new Error('useRolesContext must be used within an RolesProvider');
    }
    return context;
};