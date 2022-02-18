import "../profile/Profile.css"
import Sidebar from "../../components/sidebar/Sidebar"
import ProfileLayout from "../../components/profile/ProfileLayout"
import React from 'react'

const Profile = ({user}) => {
    return (
        <>
            <div className='row'>
                <Sidebar user={user} />
                <ProfileLayout user={user}/>
            
            </div>
        </>
    )
}
export default Profile