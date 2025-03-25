import { forwardRef } from 'react';

// material-ui
import { Button, Dialog, DialogContent, DialogActions, DialogTitle, DialogContentText, Slide } from '@mui/material';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DeleteDialog = ({ handleDelete, rowSelectionModel, handleClose, open }) => (
  <Dialog open={open} TransitionComponent={Transition} onClose={handleClose} aria-describedby="alert-dialog-slide-description">
    <DialogTitle>{'Confirm Deletion'}</DialogTitle>
    <DialogContent>
      <DialogContentText id="alert-dialog-slide-description">
        Are you sure you want to delete the selected {rowSelectionModel.length === 1 ? 'row' : 'rows'}? This action cannot be undone.
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleClose} color="primary">
        Cancel
      </Button>
      <Button
        onClick={() => {
          handleClose();
          handleDelete(rowSelectionModel);
        }}
        color="secondary"
        sx={{
          '&:hover': {
            backgroundColor: 'red',
            color: '#fff'
          }
        }}
      >
        Delete
      </Button>
    </DialogActions>
  </Dialog>
);

export default DeleteDialog;
