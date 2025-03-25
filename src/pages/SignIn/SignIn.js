import React from "react";
import PropTypes from "prop-types";
import {useAuth} from "../../context/AuthContext";
import SignInForm from "../../components/SignInForm/SignInForm";
import classes from "./SignIn.module.scss";  

const SignIn = ({ onSignInSuccess }) => {
  const { handleSignIn } = useAuth();

  const handleLogin = (token, user) => {
    handleSignIn(token, user); // Update context
    onSignInSuccess(token, user); // Notify parent component
  };

  return (
    <div className={classes.container}>
      <SignInForm onSignIn={handleLogin} />
    </div>
  );
};

SignIn.propTypes = {
  onSignInSuccess: PropTypes.func.isRequired,
};

export default SignIn;