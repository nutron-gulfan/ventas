import React from 'react';
// import googleIco from "../../images/dp1.jpg";
// import channel from "../../images/channel.png"

const Channels = ({ content }) => {
    return (
        <div className='contactItem'>
            <span className='profileHolder'>
                <img className='contactDp' src={content.channelDp} alt="contactDp" />
                {/* {online ? <span className='online'></span> : <span className='offline'></span>} */}
            </span>
            <span className='contactName'>{content.channelName}</span>
            {/* {messageCount ? <span className='newMessage'></span> : ""} */}
        </div>
    )
};
export default Channels