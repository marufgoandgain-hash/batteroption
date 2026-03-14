import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";

function Profile({ openVideo }) {
  const [userData, setUserData] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Load user data from Firestore
  useEffect(() => {
    const loadUser = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setUserData(data);
        setUsername(data.username || "");
        setPassword(data.password || "");
      }
    };
    loadUser();
  }, []);

  if (!userData) return <h2 style={{ textAlign: "center" }}>Loading...</h2>;

  // Save username/password
  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const ref = doc(db, "users", user.uid);
    await updateDoc(ref, {
      username: username.trim().toLowerCase(),
      password: password.trim()
    });

    alert("Username & Password saved successfully!");
    setUserData({ ...userData, username, password });
  };

  // Logout
  const handleLogout = async () => {
    await signOut(auth);
    alert("Logged out successfully");
    window.location.reload(); // Login page e fire jabe
  };

  return (
    <div style={{ textAlign: "center", maxWidth: "500px", margin: "auto" }}>
      <h2> Profile</h2>

      <img
        src={userData.profileimg || "/defaultProfile.png"}
        width="100"
        alt="Profile"
        style={{ borderRadius: "50%" }}
      />

      <h3>{userData.fullname}</h3>
      <p>Email: {userData.gmail}</p>
      <p>Mobile: {userData.mobilenumber}</p>
      <p>Address: {userData.address}</p>
      <p>Date of Birth: {userData.dateofbirth}</p>

      {/* Username & Password Section */}
      {!userData.username || !userData.password ? (
        <div style={{ marginTop: "20px" }}>
          <h3>Set your Username & Password</h3>

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ padding: "10px", width: "80%", marginBottom: "10px" }}
          />
          <br />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: "10px", width: "80%", marginBottom: "10px" }}
          />
          <br />
          <button
            onClick={handleSave}
            style={{ padding: "10px 20px", marginTop: "10px" }}
          >
            Save
          </button>
        </div>
      ) : (
        <p style={{ marginTop: "20px" }}>
          Username: <strong>{userData.username}</strong>
          <br />
          Password: <strong>{userData.password.replace(/./g, "*")}</strong>
        </p>
      )}

      {/* Open Video Page Button */}
      <button
        onClick={openVideo}
        style={{ marginTop: "20px", padding: "10px 20px" }}
      >
        Open Video Page
      </button>

      <br /><br />

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        style={{
          padding: "10px 20px",
          background: "red",
          color: "white",
          border: "none",
          cursor: "pointer"
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default Profile;