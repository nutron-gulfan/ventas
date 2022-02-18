import React from 'react';
import Sidebar from "../../components/sidebar/Sidebar";
import CalanderLayout from "../../components/calander/CalanderLayout";
const Calander = ({ user }) => {
    return (
        <>
            <div className='row'>
                <Sidebar user={user} />
                <CalanderLayout />
            </div>
        </>
    );
};
export default Calander