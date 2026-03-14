import React, { useState, useEffect } from "react";
import { auth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";

import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Page from "./pages/Page";

function App() {
  const [user] = useAuthState(auth); // Google/Facebook login detection
  const [localUser, setLocalUser] = useState(null); // username/password login detection
  const [openVideoPage, setOpenVideoPage] = useState(false);

  // যদি কোন ইউজার login থাকে (username/password বা Google/Facebook)
  const isLoggedIn = user || localUser;

  return (
    <div>
      {isLoggedIn ? (
        openVideoPage ? (
          <Page />
        ) : (
          <Profile openVideo={() => setOpenVideoPage(true)} />
        )
      ) : (
        <Login onLogin={setLocalUser} />
      )}
    </div>
  );
}

export default App;