
import React, { useState } from "react";
import { googleLogin, facebookLogin } from "../firebase";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  /* ===== Username + Password Login ===== */
  const handleUserLogin = async () => {
    if (!username || !password) {
      alert("Username and Password required");
      return;
    }

    try {
      const q = query(
        collection(db, "users"),
        where("username", "==", username.toLowerCase()),
        where("password", "==", password)
      );

      const snap = await getDocs(q);

      if (snap.empty) {
        alert("Invalid username or password");
        return;
      }

      const userData = snap.docs[0].data();
      alert("Login Success: " + userData.fullname);

      // **Important**: set parent App state so Profile shows
      if (onLogin) onLogin(userData);
    } catch (err) {
      console.error(err);
      alert("Login error");
    }
  };

  /* ===== Google Login ===== */
  const handleGoogle = async () => {
    try {
      const user = await googleLogin();
      alert("Google Login Success");

      if (onLogin) onLogin(user);
    } catch (err) {
      console.error(err);
      alert("Google login failed");
    }
  };

  /* ===== Facebook Login ===== */
  const handleFacebook = async () => {
    try {
      const user = await facebookLogin();
      alert("Facebook Login Success");

      if (onLogin) onLogin(user);
    } catch (err) {
      console.error(err);
      alert("Facebook login failed");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Login Page</h2>

      {/* Username Login */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ padding: "10px", width: "200px", marginBottom: "10px" }}
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: "10px", width: "200px" }}
        />
        <br /><br />
        <button onClick={handleUserLogin}>Login</button>
      </div>

      <hr style={{ width: "250px" }} />

      {/* Google Login */}
      <button onClick={handleGoogle}>
        <img
          src="https://www.citypng.com/public/uploads/preview/google-logo-icon-gsuite-hd-701751694791470gzbayltphh.png"
          alt="login with google"
          width="40"
        />
      </button>

      <br /><br />

      {/* Facebook Login */}
      <button onClick={handleFacebook} >
        <img
          src="https://pnglove.com/data/img/240_osSR.jpg"
          alt="login with facebook"
          width="40"
        />

      </button>
    </div>
  );
}

export default Login;