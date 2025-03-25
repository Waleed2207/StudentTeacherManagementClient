import React from "react";
import { Backdrop, CircularProgress } from "@mui/material";
import PropTypes from "prop-types";
const LoadingIndicator = ({ isLoading }) => {
  return (
    <Backdrop sx={{ color: "#fff", zIndex: 2000 }} open={isLoading}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};
LoadingIndicator.propTypes = {
    isLoading: PropTypes.bool.isRequired, 
  };

export default LoadingIndicator;
