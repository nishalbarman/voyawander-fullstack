import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import Style from "./Signup.module.css";
import { useSelector } from "react-redux";
import logo from "../../Images/logo_website.png";

export const Signup = () => {
  const [values, setvalues] = useState({
    name: "",
    email: "",
    pass: "",
  });

  const server = import.meta.env.VITE_SERVER_URI;

  const [isError, setIserror] = useState("");
  const [submitbutton, setSubmitButton] = useState(false);

  const navigate = useNavigate();

  const isAuth = useSelector((state) => state.auth);
  console.log(isAuth);
  if (isAuth.isAuth) {
    navigate("/");
  }

  const handlesubmit = () => {
    if (!values.name || !values.email || !values.pass) {
      setIserror("Please Fill All Fields");
      return;
    }
    setIserror("");
    setSubmitButton(true);
    fetch(`${server}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: values.name,
        email: values.email,
        password: values.pass,
      }),
    })
      .then(async (res) => {
        return res.json();
      })
      .then((data) => {
        setSubmitButton(false);
        if (data.status == true) {
          navigate("/login");
        } else {
          alert(data.message);
        }
      })
      .catch((error) => setIserror(error.message), setSubmitButton(false));
    console.log(values);
  };

  return (
    <div className={Style.container}>
      <div className={Style.inner}>
        <div>
          <img src={logo} className={Style.logo} />
          <p className={Style.welcome}>
            Embark on a Journey Beyond Boundaries – Explore, Dream, and Discover
            with Us!
          </p>
        </div>
        <div>
          <input
            className={Style.input}
            type="text"
            placeholder="Enter Your Name"
            onChange={(e) =>
              setvalues((prev) => ({ ...prev, name: e.target.value }))
            }
          />
        </div>
        <br />
        <div>
          <input
            className={Style.input}
            type="email"
            placeholder="Enter Your Email"
            onChange={(e) =>
              setvalues((prev) => ({ ...prev, email: e.target.value }))
            }
          />
        </div>
        <br />
        <div>
          <input
            className={Style.input}
            type="password"
            placeholder="Enter Your Password"
            onChange={(e) =>
              setvalues((prev) => ({ ...prev, pass: e.target.value }))
            }
          />
        </div>
        <br />
        <div>
          <p className={Style.dont}>{isError}</p>
        </div>
        <button
          className={Style.btn}
          onClick={handlesubmit}
          disabled={submitbutton}>
          Sign up
        </button>
        <p>
          Already have an account?
          <span>
            <Link className={Style.link} to="/login">
              {" "}
              Login
            </Link>
          </span>
        </p>
      </div>
    </div>
  );
};
