import React from "react";
import TextField from "@mui/material/TextField";

const CustomizedInput = (props) => {
  return (
    <TextField
      margin="normal"
      InputLabelProps={{ style: { color: "gold" } }} // Label dorado
      name={props.name}
      label={props.label}
      type={props.type}
      value={props.value}
      onChange={props.onChange}
      InputProps={{
        style: {
          width: "400px",
          borderRadius: 10,
          fontSize: 20,
          color: "gold", // Texto dorado
          caretColor: "gold", // Cursor dorado
        },
      }}
      sx={{
        "& .MuiInputLabel-root": { color: "gold" }, // label normal
        "& .MuiInputLabel-root.Mui-focused": { color: "gold" }, // label focus
        "& .MuiOutlinedInput-root": {
          "& fieldset": { borderColor: "gold" }, // borde normal
          "&:hover fieldset": { borderColor: "#d4af37" }, // borde hover
          "&.Mui-focused fieldset": { borderColor: "gold" }, // borde focus
        },
      }}
    />
  );
};

export default CustomizedInput;
