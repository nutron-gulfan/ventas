import React from 'react';
import Google from "../../images/googlelogo.ico";
import "./Login.css";

const Login = ({user}) => {
    const google = () => {
        window.open("http://localhost:5000/auth/google", "_self");
    };
    return (
        <>
            <div className='container'>
                <div className='row'>
                    <div className='col'>
                        <form className='loginform'>
                            <input type="text" placeholder='Username' />
                            <input type="password" placeholder='Password' />
                        </form>
                    </div>
                </div>
                <div className='row'>
                    <div className='col'>
                        <button className='google_button' onClick={google}>
                            <img className='googlelogo' src={Google} alt='sad' />
                            Login with Google</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
