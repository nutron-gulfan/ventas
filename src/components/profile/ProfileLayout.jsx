import React from 'react';
import "./ProfileLayout.css";

const ProfileLayout = ({ user }) => {
    return (
        <>
            <div className='ProfileMainframe'>
                <div className='innerFrame'>
                    <div className='holderMain'>
                        <div className='leftBar'>
                            <div className='leftbarItem'>Profile</div>
                            <div className='leftbarItem'>Interface</div>
                            <div className='leftbarItem'>Security</div>
                            <div className='leftbarItem'>Help</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}


export default ProfileLayout