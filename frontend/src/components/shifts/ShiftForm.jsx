
import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { useShifts } from '../../hooks/useShifts';

/**
 * Form component for creating or editing shift details.
 * This is used by Managers/Admins on the SchedulePage.
 * It handles input validation and communicates with the shift API hook.
 * @param {object} initialShiftData - Data for the shift being edited (optional).
 * @param {function} onComplete - Callback function on successful save/creation.
 */
export const ShiftForm = ({ initialShiftData, onComplete }) => {
    
    const isEditMode = !!initialShiftData;
    const { createShift, updateShift, isShiftLoading, shiftError } = useShifts();
    
        const [formData, setFormData] = useState({
        title: initialShiftData?.title || '',
        startTime: initialShiftData?.startTime.substring(0, 16) || '',        
        endTime: initialShiftData?.endTime.substring(0, 16) || '',
        location: initialShiftData?.location || '',
        roleRequired: initialShiftData?.roleRequired || 'EMPLOYEE', 
        assignedTo: initialShiftData?.assignedTo || '', 
    });
    const [validationErrors, setValidationErrors] = useState({});

    useEffect(() => {
        if (initialShiftData) {
             
            setFormData({
                title: initialShiftData.title,
                startTime: initialShiftData.startTime.substring(0, 16),
                endTime: initialShiftData.endTime.substring(0, 16),
                location: initialShiftData.location,
                roleRequired: initialShiftData.roleRequired,
                assignedTo: initialShiftData.assignedTo,
            });
        }
    }, [initialShiftData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        if (validationErrors[name]) {
             setValidationErrors(prev => ({ ...prev, [name]: null }));
        }
    };
    
    const validate = () => {
        let errors = {};
        if (!formData.title) errors.title = "Shift title is required.";
        if (!formData.startTime) errors.startTime = "Start time is required.";
        if (!formData.endTime) errors.endTime = "End time is required.";
        if (new Date(formData.startTime) >= new Date(formData.endTime)) {
            errors.endTime = "End time must be after the start time.";
        }
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        
        try {
            let result;
            if (isEditMode) {
                
                result = await updateShift(initialShiftData._id, formData);
            } else {
                
                result = await createShift(formData);
            }
            
            
            alert(`Shift successfully ${isEditMode ? 'updated' : 'created'}!`);
            onComplete(result);
            
            
            if (!isEditMode) {
                setFormData({ title: '', startTime: '', endTime: '', location: '', roleRequired: 'EMPLOYEE', assignedTo: '' });
            }

        } catch (err) {
            const msg = err.response?.data?.message || 'An unexpected error occurred.';
            alert(`API Error: ${msg}`);
        }
    };

    const title = isEditMode ? 'Edit Shift' : 'Create New Shift';
    const submitText = isEditMode ? 'Save Changes' : 'Create Shift';

    return (
        <Card title={title}>
            <form onSubmit={handleSubmit} className="space-y-4">
                
                <Input 
                    label="Shift Title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleChange}
                    error={validationErrors.title}
                    placeholder="E.g., Morning Floor Lead"
                    required
                />
                
                <div className="grid grid-cols-2 gap-4">
                    <Input 
                        label="Start Time"
                        name="startTime"
                        type="datetime-local"
                        value={formData.startTime}
                        onChange={handleChange}
                        error={validationErrors.startTime}
                        required
                    />
                    <Input 
                        label="End Time"
                        name="endTime"
                        type="datetime-local"
                        value={formData.endTime}
                        onChange={handleChange}
                        error={validationErrors.endTime}
                        required
                    />
                </div>
                
                <Input 
                    label="Location"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="E.g., Front Desk, Warehouse"
                />

                <Input 
                    label="Role Required"
                    name="roleRequired"
                    type="text" 
                    value={formData.roleRequired}
                    onChange={handleChange}
                    placeholder="ADMIN, MANAGER, or EMPLOYEE"
                    required
                />
                
                {/* Note: AssignedTo field will be a complex User search/select component later */}
                <Input 
                    label="Assign To (User ID/Name Placeholder)"
                    name="assignedTo"
                    type="text"
                    value={formData.assignedTo}
                    onChange={handleChange}
                    placeholder="Enter Employee ID (Optional)"
                />

                {shiftError && (
                    <div className="p-3 text-sm text-red-700 bg-red-100 rounded-md">
                        API Error: {shiftError.message || 'Check shift times for conflicts/limits.'}
                    </div>
                )}
                
                <Button 
                    type="submit" 
                    isLoading={isShiftLoading} 
                    className="w-full"
                >
                    {submitText}
                </Button>
                
                {/* If in edit mode, provide a delete option */}
                {isEditMode && (
                    <Button type="button" variant="danger" className="w-full mt-2">
                        Delete Shift
                    </Button>
                )}
            </form>
        </Card>
    );
};