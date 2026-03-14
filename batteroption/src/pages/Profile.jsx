import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

function Profile() {

  const [userData, setUserData] = useState(null);

  useEffect(() => {

    const loadUser = async () => {

      const user = auth.currentUser;

      if (!user) return;

      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setUserData(snap.data());
      }

    };

    loadUser();

  }, []);

  if (!userData) return <h2>Loading...</h2>;

  return (
    <div style={{textAlign:"center"}}>

      <h2>User Profile</h2>

    <img src={userData.profileimg} width="100" />

      <h3>{userData.fullname}</h3>

      <p>Email: {userData.gmail}</p>

      <p>Mobile: {userData.mobilenumber}</p>

      <p>Address: {userData.address}</p>

      <p>Date of Birth: {userData.dateofbirth}</p>

  <h1>Please wait for next update</h1>
    </div>

  
  );
}

export default Profile;