import React, { useContext } from 'react'
import userContext from '../context/userContext';
import "./Styles/login.css"
import {
    Link
} from "react-router-dom";

export default function Login() {
    const data = useContext(userContext);
    const login = async (e) => {
        e.preventDefault();
        const username = document.getElementById("username");
        const password = document.getElementById("password");
        const userVal = username.value;
        const passVal = password.value;
        username.value = "";
        password.value = "";
        const bodyData = {
            "username": userVal,
            "password": passVal
        }
        const log = await fetch("http://localhost:5000/api/auth/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bodyData)
        });

        const parsed = await log.json();
        if (parsed.error == null) {
            localStorage.setItem("jwtTokken",parsed.authToken);
            data.setjwtTokken(parsed.authToken);
        } else {
            alert(parsed.error);
        }
        data.setOnline();
        window.onunload = data.setOffline;
	}
    return (
        <div id="loginForm">
            <form action="" method="post" id="form">
                <div id="container">
                    <input type="text" id="username" placeholder="Username" /><br/>
                    <input type="password" id="password" placeholder="Password" /><br />
                    <input type="submit" id="submit" value="LogIn" onClick={login} /><br />
                    <div><Link to="/signUp" id="newAcc">Create An Account</Link></div>
                </div>
            </form>

            <a href="https://www.freepik.com/vectors/background" id = "attribute">Background vector created by coolvector - www.freepik.com</a>
        </div>
    )
}
