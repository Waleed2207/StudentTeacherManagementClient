import React, { useEffect, useState,forwardRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Slide
} from "@mui/material";
// import classes from "./UpdateDialog.module.scss"; // Import styles
import PropTypes from "prop-types";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const UpdateDialog = ({ open, handleClose, handleUpdate, selectedAssignment }) => {


  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: ""
  });

  useEffect(() => {
    if (selectedAssignment) {
      setFormData({
        title: selectedAssignment.title || "",
        description: selectedAssignment.description || "",
        deadline: selectedAssignment.deadline || ""
      });
    }
  }, [selectedAssignment]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    handleUpdate({ ...selectedAssignment, ...formData });
    handleClose();
  };

  return (
    <Dialog open={open}  TransitionComponent={Transition} onClose={handleClose}>
      <DialogTitle>Update Assignment</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          margin="normal"
          name="title"
          label="Title"
          value={formData.title}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          name="description"
          label="Description"
          multiline
          rows={3}
          value={formData.description}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          name="deadline"
          label="Deadline"
          type="datetime-local"
          value={formData.deadline}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>Update</Button>
      </DialogActions>
    </Dialog>
  );
};

UpdateDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleUpdate: PropTypes.func.isRequired,
  selectedAssignment: PropTypes.object,
};

export default UpdateDialog;
