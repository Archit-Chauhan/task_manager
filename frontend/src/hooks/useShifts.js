// src/hooks/useShifts.js

import { useState, useCallback } from 'react';
import { useApi } from './useApi';

export const useShifts = () => {
   
    const { execute, data, isLoading, error, apiClient } = useApi();
    
    const SHIFT_BASE_URL = '/shifts';

   
    const fetchShifts = useCallback(async (params = {}) => {
       
        try {
            const response = await apiClient.get(SHIFT_BASE_URL, { params }); 
            return response.data;
        } catch (err) {
            console.error("Failed to fetch shifts:", err);
            throw err;
        }
    }, [apiClient]);


    
    const createShift = useCallback(async (shiftData) => {
      
        return await execute(SHIFT_BASE_URL, 'post', shiftData); 
    }, [execute]);


 
    const updateShift = useCallback(async (shiftId, updateData) => {
        return await execute(`${SHIFT_BASE_URL}/${shiftId}`, 'put', updateData); 
    }, [execute]);


    
    const deleteShift = useCallback(async (shiftId) => {
        return await execute(`${SHIFT_BASE_URL}/${shiftId}`, 'delete'); 
    }, [execute]);


    const publishShift = useCallback(async (shiftId) => {
      
        return await execute(`${SHIFT_BASE_URL}/${shiftId}/publish`, 'post'); 
    }, [execute]);


    return {
        // CRUD operations
        fetchShifts,
        createShift,
        updateShift,
        deleteShift,
        
        publishShift,
        
        // State feedback from the last tracked call (create/update/delete)
        shiftData: data,
        isShiftLoading: isLoading,
        shiftError: error,
    };
};