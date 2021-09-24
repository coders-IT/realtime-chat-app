import React, { useContext } from 'react'
import userContext from '../context/userContext';
import "./Styles/signup.css"

export default function SignUp() {
    const data = useContext(userContext);
    const signup = async (e) => {
        e.preventDefault();
        const username = document.getElementById("username").value;
        const name = document.getElementById("name").value;
        const password = document.getElementById("password").value;
        const cpassword = document.getElementById("cpassword").value;
        const phoneNo = document.getElementById("phoneNo").value;
        const submit = document.getElementById("submit");

        const formData = {
            "username": username,
            "name": name,
            "password": password,
            "cpassword": cpassword,
            "phone": phoneNo
        }

        const resp = await fetch("http://localhost:5000/api/auth/createuser", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        const parsed = await resp.json();
        if (parsed.error == null) {
            localStorage.setItem("jwtTokken", parsed.authToken);
            data.setjwtTokken(parsed.authToken);
            window.location.href ="http://localhost:3000/"
        } else {
            alert(parsed.error);
		}

	}
    return (
        <div id="loginForm">
            <form action="" method="post" id="form" style={{ height:"300px" }}>
                <div id="container">
                    <input type="text" id="name" placeholder="Your Name"/><br/>
                    <input type="text" id="username" placeholder="Username" /><br/>
                    <input type="password" id="password" placeholder="Password"/><br/>
                    <input type="password" id="cpassword" placeholder="Confirm Password" /><br />
                    <input type="text" id="phoneNo" placeholder="Phone Number" /><br />
                    <input type="submit" id="submit" onClick={signup} value="Sign Up" />

                </div>
            </form>
            <a href="https://www.freepik.com/vectors/background" id = "attribute">Background vector created by coolvector - www.freepik.com</a>
        </div>
    )
}
