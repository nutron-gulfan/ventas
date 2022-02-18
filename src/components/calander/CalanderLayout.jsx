import React from 'react';
import "./CalanderLayout.css";
import Calendar from 'react-calendar';

const CalanderLayout = () => {
    return (
        <>
            <div className='CalanderMainframe'>
                <div className='innerFrame'>
                    <Calendar/>
                </div>
            </div>
        </>
    )
};
export default CalanderLayout