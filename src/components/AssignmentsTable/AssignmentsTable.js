import React, { useState, useEffect } from 'react';
import { Typography, Box, Collapse, Alert, Backdrop, CircularProgress, Button } from '@mui/material';
import DataTable from '../../components/DataTable';
import AddAssignmentDialog from '../AddAssignmentDialog/AddAssignmentDialog';
import { SERVER_URL } from "../../consts";
import { useAuth } from "../../context/AuthContext";
import moment from "moment-timezone";
import LoadingIndicator from "../../components/LoadingIndicator/LoadingIndicator"; 
import { useNavigate } from 'react-router-dom'; // At the top of AssignmentsTable component

const AssignmentsTable = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [openCollapse, setOpenCollapse] = useState(false);
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [message, setMessage] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  const columns = (navigate) => [
    // { field: 'id', headerName: 'ID', flex: 1 },
    { field: 'title', headerName: 'Title', flex: 1 },
    { field: 'description', headerName: 'Description', flex: 2 },
    {
      field: 'deadline',
      headerName: 'Deadline',
      flex: 2,
      renderCell: (params) => {
        const now = moment();
        const deadline = moment(params.value);
        const duration = moment.duration(deadline.diff(now));
  
        if (duration.asMilliseconds() <= 0) return 'Deadline Passed';
  
        const days = Math.floor(duration.asDays());
        const hours = Math.floor(duration.hours());
        const minutes = Math.floor(duration.minutes());
  
        return `${days} days ${hours} hours ${minutes} mins left`;
      }
    },
    {
      field: 'submissions',
      headerName: 'Submissions',
      flex: 1,
      renderCell: (params) => {
        const count = params.value?.length || 0;
        return (
          <span
            onClick={() =>
              navigate(`/assignments/${params.row.id}/submissions`, {
                state: { submissions: params.value },
              })
            }
            style={{ color: '#1976d2', cursor: 'pointer', textDecoration: 'underline' }}
          >
            {count} {count === 1 ? 'Student' : 'Students'}
          </span>
        );
      },
    },
  ];
  
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    deadline: '', 
    courseName: ''
  });
  

  const fetchAssignments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      let url = `${SERVER_URL}/api/assignments`;
      if (user.role === "Admin") {
        url = `${SERVER_URL}/api/assignments/admin`;
      }
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,  
          'Content-Type': 'application/json'
        }
      });
  
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        throw new Error("Unexpected response format: " + text);
      }
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
  
      const data = await response.json();
      console.log("✅ Received assignment data:", data);
      setAssignments(data);
  
    } catch (err) {
      setError(err.message);
      setOpenCollapse(true);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (isAuthenticated) {
      fetchAssignments();
    }
  }, [isAuthenticated]);

  const handleCloseCollapse = () => {
    setOpenCollapse(false);
  };

  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAssignment((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  

  const handleSubmit = async () => {
    try {
      setOpenBackdrop(true);
      setError(null);
  
      const token = localStorage.getItem("token");
  
      // Validate fields
      if (!newAssignment.title || !newAssignment.description) {
        throw new Error("Title and Description are required");
      }
  
      const response = await fetch(`${SERVER_URL}/api/assignments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newAssignment),
      });
      console.log("Token being sent:", token);

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("You are not authorized. Please login again.");
        } else if (response.status === 403) {
          throw new Error("Access denied. Only teachers can create assignments.");
        }
      
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Failed to create assignment");
      }
      
  
      setMessage("Assignment added successfully");
      setOpenCollapse(true);
      handleCloseDialog();
      fetchAssignments(); // Refresh data
      setOpenBackdrop(false);
    } catch (err) {
      setError(err.message);
      setOpenCollapse(true);
    } finally {
      setOpenBackdrop(false);
    }
  };
  

  const handleDelete = async (selectedIds) => {
    try {
      setOpenBackdrop(true); // Show loading indicator
      const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("You must be logged in to delete assignment.");
    }
      // Use Promise.all to delete reports concurrently
      const deleteResponses = await Promise.all(
        selectedIds.map(async (id) => {
          try {
            const response = await fetch(`${SERVER_URL}/api/assignments/${id}`, {
              method: 'DELETE',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            });
  
            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(`Failed to delete assignment ${id}: ${errorData.error}`);
            }
  
            return id; // Return deleted report ID for confirmation
          } catch (err) {
            console.error(`Error deleting assignment ${id}:`, err.message);
            return null; // Ensure continued execution for other reports
          }
        })
      );
  
      // Filter out successfully deleted reports
      const successfullyDeleted = deleteResponses.filter((id) => id !== null);
  
      if (successfullyDeleted.length > 0) {
        setMessage(`Successfully deleted ${successfullyDeleted.length} assignment(s).`);
  
        // Update state without calling fetchReports() if all reports are removed
        setAssignments((prevReports) => {
          const updatedReports = prevReports.filter((report) => !successfullyDeleted.includes(assignments._id));
          return updatedReports.length > 0 ? updatedReports : []; // Ensure empty array if no reports left
        });
      } else {
        setMessage("No assignments were deleted.");
      }
  
      setOpenCollapse(true);
      
      // Only fetch reports if there are reports left to prevent 404
      if (assignments.length - successfullyDeleted.length > 0) {
        await fetchAssignments(); // Refresh only if necessary
      } else {
        setAssignments([]); // Clear reports to show "No reports found"
      }
      
    } catch (err) {
      console.error("Delete error:", err);
      setError(err.message);
      setOpenCollapse(true);
    } finally {
      setOpenBackdrop(false); // Hide loading indicator
    }
  };

  const handleUpdate = async (updatedAssignment) => {
    try {
      setOpenBackdrop(true);
      const token = localStorage.getItem("token");

      const payload = {
        title: updatedAssignment.title,
        description: updatedAssignment.description,
        deadline: new Date(updatedAssignment.deadline).toISOString()
      };

      console.log("📤 Final clean payload:", payload);

      const response = await fetch(`${SERVER_URL}/api/assignments/${updatedAssignment.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update assignment");
      }

      setMessage("Assignment updated successfully.");
      setOpenCollapse(true);
      fetchAssignments();
    } catch (err) {
      console.error("🛑 Update failed:", err);
      setError(err.message);
      setOpenCollapse(true);
    } finally {
      setOpenBackdrop(false);
    }
  };

  const handleOpenUpdateDialog = (assignment) => {
    setSelectedAssignment(assignment);
  };
  return (
    <Box>
      <Typography variant="h4">Assignments</Typography>
      {user.role !== 'Admin' && (
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleClickOpenDialog}
            sx={{ fontWeight: 'bold',  size:'Bold' }}
          >
            Add New Assignment
          </Button>
        </Box>
      )}
      <Collapse in={openCollapse}>
        <Alert variant="filled" severity={error ? 'error' : 'info'} sx={{ color: 'white', my: 3 }} onClose={handleCloseCollapse}>
          {error ? `${error}.` : message}
        </Alert>
      </Collapse>
      <LoadingIndicator isLoading={isLoading} />
      <DataTable  
        data={assignments} 
        columns={columns(navigate)}
        loading={isLoading} 
        handleDelete={handleDelete}  
        handleUpdate={handleOpenUpdateDialog}
        // onUpdateStatus={handleStatusUpdate}
        selectedAssignment={selectedAssignment}      
        handleUpdateSubmit={handleUpdate}
        reloadHandler={fetchAssignments}
        />
      <Backdrop sx={{ color: '#fff', zIndex: 2000 }} open={openBackdrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <AddAssignmentDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onChange={handleChange}
        onSubmit={handleSubmit}
        newAssignment={newAssignment}
      />
    </Box>
  );
};
export default AssignmentsTable; 