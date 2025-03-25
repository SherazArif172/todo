import React from "react";
import TextField from "@mui/material/TextField";

const CustomInput = ({
  label = "",
  error = false,
  helperText = "",
  fullWidth = true,
  size = "small",
  variant = "outlined",
  value = "",
  onChange,
  placeholder = "write your todo here",
  className = "",
  ...props
}) => {
  return (
    <TextField
      label={label}
      error={error}
      helperText={helperText}
      fullWidth={fullWidth}
      size={size}
      variant={variant}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
      {...props}
    />
  );
};

export default CustomInput;
