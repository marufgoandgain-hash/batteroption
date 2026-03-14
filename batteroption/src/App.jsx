import Login from "./pages/Login";
import Profile from "./pages/Profile";
import { auth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";

function App() {

  const [user] = useAuthState(auth);

  return (
    <div>
      {user ? <Profile /> : <Login />}
    </div>
  );
}

export default App;