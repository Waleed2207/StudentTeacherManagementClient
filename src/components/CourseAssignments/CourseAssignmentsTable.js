// CourseAssignmentsTable.jsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  Typography,
  Box,
  Collapse,
  Alert,
  Button,
  Backdrop,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import DataTable from '../../components/DataTable';
import { SERVER_URL } from '../../consts';
import { useAuth } from '../../context/AuthContext';
import moment from 'moment';

const CourseAssignmentsTable = () => {
  const { isAuthenticated } = useAuth();
  const { teacherId, courseName } = useParams();
  const navigate = useNavigate();

  const [assignments, setAssignments] = useState([]);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [openCollapse, setOpenCollapse] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openBackdrop, setOpenBackdrop] = useState(false);

  const [openDialog, setOpenDialog] = useState(false);
  const [currentAssignmentId, setCurrentAssignmentId] = useState(null);
  const [submissionContent, setSubmissionContent] = useState('');

  const columns = [
    // { field: 'id', headerName: 'ID', flex: 1 },
    { field: 'title', headerName: 'Title', flex: 2 },
    { field: 'description', headerName: 'Description', flex: 3 },
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
      field: 'grade',
      headerName: 'Grade',
      flex: 1,
      renderCell: (params) =>
        params.value !== null && params.value !== undefined ? params.value : 'No Grade Given'
    },
    {
      field: 'content',
      headerName: 'Your Submission',
      flex: 3,
      renderCell: (params) => (
        params.value ? (
          <Box
            sx={{
              backgroundColor: '#bde8c2',
              p: 1,
              borderRadius: 1,
              fontStyle: 'italic',
              whiteSpace: 'pre-wrap'
            }}
          >
            {params.value}
          </Box>
        ) : (
          <Typography color="text.secondary" fontStyle="italic">
            No Submission
          </Typography>
        )
      )
    },    
    {
      field: 'submit',
      headerName: 'Submit Assignment',
      flex: 2,
      renderCell: (params) => {
        const now = moment();
        const deadline = moment(params.row.deadline);
        const isDeadlinePassed = deadline.isBefore(now);
        const isSubmitted = params.row.grade !== null && params.row.grade !== undefined;
        
        return (
          <Button
            variant="contained"
            size="small"
            onClick={() => handleOpenDialog(params.row.id)}
            disabled={isSubmitted || isDeadlinePassed}
          >
            {isSubmitted ? 'Submitted' : isDeadlinePassed ? 'Deadline Passed' : 'Submit'}
          </Button>
        );
      }
    }
  ];

  const fetchAssignments = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${SERVER_URL}/api/assignments/teachers`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await response.json();
      const match = data.find(
        (group) =>
          group.teacherId === teacherId &&
          group.courseName === decodeURIComponent(courseName)
      );

      setAssignments(match?.assignments || []);
    } catch (err) {
      setError('Failed to load assignments');
      setOpenCollapse(true);
    } finally {
      setIsLoading(false);
    }
  }, [teacherId, courseName]);

  useEffect(() => {
    if (isAuthenticated) fetchAssignments();
  }, [isAuthenticated, fetchAssignments]);


  const handleOpenDialog = (assignmentId) => {
    setCurrentAssignmentId(assignmentId);
    setSubmissionContent('');
    setOpenDialog(true);
  };

  const handleSubmitAssignment = async () => {
    try {
      setOpenBackdrop(true);
      if (!submissionContent.trim()) throw new Error("Submission content can't be empty");

      const token = localStorage.getItem('token');
      const response = await fetch(`${SERVER_URL}/api/submissions/${currentAssignmentId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ content: submissionContent })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Submission failed');
      }

      const result = await response.json();
      setMessage(result.message);
      setError(null);
      setOpenCollapse(true);
      fetchAssignments(); // Refresh after submission
    } catch (err) {
      setError(err.message);
      setOpenCollapse(true);
    } finally {
      setOpenBackdrop(false);
      setOpenDialog(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Assignments for Course: {decodeURIComponent(courseName)}
      </Typography>

      <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        Back to Courses
      </Button>

      <Collapse in={openCollapse}>
        <Alert
          severity={error ? 'error' : 'success'}
          onClose={() => setOpenCollapse(false)}
          sx={{ mb: 2 }}
        >
          {error || message}
        </Alert>
      </Collapse>

      <DataTable
        data={assignments}
        columns={columns}
        loading={isLoading}
        disableDelete
        disableUpdate
      />

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Submit Assignment</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Submission Content"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={submissionContent}
            onChange={(e) => setSubmissionContent(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmitAssignment} variant="contained">Submit</Button>
        </DialogActions>
      </Dialog>

      <Backdrop sx={{ color: '#fff', zIndex: 2000 }} open={openBackdrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};

export default CourseAssignmentsTable;
