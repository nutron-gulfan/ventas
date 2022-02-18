import React from 'react';
import Sidebar from "../../components/sidebar/Sidebar";
import TeamsLayout from "../../components/teams/TeamsLayout"

const Teams = ({ user }) => {
    return (
        <>
            <div className='row'>
                <Sidebar user={user} />
                <TeamsLayout/>
            </div>
        </>
    );
};

export default Teams