import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, CardActionArea } from '@mui/material';
import { SERVER_URL } from '../../consts';
import { useAuth } from '../../context/AuthContext';

const Courses = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [courses, setCourses] = useState([]);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${SERVER_URL}/api/assignments/teachers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch courses');

      const data = await response.json();
      setCourses(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchCourses();
    }
  }, [isAuthenticated]);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Courses
      </Typography>
      <Grid container spacing={3}>
        {courses.map((course, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ borderRadius: 4, boxShadow: 3 }}>
              <CardActionArea
                onClick={() =>
                  navigate(`/courses/${course.teacherId}/${encodeURIComponent(course.courseName)}`, {
                    state: { assignments: course.assignments }
                  })                  
                }
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    color="primary"
                    sx={{ mb: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                  >
                    {course.courseName}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Teacher: {course.teacherName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {course.assignments.length} assignment{course.assignments.length !== 1 ? 's' : ''}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Courses;
