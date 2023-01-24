import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const CreateAccountPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const createAccount = async () => {
 try {
    if (password != confirmPassword) {
      setError(" Password and confirm password do not match");
      return;
    }
    await createUserWithEmailAndPassword(getAuth(), email, password).then(response=>{

    });
    navigate("/articles");
  }
  catch(e) {
    setError(e.message);
  }
 
  }


  return (
    <div>
      CreateAccountPage
      {error && <p className="error">{error}</p>}
      <input
        placeholder="your email address"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      />
       <input
        type="password"
        placeholder="your password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      />
      <input
        type="password"
        placeholder="renter your password"
        value={confirmPassword}
        onChange={(e) => {
          setConfirmPassword(e.target.value);
        }}
      />
      <button onClick={createAccount}> Create Account</button>
      <Link to="/login">Already have an account? LOg in here</Link>
    </div>
  );
};

export default CreateAccountPage;
