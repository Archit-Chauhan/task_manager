// src/hooks/useNotification.js

import { useEffect, useCallback } from 'react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';

export const useNotification = () => {
    const socket = useSocket();
    const { user } = useAuth(); // Needed to filter notifications relevant to this user

    const showToast = useCallback((title, message, type = 'info') => {
        console.log(`[${type.toUpperCase()} Notification] ${title}: ${message}`);
        alert(`${title}: ${message}`); // Simple browser alert for now
    }, []);

    useEffect(() => {
        if (!socket || !user) {
            return;
        }

        console.log('Notification listener initialized for user:', user.id);


        const handleSwapRequest = (data) => {
            if (data.targetOwnerId === user.id) {
                showToast('New Swap Request!', `A request has been made for your shift: ${data.shiftTitle}.`, 'info');
            }
        };

        const handleSwapUpdate = (data) => {
             if (data.requesterId === user.id || data.targetOwnerId === user.id) {
                showToast(`Swap ${data.status.toUpperCase()}`, `Your swap request for ${data.shiftTitle} was ${data.status.toLowerCase()}.`, data.status === 'APPROVED' ? 'success' : 'error');
            }
        };

        // 2. Task Assignment Events
        const handleTaskAssignment = (data) => {
            if (data.assignedToId === user.id) {
                showToast('New Task Assigned!', `You have been assigned task: ${data.taskTitle}.`, 'warning');
            }
        };
        const handleShiftUpdate = (data) => {
            if (data.assignedToId === user.id) {
                showToast('Shift Updated!', `Your shift ${data.shiftTitle} has been modified or published.`, 'info');
            }
        };


        // Register the listeners
        socket.on('swapRequestPending', handleSwapRequest);
        socket.on('swapUpdate', handleSwapUpdate);
        socket.on('taskAssigned', handleTaskAssignment);
        socket.on('shiftUpdate', handleShiftUpdate);
        
        // Cleanup: Remove listeners when the component unmounts or socket changes
        return () => {
            socket.off('swapRequestPending', handleSwapRequest);
            socket.off('swapUpdate', handleSwapUpdate);
            socket.off('taskAssigned', handleTaskAssignment);
            socket.off('shiftUpdate', handleShiftUpdate);
        };
    }, [socket, user, showToast]);

    return { showToast };
};