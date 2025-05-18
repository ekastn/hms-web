/**
 * Formats a time string or Date object into a user-friendly format
 * @param time Time string (HH:MM:SS), Date object, or time string in format 'HH:MM:SS' or 'HH:MM'
 * @returns Formatted time string (e.g., '2:30 PM') or 'Invalid Time' if input is invalid
 */
export const formatTime = (time: string | Date): string => {
    console.log('formatTime input:', { time, type: typeof time });
    if (!time) {
        console.warn('formatTime: No time provided');
        return 'Invalid Time';
    }
    
    try {
        // Handle Date objects
        if (time instanceof Date) {
            if (isNaN(time.getTime())) {
                console.warn('formatTime: Invalid Date object');
                return 'Invalid Time';
            }
            return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        
        // Handle string inputs
        const timeStr = String(time).trim();
        
        // Try parsing as a date string first
        const dateFromString = new Date(timeStr);
        if (!isNaN(dateFromString.getTime())) {
            return dateFromString.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        
        // Handle time strings like '09:00:00' or '09:00'
        const timeMatch = timeStr.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?(?:\.\d+)?$/);
        
        if (timeMatch) {
            const hours = parseInt(timeMatch[1], 10);
            const minutes = parseInt(timeMatch[2], 10);
            
            if (hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60) {
                const date = new Date();
                date.setHours(hours, minutes, 0, 0);
                return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            }
        }
        
        console.warn('formatTime: Invalid time format:', time);
        return 'Invalid Time';
    } catch (error) {
        console.error('formatTime: Error formatting time:', error, 'Input was:', time);
        return 'Invalid Time';
    }
};

/**
 * Gets the day name from a day of week number
 * @param dayOfWeek Day of week (0-6, where 0 is Sunday)
 * @returns Full day name (e.g., 'Monday') or 'Day X' if out of range
 */
export const getDayName = (dayOfWeek: number | string): string => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayIndex = typeof dayOfWeek === 'string' ? parseInt(dayOfWeek, 10) : dayOfWeek;
    return days[dayIndex] || `Day ${dayOfWeek}`;
};

/**
 * Formats a time slot into a readable string
 * @param slot TimeSlot object containing dayOfWeek, startTime, and endTime
 * @returns Formatted time slot string (e.g., 'Monday: 9:00 AM - 5:00 PM')
 */
export const formatTimeSlot = (slot: { 
    dayOfWeek: number | string; 
    startTime: string | Date; 
    endTime: string | Date 
}): string => {
    console.log('formatTimeSlot input:', { 
        dayOfWeek: slot.dayOfWeek, 
        startTime: slot.startTime, 
        endTime: slot.endTime,
        types: {
            dayOfWeek: typeof slot.dayOfWeek,
            startTime: typeof slot.startTime,
            endTime: typeof slot.endTime
        }
    });
    
    const dayName = getDayName(slot.dayOfWeek);
    const startTime = formatTime(slot.startTime);
    const endTime = formatTime(slot.endTime);
    
    const result = `${dayName}: ${startTime} - ${endTime}`;
    console.log('formatTimeSlot result:', result);
    return result;
};

/**
 * Formats an array of time slots into a readable string
 * @param slots Array of time slots
 * @returns Formatted string of time slots (e.g., 'Monday 9:00 AM-5:00 PM, Wednesday 9:00 AM-5:00 PM')
 */
export const formatAvailability = (slots: Array<{ dayOfWeek: number; startTime: string | Date; endTime: string | Date }>): string => {
    if (!slots || !Array.isArray(slots) || slots.length === 0) {
        return 'Not available';
    }
    
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    const formattedSlots = slots
        .filter(slot => {
            // Filter out invalid slots
            return (
                slot &&
                typeof slot.dayOfWeek === 'number' &&
                slot.dayOfWeek >= 0 &&
                slot.dayOfWeek <= 6 &&
                slot.startTime !== undefined &&
                slot.endTime !== undefined
            );
        })
        .map(slot => {
            const dayName = days[slot.dayOfWeek] || `Day ${slot.dayOfWeek + 1}`;
            const startTimeStr = formatTime(slot.startTime);
            const endTimeStr = formatTime(slot.endTime);
            
            return `${dayName} ${startTimeStr}-${endTimeStr}`;
        });
    
    if (formattedSlots.length === 0) {
        return 'No valid availability';
    }
    
    return formattedSlots.join(', ');
};
