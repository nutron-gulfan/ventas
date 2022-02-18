import "./Home.css";
import Sidebar from "../../components/sidebar/Sidebar";
// import { io } from "socket.io-client";
// import { useEffect, useRef } from "react";

const Home = ({ user }) => {
    // const socket = useRef();

    // useEffect(() => {
    //     socket.current = io("ws://localhost:8900");
    //     socket.current.emit("addUser", user.emails[0].value);
    // }, []);

    return (
        <>
            <Sidebar user={user} />
        </>
    );
};

export default Home;