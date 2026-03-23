import React, { useState } from 'react';
import "../CSS/LoginSignup.css"
import axios from 'axios';


const LoginSignup = () => {
    const [state, setState] = useState("Login");
    const [formData, setFormData] = useState({ username: "", email: "", password: "" });

    const changeHandler = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAction = async () => {
        const url = state === "Login" ? 'http://localhost:5000/login' : 'http://localhost:5000/signup';
        try {
            const res = await axios.post(url, formData);
            if (res.data.success || res.status === 201) {
                if(state === "Login") {
                    localStorage.setItem('user', res.data.username);
                    window.location.replace("/"); 
                } else {
                    alert("Account Created! Please Login.");
                    setState("Login");
                }
            } else {
                alert(res.data.message);
            }
        } catch (err) {
            alert("Connection to server failed. Is the backend running?");
        }
    };

    return (
        <div className='loginsignup'>
            <div className="loginsignup-container">
                <h1>{state}</h1>
                <div className="loginsignup-fields">
                    {state === "Sign Up" && <input name='username' placeholder='Name' onChange={changeHandler} />}
                    <input name='email' placeholder='Email' onChange={changeHandler} />
                    <input name='password' type="password" placeholder='Password' onChange={changeHandler} />
                </div>
                <button onClick={handleAction}>Continue</button>
                <p className="loginsignup-login">
                    {state === "Sign Up" ? "Already have an account?" : "Create an account?"}
                    <span onClick={() => setState(state === "Login" ? "Sign Up" : "Login")}> Click here</span>
                </p>
            </div>
        </div>
    );
};

export default LoginSignup;