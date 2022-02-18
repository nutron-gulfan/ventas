import "./Sidebar.css";
import messanger from "../../images/messanger.png";
import calendly from "../../images/calendly.png";
import teams from "../../images/teams1.png";
import {Link } from "react-router-dom";
const Sidebar = ({ user }) => {
    const logout = () => {
        window.open("https://git.heroku.com/ventas-v1.git/auth/logout", "_self");
    };
    return (
        <>
            <div className="sideframe">
                <Link to="/profile"><abbr title={user.displayName}><img className="profilePicture" src={user.photos[0].value} alt="dp" /></abbr></Link>
                <div className="iconsSet">
                    <span><Link to="/messanger"><img style={{"--deley":"1s"}} src={messanger} alt="messanger"/></Link></span>
                    <span><Link to="/teams"><img style={{"--deley":"1.2s"}} src={teams} alt="teams"/></Link></span>
                    <span><Link to="/calander"><img style={{"--deley":"1.4s"}} src={calendly} alt="calander"/></Link></span>
                </div>

                <span className="logout" onClick={logout}>
                    <i className="fas fa-sign-out-alt"></i>
                </span>
            </div>
        </>
    );
};

export default Sidebar