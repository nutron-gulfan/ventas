import React from 'react';
// import googleIco from "../../images/dp1.jpg";

const Contacts = ({ admin, user, messageCount, online }) => {
    return (
        <div className='contactItem'>
            <span className='profileHolder'>
                <img className='contactDp' src={user.profilePicture} alt="contactDp" />
                {online ? <span className='online'></span> : <span className='offline'></span>}
            </span>
            <span className='contactName'>{user.username}</span>
            {messageCount ? <span className='newMessage'></span> : ""}
            {
                admin ? <span className='admin'>
                    <i title='Admin' className='fa fa-user-shield'></i>
                </span> : ""
            }

        </div>
    )
};
export default Contacts