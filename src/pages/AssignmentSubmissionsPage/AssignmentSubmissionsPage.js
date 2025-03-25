import React, { useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import {
  Typography,
  Box,
  Button,
  TextField,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import { SERVER_URL } from '../../consts';

const AssignmentSubmissionsPage = () => {
  const { assignmentId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState(location.state?.submissions || []);
  const [gradeInputs, setGradeInputs] = useState({});
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [selectedStudentName, setSelectedStudentName] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState(null);
  const [pendingGrade, setPendingGrade] = useState(null);

  const handleGradeChange = (submissionId, value) => {
    setGradeInputs((prev) => ({
      ...prev,
      [submissionId]: value
    }));
  };

  const openGradeDialog = (submissionId) => {
    const grade = parseFloat(gradeInputs[submissionId]);
    if (isNaN(grade) || grade < 60 || grade > 100) {
      setError("Please enter a valid grade between 60 and 100.");
      return;
    }
  
    const submission = submissions.find((s) => s.id === submissionId);
  
    setSelectedSubmissionId(submissionId);
    setSelectedStudentName(submission?.studentName || "Student");
    setPendingGrade(grade);
    setOpenDialog(true);
  };
  

  const handleConfirmGrade = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${SERVER_URL}/api/submissions/${assignmentId}/grade/${selectedSubmissionId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pendingGrade),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to grade submission.");
      }

      const data = await response.json();
      setMessage(`✅ Submission ${selectedSubmissionId} graded: ${pendingGrade}`);
      setError(null);
      setOpenDialog(false);

      setSubmissions((prev) =>
        prev.map((sub) =>
          sub.id === selectedSubmissionId ? { ...sub, grade: pendingGrade } : sub
        )
      );

      setGradeInputs((prev) => ({
        ...prev,
        [selectedSubmissionId]: ""
      }));

    } catch (err) {
      setError(err.message);
      setOpenDialog(false);
    }
  };

  const handleCancelDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Submissions for Assignment #{assignmentId}
      </Typography>

      <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        Back to Assignments
      </Button>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {message && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      {submissions.length === 0 ? (
        <Typography>No submissions yet.</Typography>
      ) : (
        submissions.map((submission) => (
          <Box key={submission.id} sx={{ mb: 3, p: 2, border: '1px solid #ddd', borderRadius: 2 }}>
            {/* <Typography><strong>Submission ID:</strong> {submission.id}</Typography> */}
            <Typography><strong>Student ID:</strong> {submission.studentId}</Typography>
            <Typography><strong>Student Name:</strong> {submission.studentName || <em style={{ color: '#888' }}>N/A</em>}</Typography>
            <Typography><strong>Content:</strong> {submission.content}</Typography>
            <Typography>
              <strong>Grade:</strong>{" "}
              {submission.grade != null ? submission.grade : <span style={{ fontStyle: "italic", color: "#888" }}>No grade Given</span>}
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
              <TextField
                label="Grade"
                type="number"
                size="small"
                value={gradeInputs[submission.id] || ''}
                onChange={(e) => handleGradeChange(submission.id, e.target.value)}
                inputProps={{ min: 60, max: 100 }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => openGradeDialog(submission.id)}
              >
                Grade
              </Button>
            </Box>
          </Box>
        ))
      )}

      {/* 🔘 Confirm Grade Dialog */}
      <Dialog open={openDialog} onClose={handleCancelDialog}>
        <DialogTitle>Confirm Grade</DialogTitle>
        <DialogContent>
          <DialogContentText>
          Are you sure you want to assign a grade of <strong>{pendingGrade}</strong> to <strong>{selectedStudentName}</strong> (submission #{selectedSubmissionId})?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDialog}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleConfirmGrade}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AssignmentSubmissionsPage;
