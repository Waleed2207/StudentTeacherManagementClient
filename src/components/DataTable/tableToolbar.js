import { useState } from 'react';
import { IconButton, Box, Menu, MenuItem, Typography, ListItemIcon } from '@mui/material';
import ReplayIcon from '@mui/icons-material/Replay';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit'; // ✅ Import Update (Edit) Icon
import MoreVertIcon from '@mui/icons-material/MoreVert';

const ITEM_HEIGHT = 48;

const TableToolbar = ({ selectedRowCount, onDeleteSelected, onUpdateSelected, reloadHandler, loading ,selectedRowStatus}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 1 }}>
      <IconButton onClick={reloadHandler} disabled={loading}>
        <ReplayIcon />
      </IconButton>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? 'menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        disabled={selectedRowCount === 0}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="menu"
        MenuListProps={{ 'aria-labelledby': 'long-button' }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: '20ch'
          }
        }}
      >
        {/* Update Option */}
          <MenuItem
            onClick={() => {
              handleClose();
              onUpdateSelected();
            }}
            disabled={selectedRowCount !== 1 || selectedRowStatus === "resolved"} // ✅ Fix logic
          >
            <ListItemIcon>
              <IconButton disabled={selectedRowCount !== 1 || selectedRowStatus === "resolved"}>
                <EditIcon fontSize="small" />
              </IconButton>
            </ListItemIcon>
            <Typography variant="inherit">Update</Typography>
          </MenuItem>



        {/* Delete Option */}
        <MenuItem
          onClick={() => {
            handleClose();
            onDeleteSelected();
          }}
        >
          <ListItemIcon>
            <IconButton>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </ListItemIcon>
          <Typography variant="inherit">Delete</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default TableToolbar;
