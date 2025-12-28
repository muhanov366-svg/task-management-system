import React from 'react';
import { TextField } from '@mui/material';
import { useField } from 'formik';

const CustomInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  
  return (
    <TextField
      {...field}
      {...props}
      label={label}
      fullWidth
      variant="outlined"
      error={meta.touched && Boolean(meta.error)}
      helperText={meta.touched && meta.error}
      margin="normal"
    />
  );
};

export default CustomInput;