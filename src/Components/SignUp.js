/* eslint-disable */ 
import React, { useContext } from "react";
import userContext from "../context/userContext";
import { Link } from "react-router-dom";

export default function SignUp() {
    const data = useContext(userContext);
    const signup = async (e) => {
        e.preventDefault();
        const username = document.getElementById("username").value;
        const name = document.getElementById("name").value;
        const password = document.getElementById("password").value;
        const cpassword = document.getElementById("cpassword").value;
        // const phoneNo = document.getElementById("phoneNo").value;
        const phoneNo = "0000000000";
        // const submit = document.getElementById("submit");

        const formData = {
            username: username,
            name: name,
            password: password,
            cpassword: cpassword,
            phone: phoneNo,
        };

        const resp = await fetch("http://localhost:5000/api/auth/createuser", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });
        const parsed = await resp.json();
        if (parsed.error == null) {
            localStorage.setItem("jwtTokken", parsed.authToken);
            data.setjwtTokken(parsed.authToken);
            window.location.href = "http://localhost:3000/";
        } else {
            alert(parsed.error);
        }
        location.reload();
    };
    return (
        <div className="loginContainer">
            <div className="loginForm">
                <div className="login-img"></div>
                <div className="form">
                    <div className="login-text">Sign Up</div>
                    <form action="" method="post" id="form">
                        <div id="container">
                            <input
                                className="input"
                                type="text"
                                id="name"
                                placeholder="Your Name"
                            />
                            <br />
                            <input
                                className="input"
                                type="text"
                                id="username"
                                placeholder="Username"
                            />
                            <br />
                            <input
                                className="input"
                                type="password"
                                id="password"
                                placeholder="Password"
                            />
                            <br />
                            <input
                                className="input"
                                type="password"
                                id="cpassword"
                                placeholder="Confirm Password"
                            />
                            <br />
                            {/* <input className="input" type="text" id="phoneNo" placeholder="Phone Number" /><br /> */}
                            <input
                                type="submit"
                                id="submit"
                                onClick={signup}
                                value="Continue"
                            />
                            <div className="newAccDiv">
                                <Link to="/" id="newAcc">
                                    Already have an account?
                                </Link>
                            </div>
                        </div>
                    </form>
                    <div className="photo-credits">
                        <a href="https://www.freepik.com/vectors/box" target="_blank">
                            Image credits
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
