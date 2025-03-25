import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import { useAuth } from "../../context/AuthContext";
import TableToolbar from './tableToolbar';
import NoRowsOverlay from './NoRowsOverlay';
import DeleteDialog from './DeleteDialog';
import UpdateDialog from './UpdateDialog';;

const DataTable = ({ data, handleDelete, handleUpdate, selectedAssignment, handleUpdateSubmit, columns, reloadHandler, loading }) => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const { user } = useAuth();
  console.log(user.role);

  // Get selected row details
  const selectedRow = rowSelectionModel.length === 1 ? data.find((report) => report.id === rowSelectionModel[0]) : null;

  const handleSelectionChange = (newRowSelectionModel) => {
    setRowSelectionModel(newRowSelectionModel);
  };

  const handleClickDelete = () => {
    setOpenDeleteDialog(true);
  };

  const handleClickUpdate = () => {
      handleUpdate(selectedRow);
      setOpenUpdateDialog(true);
    }
  

  const handleCloseDialogs = () => {
    setOpenDeleteDialog(false);
    setOpenUpdateDialog(false);
  };


  return (
    <Box>
      <DataGrid
        autoHeight
        columns={columns}
        rows={data || []}
        initialState={{
          pagination: { paginationModel: { page: 0, pageSize: 10 } },
        }}
        checkboxSelection={user.role !== 'Student'}
        disableSelectionOnClick
        getRowId={(row) => row.id}
        pageSizeOptions={[10, 25, 50, 100]}
        slots={{
          noResultsOverlay: NoRowsOverlay,
          noRowsOverlay: NoRowsOverlay,
          toolbar: handleDelete || handleUpdate ? TableToolbar : undefined,
        }}
        slotProps={{
          toolbar: (handleDelete || handleUpdate) && user.role !== 'Student'
            ? {
                selectedRowCount: rowSelectionModel.length,
                onDeleteSelected: handleClickDelete,
                onUpdateSelected: handleClickUpdate,
                reloadHandler: reloadHandler,
                loading,
              }
            : undefined,
        }}
        sx={{ "--DataGrid-overlayHeight": "300px" }}
        onRowSelectionModelChange={user.role !== 'Student' ? handleSelectionChange : undefined}
        rowSelectionModel={user.role !== 'Student' ? rowSelectionModel : []}
      />

      {/* Delete Dialog */}
      <DeleteDialog
        open={openDeleteDialog}
        handleClose={handleCloseDialogs}
        handleDelete={handleDelete}
        rowSelectionModel={rowSelectionModel}
      />

      {/* Update Dialog */}
        <UpdateDialog
          open={openUpdateDialog}
          handleClose={handleCloseDialogs}
          handleUpdate={handleUpdateSubmit}
          selectedAssignment={selectedAssignment}
        />
    </Box>
  );
};

export default DataTable;
