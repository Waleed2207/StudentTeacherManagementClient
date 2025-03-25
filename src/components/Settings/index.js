import React, { useState, useEffect } from 'react';
import { Typography, Grid, Box, Button, Alert, AlertTitle } from '@mui/material';
import Form from '../Settings/Form';
import NumericField from './NumericField/NumericField';
import { SERVER_URL } from "../../consts";

const Settings = () => {
  const [values, setValues] = useState({
    syn_flood_threshold: 100,
    syn_time_window: 60,
    port_scan_threshold: 20,
    port_scan_time_window: 60,
    icmp_flood_threshold: 100,
    icmp_time_window: 60,
  });

  const [originalValues, setOriginalValues] = useState(values);
  const [isEditing, setIsEditing] = useState(false);
  const [alert, setAlert] = useState({ open: false, severity: '', message: '' });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/api-settings/settings`);
        if (!response.ok) {
          throw new Error('Failed to fetch settings');
        }
        const data = await response.json();
        setValues(data);
        setOriginalValues(data); // Set the original values after fetching
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };

    fetchSettings();
  }, []);

  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (name, value) => {
    setValues(prevValues => ({
      ...prevValues,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const changes = Object.keys(values).filter(key => values[key] !== originalValues[key]);

    if (changes.length === 0) {
      setAlert({ open: true, severity: 'warning', message: 'You have not updated anything' });
      setIsEditing(false);
      return;
    }

    try {
      const response = await fetch(`${SERVER_URL}/api-settings/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Failed to update settings');
      }

      const data = await response.json();
      console.log('Settings updated:', data);

      const updatedFields = changes.map(key => `${key.replace(/_/g, ' ')}: ${originalValues[key]} -> ${values[key]}`).join(', ');

      setAlert({ open: true, severity: 'success', message: `Settings updated successfully! Updated fields: ${updatedFields}` });
      setOriginalValues(values); // Update the original values to the new values
      setIsEditing(false);
    } catch (error) {
      console.error('Error:', error);
      setAlert({ open: true, severity: 'error', message: 'Failed to update settings!' });
    }
  };

  const handleCloseAlert = () => {
    setAlert({ open: false, severity: '', message: '' });
  };

  return (
    <>
      <Typography variant="h4" mb={3}>Settings</Typography>
      {alert.open && (
        <Alert
          variant="filled"
          severity={alert.severity}
          onClose={handleCloseAlert}
          sx={{ color: 'white', my: 3 }}
        >
          <AlertTitle>{alert.severity === 'success' ? 'Success' : alert.severity === 'warning' ? 'Warning' : 'Error'}</AlertTitle>
          {alert.message}
        </Alert>
      )}
      <Form handler={handleSubmit}>
        {Object.entries(values).map(([key, value]) => (
          <Grid item xs={12} sm={6} key={key}>
            <NumericField 
              name={key} 
              defaultValue={value} 
              disabled={!isEditing}
              onChange={handleChange}
            />
          </Grid>
        ))}
        <Grid item xs={12}>
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              color="primary"
              onClick={isEditing ? handleSubmit : handleToggleEdit}
              sx={{ width: 100 }}
            >
              {isEditing ? 'Save' : 'Edit'}
            </Button>
          </Box>
        </Grid>
      </Form>
    </>
  );
};

export default Settings;
