import React, { useState } from "react";
import axios from "axios";
import styles from "./SignInForm.module.scss";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Grid,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Email, Visibility, VisibilityOff, Person } from "@mui/icons-material";
import { SERVER_URL } from "../../consts";
import logo from "../../assets/schoolManagment.png";

const SignInForm = ({ onSignIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("Teacher");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${SERVER_URL}/api/auth/login`, {
        email,
        password,
      });

      if (response.status === 200) {
        console.log("✅ Login Successful, Token Received:", response.data.token);
        
        localStorage.setItem("token", response.data.token); 
        localStorage.setItem("user", JSON.stringify(response.data.user)); 

        axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
        onSignIn(response.data.token, response.data.user);
      }
    } catch (error) {
      console.error("🚨 Sign in failed:", error.response?.data || error);
      setErrorMessage("Invalid email or password");
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
  
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please try again.");
      return;
    }
  
    try {
      const response = await axios.post(`${SERVER_URL}/api/auth/register`, {
        email,
        password,
        role,
        FullName: fullName,
      });
  
      if (response.status === 200) {
        setSuccessMessage("User registered successfully. Please log in.");
        setErrorMessage("");
  
        setTimeout(() => {
          setIsSignUp(false);
          setSuccessMessage("");
        }, 2000);
      }
    } catch (error) {
      console.error("Sign up failed:", error);
      setErrorMessage(error.response?.data?.error || "Failed to register user");
      setSuccessMessage("");
    }
  };
  
  return (
    <Box className={styles.gradientBackground}>
      <Container maxWidth="lg" disableGutters className={styles.container}>
        <Grid container>
          {/* Left Section */}
          <Grid item xs={12} md={6} className={styles.leftSection}>
            <Box textAlign="center" mb={4}>
              <img src={logo} alt="Urban City Logo" className={styles.logo} />
              <Typography variant="h5" fontWeight="bold" color="textDisabled" mt={2}>
                Welcome to School Management
              </Typography>
            </Box>
            {isSignUp ? (
              <>
                <Typography textAlign="center" mb={2}>
                  Create a new account
                </Typography>

                {errorMessage && (
                  <Typography textAlign="center" className={styles.errorMessage} color="error">
                    {errorMessage}
                  </Typography>
                )}

                {successMessage && (
                  <Typography textAlign="center" className={styles.successMessage} color="success">
                    {successMessage}
                  </Typography>
                )}

                <form onSubmit={handleSignUp}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    variant="outlined"
                    margin="normal"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    variant="outlined"
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Role</InputLabel>
                    <Select
                      value={role}
                      label="Role"
                      onChange={(e) => setRole(e.target.value)}
                      required
                    >
                      <MenuItem value="Admin">Admin</MenuItem>
                      <MenuItem value="Teacher">Teacher</MenuItem>
                      <MenuItem value="Student">Student</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    fullWidth
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    variant="outlined"
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <span
                            onClick={() => setShowPassword(!showPassword)}
                            style={{ cursor: "pointer" }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </span>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Confirm Password"
                    type={showPassword ? "text" : "password"}
                    variant="outlined"
                    margin="normal"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <span
                            onClick={() => setShowPassword(!showPassword)}
                            style={{ cursor: "pointer" }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </span>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Box textAlign="center" my={3}>
                    <Button
                      type="submit"
                      variant="contained"
                      className={styles.gradientButton}
                    >
                      SIGN UP
                    </Button>
                  </Box>
                </form>
                <Box textAlign="center" mt={4}>
                  <Button
                    variant="text"
                    onClick={() => setIsSignUp(false)}
                    sx={{
                      marginTop: '16px',
                      textTransform: 'none',
                      fontWeight: 'bold',
                      textDecoration: 'none',
                      color: '#4caf50',
                      border: '1px solid #4caf50',
                      padding: '0.5rem 1rem',
                      display: 'inline-block',
                      textAlign: 'center',
                      borderRadius: '4px',
                      transition: 'background-color 0.3s ease, color 0.3s ease',
                    }}
                  >                  
                    Back to Login
                  </Button>
                </Box>
              </>
            ) : (
              <>
                <Typography textAlign="center" mb={2}>
                  Please login to your account
                </Typography>

                {errorMessage && (
                  <Typography className={styles.errorMessage}>
                    {errorMessage}
                  </Typography>
                )}

                <form onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    label="Email"
                    variant="outlined"
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    variant="outlined"
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </InputAdornment>
                      ),
                    }}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={showPassword}
                        onChange={(e) => setShowPassword(e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Show Password"
                  />

                  <Box textAlign="center" my={3}>
                    <Button
                      type="submit"
                      variant="contained"
                      className={styles.gradientButton}
                    >
                      LOG IN
                    </Button>
                  </Box>
                </form>

                <Box textAlign="center" mt={4}>
                  <Typography variant="body2">Don't have an account?</Typography>
                  <Button
                    variant="text"
                    onClick={() => setIsSignUp(true)}
                    sx={{
                      marginTop: '16px',
                      textTransform: 'none',
                      fontWeight: 'bold',
                      textDecoration: 'none',
                      color: '#4caf50',
                      border: '1px solid #4caf50',
                      padding: '0.5rem 1rem',
                      display: 'inline-block',
                      textAlign: 'center',
                      borderRadius: '4px',
                      transition: 'background-color 0.3s ease, color 0.3s ease',
                    }}
                  >
                    CREATE NEW
                  </Button>
                </Box>
              </>
            )}
          </Grid>

          {/* Right Section */}
          <Grid
            item
            xs={12}
            md={6}
            className={styles.rightSection}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <Typography
              variant="h4"
              fontWeight="bold"
              mb={2}
              textAlign="center"
            >
              Discover the Future of School Management
            </Typography>
            <Typography textAlign="center" maxWidth="400px">
              Simplify school operations with a smart, all-in-one management system.
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default SignInForm;