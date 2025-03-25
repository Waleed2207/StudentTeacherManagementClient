import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Button,
  Grid,
} from '@mui/material';

const AddAssignmentDialog = ({ open, onClose, onChange, onSubmit, newAssignment }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New Assignment</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please enter the details of the new assignment.
        </DialogContentText>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              autoFocus
              margin="dense"
              name="title"
              label="Title"
              type="text"
              fullWidth
              variant="standard"
              value={newAssignment.title}
              onChange={onChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              margin="dense"
              name="description"
              label="Description"
              type="text"
              fullWidth
              variant="standard"
              multiline
              minRows={2}
              value={newAssignment.description}
              onChange={onChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              margin="dense"
              name="courseName"
              label="Course Name"
              type="text"
              fullWidth
              variant="standard"
              value={newAssignment.courseName}
              onChange={onChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              margin="dense"
              name="deadline"
              label="Deadline (optional)"
              type="datetime-local"
              fullWidth
              variant="standard"
              value={newAssignment.deadline}
              onChange={onChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onSubmit} color="primary">
          Add Assignment
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddAssignmentDialog;
