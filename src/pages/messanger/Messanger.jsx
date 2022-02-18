import React from 'react';
import Sidebar from "../../components/sidebar/Sidebar";
import MessangerLayout from '../../components/messanger/MessangerLayout';

const Messanger = ({ user }) => {
  return (
    <>
      <div className='row'>
        <Sidebar user={user} />
        <MessangerLayout user={user}/>
      </div>
    </>
  );
};

export default Messanger