import React, { useState } from "react";
import {
  TextField,
  Box,
  MenuItem,
  Button
} from "@mui/material";
import { Save, DeleteSweep , Close } from "@mui/icons-material";


export default function EnrollmentForm({ onSuccess, onError, onClose }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    retypePassword: "",
    roles: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const roleMap = {
    ADMIN: 2,
    SUPER_ADMIN: 1,
    USER: 3
  };

  const reverseRoleMap = {
    2: "ADMIN",
    1: "SUPER_ADMIN",
    3: "USER"
  };

  const handleClear = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      retypePassword: "",
      roles: []
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      console.log(token);
      const response = await fetch("http://localhost:8080/api/admin/enroll", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        onSuccess(`Agent ${data.fullName} enrolled successfully`);
        onClose();
      } else {
        const err = await response.json();
        onError(err.error || "Enrollment failed");
      }
    } catch (err) {
      onError("Error: " + err.message);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
    >
      <TextField label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} required />
      <TextField label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} required />
      <TextField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
      <TextField label="Password" name="password" type="password" value={formData.password} onChange={handleChange} required />
      <TextField label="Retype Password" name="retypePassword" type="password" value={formData.retypePassword} onChange={handleChange} required />

      <TextField
        select  
        label="Role"
        name="roles"
        value={reverseRoleMap[formData.roles[0]?.id] || ""}
        onChange={(e) =>
          setFormData({
            ...formData,
            roles: [{ id: roleMap[e.target.value] }]
          })
        }
        required
      >
        <MenuItem value="ADMIN">Admin</MenuItem>
        <MenuItem value="SUPER_ADMIN">Super Admin</MenuItem>
        <MenuItem value="USER">User</MenuItem>
      </TextField>


      <Box sx={{ display: "flex", gap: 2, mt: 2, flexWrap: "wrap", justifyContent: "center" }}>
        <Button variant="outlined" color="error" onClick={onClose} startIcon={<Close />}>
          Close
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleClear} startIcon={<DeleteSweep />}>
          Clear
        </Button>
        <Button type="submit" variant="contained" color="primary" startIcon={<Save />}>
          Enroll
        </Button>
      </Box>

    </Box>
  );
}
