// src/pages/Manager/SchedulePage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import {useNavigate} from "react-router-dom";
import { useShifts } from '../../hooks/useShifts';
import { ShiftForm } from '../../components/shifts/ShiftForm';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';


export const SchedulePage = () => {
   
    const [schedule, setSchedule] = useState([]);
    const [isScheduleLoading, setIsScheduleLoading] = useState(false);
    const [shiftToEdit, setShiftToEdit] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const { fetchShifts, publishShift } = useShifts();
    
    // --- Data Fetching Logic ---
    const loadSchedule = useCallback(async () => {
        setIsScheduleLoading(true);
        try {
            const shifts = await fetchShifts({ status: 'DRAFT,PUBLISHED' });
            setSchedule(shifts);
        } catch (error) {
            console.error("Error loading schedule:", error);
            alert("Could not load schedule. Check console for details.");
        } finally {
            setIsScheduleLoading(false);
        }
    }, [fetchShifts]);

    // Load the schedule on initial component mount
    useEffect(() => {
        loadSchedule();
    }, [loadSchedule]);


    // --- Form Handlers ---
    const handleShiftCreatedOrUpdated = (newShift) => {
       
        loadSchedule(); 
        
        setShiftToEdit(null);
        setShowForm(false);
    };

    const handleEditClick = (shift) => {
        setShiftToEdit(shift); // Load the shift data into the form
        setShowForm(true);
    };

    const handleCreateClick = () => {
        setShiftToEdit(null); // Clear any previous edit state
        setShowForm(true);
    };
    
    const handlePublishClick = async (shiftId) => {
        if (!window.confirm("Are you sure you want to publish this shift?")) return;
        try {
            await publishShift(shiftId);
            alert("Shift published successfully!");
            loadSchedule(); // Refresh list to update status
        } catch (error) {
             alert("Failed to publish shift. Check API response for backend errors (e.g., conflicts).");
        }
    };

    const navigate = useNavigate();


    // --- Helper Component for Shift Listing ---
    const ShiftItem = ({ shift }) => (
        <div className={`p-4 rounded-lg shadow-sm border ${shift.status === 'PUBLISHED' ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}>
            <h3 className="text-lg font-semibold text-gray-800">{shift.title}</h3>
            <p className="text-sm text-gray-600">
                {new Date(shift.startTime).toLocaleString()} - {new Date(shift.endTime).toLocaleString()}
            </p>
            <p className={`text-xs font-medium uppercase mt-1 ${shift.status === 'PUBLISHED' ? 'text-green-600' : 'text-yellow-600'}`}>
                Status: {shift.status}
            </p>
            <div className="mt-3 flex space-x-2">
                <Button size="sm" variant="secondary" onClick={() => handleEditClick(shift)}>
                    Edit
                </Button>
                {/* Only allow publishing if the shift is currently in DRAFT status */}
                {shift.status === 'DRAFT' && (
                    <Button size="sm" variant="primary" onClick={() => handlePublishClick(shift._id)}>
                        Publish
                    </Button>
                )}
            </div>
        </div>
    );
    

    return (
        <div className="p-4 space-y-6">
            <h1 className="text-4xl font-extrabold text-indigo-700 border-b pb-3 flex justify-between items-center">
                Weekly Shift Scheduling & Management
                <Button onClick={handleCreateClick} variant="primary">
                    + Create New Shift
                </Button>
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* --- 1. Shift Form Panel --- */}
                {showForm && (
                    <div className="lg:col-span-1">
                        <ShiftForm 
                            initialShiftData={shiftToEdit} 
                            onComplete={handleShiftCreatedOrUpdated} 
                        />
                        <Button variant="ghost" onClick={() => setShowForm(false)} className="mt-2 w-full text-gray-500 hover:text-red-500">
                            Close Form
                        </Button>
                    </div>
                )}


                {/* --- 2. Shift List/Calendar View --- */}
                <Card title="Current Draft & Published Shifts" className={showForm ? 'lg:col-span-2' : 'lg:col-span-3'}>
                    <div className="bg-yellow-50 p-3 mb-4 rounded-lg text-sm text-yellow-800">
                        *Note: Backend logic handles conflict detection and weekly hour limits. [cite: 23, 25]
                    </div>
                    {isScheduleLoading ? (
                        <div className="flex justify-center items-center h-48">
                            <LoadingSpinner />
                            <p className="ml-3">Loading schedule data...</p>
                        </div>
                    ) : schedule.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                            {schedule.map(shift => (
                                <ShiftItem key={shift._id} shift={shift} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-12">No shifts currently scheduled. Start by creating one!</p>
                    )}
                </Card>
            </div>
            <Card title="Management Tools" className="mt-6">
                <p className="text-gray-600">
                    Use this section for higher-level operations, such as managing users or bulk publishing the entire week's schedule at once.
                </p>
                <div className="flex space-x-4 mt-4">
                    <Button variant="secondary">Bulk Publish Week (TBD)</Button>
                    <Button 
                     onClick={()=>navigate("/manager/swaps")}
                     className="px-4 py-2 border rounded">
                        View Swap Requests
                    </Button>
                </div>
            </Card>
        </div>
    );
};