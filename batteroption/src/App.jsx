import React, { useState } from "react";
import { auth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Page from "./pages/Page";

function App() {
  const [user] = useAuthState(auth);
  const [localUser, setLocalUser] = useState(null);

  const isLoggedIn = user || localUser;

  return (
    <BrowserRouter>

      <Routes>

        {/* Default Page */}
        <Route path="/" element={<Page />} />

        {/* Login Page */}
        <Route path="/login" element={<Login onLogin={setLocalUser} />} />

        {/* Profile Page */}
        <Route
          path="/profile"
          element={isLoggedIn ? <Profile /> : <Login onLogin={setLocalUser} />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;