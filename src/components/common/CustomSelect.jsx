import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import { useField } from 'formik';

const CustomSelect = ({ label, options, ...props }) => {
  const [field, meta] = useField(props);
  
  return (
    <FormControl 
      fullWidth 
      variant="outlined" 
      margin="normal"
      error={meta.touched && Boolean(meta.error)}
    >
      <InputLabel>{label}</InputLabel>
      <Select {...field} {...props} label={label}>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {meta.touched && meta.error && (
        <FormHelperText>{meta.error}</FormHelperText>
      )}
    </FormControl>
  );
};

export default CustomSelect;