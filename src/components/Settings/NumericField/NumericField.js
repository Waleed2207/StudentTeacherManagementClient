import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';

const NumericField = ({ name, disabled, defaultValue, onChange }) => {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    if (defaultValue !== undefined) {
      setValue(Number(defaultValue));
    }
  }, [defaultValue]);

  const handleChange = (event) => {
    const newValue = event.target.value;
    setValue(newValue);
    if (onChange) {
      onChange(name, newValue);
    }
  };

  return (
    <TextField
      required
      fullWidth
      label={name.replace(/_/g, ' ')}
      name={name}
      type="number"
      InputLabelProps={{
        shrink: true
      }}
      onChange={handleChange}
      disabled={disabled}
      value={value}
    />
  );
};

export default NumericField;
