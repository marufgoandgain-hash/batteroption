import React from "react";
import { googleLogin, facebookLogin } from "../firebase";

function Login() {

  const handleGoogle = async () => {
    await googleLogin();
    alert("Google Login Success");
  };

  const handleFacebook = async () => {
    await facebookLogin();
    alert("Facebook Login Success");
  };

  return (
    <div style={{textAlign:"center",marginTop:"100px"}}>

      <h2>Login Page</h2>

      <button onClick={handleGoogle}>
      <img src="https://www.citypng.com/public/uploads/preview/google-logo-icon-gsuite-hd-701751694791470gzbayltphh.png" alt="login with google" className="google-logo" />
      </button>

      <br/><br/>

      <button onClick={handleFacebook}>
        <img src="https://pnglove.com/data/img/240_osSR.jpg" alt="login with facebook" className="facebook-logo" />
      </button>

    </div>
  );
}

export default Login;