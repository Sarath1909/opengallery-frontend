import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Snackbar,
  Alert
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LoginDialog from "./LoginDialog";
import { InputBase } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import EnrollmentForm from "./EnrollmentForm";
import CloseIcon from "@mui/icons-material/Close";
import MediaUploadForm from "./MediaUploadForm";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SettingsIcon from "@mui/icons-material/Settings";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import PersonIcon from "@mui/icons-material/Person";
import DeleteIcon from "@mui/icons-material/Delete";
import { Collapse, ListItemText, ListItemIcon } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

export default function Navbar({ isLoggedIn, setIsLoggedIn }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [user, setUser] = useState({ firstName: "Firstname", lastName: "Lastname" });
  const [enrollmentOpen, setEnrollmentOpen] = useState(false);
  const [openUpload, setOpenUpload] = useState(false);

  // 🔹 Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info"); // success | error | info

  const open = Boolean(anchorEl);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const [subAnchorEl, setSubAnchorEl] = useState(null);
  const [accountOpen, setAccountOpen] = useState(false);

  const handleLoginClick = () => {
    setLoginOpen(true);
    handleClose();
  };

  const handleEnrollment = () => {
    setEnrollmentOpen(true);
    handleClose();
  };

  const handleMediaUpload = () => {
    setOpenUpload(true);
    handleClose();
  };

  const handleLoginSuccess = (token) => {
    localStorage.setItem("token", token);
    setIsLoggedIn(true);
    setUser({ firstName: "John", lastName: "Doe" }); // demo
    setSnackbarMessage("Login successful");
    setSnackbarOpen(true);
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const response = await fetch("http://localhost:8080/api/auth/logout", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (response.ok) {
          const data = await response.json();
          setSnackbarMessage(data.message || "Logged out successfully");
        } else {
          setSnackbarMessage("Logout failed");
        }
      } else {
        setSnackbarMessage("You were not logged in");
      }

      localStorage.removeItem("token");
      setIsLoggedIn(false);
      setUser({ firstName: "", lastName: "" });
    } catch (err) {
      console.error("Logout failed:", err.message);
      setSnackbarMessage("Logout failed: " + err.message);
    } finally {
      setSnackbarOpen(true);
      handleClose();
    }
  };

  const handleSubOpen = (event) => {
    setSubAnchorEl(event.currentTarget);
  };

  const handleSubClose = () => {
    setSubAnchorEl(null);
  };

  return (
    <>
      <AppBar 
        position="static" 
        elevation={0}
        sx={{
          background: "linear-gradient(135deg, rgba(10, 10, 10, 0.95) 0%, rgba(26, 13, 26, 0.95) 50%, rgba(13, 26, 26, 0.95) 100%)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(156, 39, 176, 0.3)",
          boxShadow: "0 8px 32px rgba(156, 39, 176, 0.2)",
        }}
      >
        <Toolbar sx={{ 
          display: "flex", 
          justifyContent: "space-between",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "linear-gradient(90deg, rgba(156, 39, 176, 0.1) 0%, transparent 50%, rgba(0, 172, 193, 0.1) 100%)",
            pointerEvents: "none",
          },
          zIndex: 1,
        }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: "bold",
              fontSize: "1.5rem",
              background: "linear-gradient(135deg, #9c27b0 0%, #00acc1 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textShadow: "0 0 20px rgba(156, 39, 176, 0.3)",
              position: "relative",
              zIndex: 2,
            }}
          >
             OpenGallery
          </Typography>

          {/* 🔹 Search Bar */}
          <Box
            sx={{
              flex: 1,
              mx: 4,
              display: "flex",
              alignItems: "center",
              maxWidth: 600,
              background: "rgba(26, 26, 26, 0.7)",
              backdropFilter: "blur(15px)",
              border: "1px solid rgba(156, 39, 176, 0.3)",
              borderRadius: "25px",
              overflow: "hidden",
              transition: "all 0.3s ease-in-out",
              position: "relative",
              zIndex: 2,
              "&:hover": {
                border: "1px solid rgba(156, 39, 176, 0.6)",
                boxShadow: "0 0 20px rgba(156, 39, 176, 0.2)",
              },
              "&:focus-within": {
                border: "1px solid rgba(156, 39, 176, 0.8)",
                boxShadow: "0 0 25px rgba(156, 39, 176, 0.3)",
              },
            }}>
          <InputBase
            placeholder="Search videos, creators, platforms..."
            sx={{
              flex: 1, 
              px: 2, 
              py: 0.5, 
              color: "#fff",
              "& .MuiInputBase-input::placeholder": {
                color: "rgba(255, 255, 255, 0.6)",
                opacity: 1,
              },
            }}
          />
          <IconButton 
            sx={{ 
              background: "linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)",
              borderRadius: 0, 
              px: 2,
              "&:hover": {
                background: "linear-gradient(135deg, #ba68c8 0%, #9c27b0 100%)",
                transform: "scale(1.05)",
              },
              transition: "all 0.3s ease-in-out",
            }}
          >
            <SearchIcon sx={{ color: "#fff" }} />
          </IconButton>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2, position: "relative", zIndex: 2 }}>
            {isLoggedIn && (
              <Box
                sx={{
                  px: 2,
                  py: 0.5,
                  borderRadius: "20px",
                  background: "rgba(26, 26, 26, 0.7)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(156, 39, 176, 0.3)",
                }}
              >
                <Typography 
                  variant="body1" 
                  sx={{ 
                    fontWeight: 600,
                    background: "linear-gradient(135deg, #ffffff 0%, #b0bec5 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {user.firstName} {user.lastName}
                </Typography>
              </Box>
            )}

            <IconButton 
              onClick={handleMenu} 
              sx={{ 
                background: "linear-gradient(135deg, rgba(156, 39, 176, 0.2) 0%, rgba(0, 172, 193, 0.2) 100%)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                "&:hover": {
                  background: "linear-gradient(135deg, rgba(156, 39, 176, 0.4) 0%, rgba(0, 172, 193, 0.4) 100%)",
                  transform: "scale(1.1)",
                  boxShadow: "0 0 20px rgba(156, 39, 176, 0.4)",
                },
                transition: "all 0.3s ease-in-out",
              }}
            >
              <AccountCircle sx={{ fontSize: 36, color: "#fff" }} /> 
            </IconButton>
          </Box>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            sx={{
              "& .MuiPaper-root": {
                background: "rgba(26, 26, 26, 0.95)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(156, 39, 176, 0.3)",
                borderRadius: "12px",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
                mt: 1,
                minWidth: 200,
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: "linear-gradient(135deg, rgba(156, 39, 176, 0.1) 0%, rgba(0, 172, 193, 0.1) 100%)",
                  borderRadius: "12px",
                  pointerEvents: "none",
                },
              },
              "& .MuiMenuItem-root": {
                position: "relative",
                zIndex: 1,
                color: "#fff",
                borderRadius: "8px",
                margin: "2px 4px",
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  background: "linear-gradient(135deg, rgba(156, 39, 176, 0.3) 0%, rgba(0, 172, 193, 0.3) 100%)",
                  transform: "translateX(4px)",
                },
              },
              "& .MuiListItemIcon-root": {
                color: "#9c27b0",
                minWidth: "36px",
              },
            }}
          >
            {!isLoggedIn && (
              <MenuItem 
                onClick={handleLoginClick}
                sx={{
                  "&:hover .MuiListItemIcon-root": {
                    color: "#00acc1",
                    transform: "scale(1.1)",
                  },
                }}
              >
                <ListItemIcon>
                  <LoginIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="Login" 
                  sx={{
                    "& .MuiListItemText-primary": {
                      fontWeight: 500,
                    },
                  }}
                />
              </MenuItem>
            )}

            {isLoggedIn && (
  <>
    <MenuItem 
      onClick={handleEnrollment}
      sx={{
        "&:hover .MuiListItemIcon-root": {
          color: "#00acc1",
          transform: "scale(1.1)",
        },
      }}
    >
      <ListItemIcon>
        <PersonAddIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText 
        primary="Enroll Agent" 
        sx={{
          "& .MuiListItemText-primary": {
            fontWeight: 500,
          },
        }}
      />
    </MenuItem>

    <MenuItem 
      onClick={handleMediaUpload}
      sx={{
        "&:hover .MuiListItemIcon-root": {
          color: "#00acc1",
          transform: "scale(1.1)",
        },
      }}
    >
      <ListItemIcon>
        <CloudUploadIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText 
        primary="Upload Video" 
        sx={{
          "& .MuiListItemText-primary": {
            fontWeight: 500,
          },
        }}
      />
    </MenuItem>

    {/* Inline Sub-menu */}
    <MenuItem 
      onClick={() => setAccountOpen(prev => !prev)}
      sx={{
        "&:hover .MuiListItemIcon-root": {
          color: "#00acc1",
          transform: "scale(1.1)",
        },
      }}
    >
      <ListItemIcon>
        <SettingsIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText 
        primary="Account Settings" 
        sx={{
          "& .MuiListItemText-primary": {
            fontWeight: 500,
          },
        }}
      />
      <Box
        sx={{
          color: accountOpen ? "#00acc1" : "#9c27b0",
          transition: "all 0.3s ease-in-out",
          transform: accountOpen ? "rotate(180deg)" : "rotate(0deg)",
        }}
      >
        {accountOpen ? <ArrowDropDownIcon fontSize="small" /> : <ArrowRightIcon fontSize="small" />}
      </Box>
    </MenuItem>

    <Collapse in={accountOpen} timeout="auto" unmountOnExit>
      <MenuItem 
        onClick={() => console.log("Profile clicked")}
        sx={{
          ml: 2,
          borderLeft: "2px solid rgba(156, 39, 176, 0.5)",
          "&:hover": {
            borderLeft: "2px solid #9c27b0",
          },
          "&:hover .MuiListItemIcon-root": {
            color: "#00acc1",
            transform: "scale(1.1)",
          },
        }}
      >
        <ListItemIcon>
          <PersonIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText 
          primary="Profile" 
          sx={{
            "& .MuiListItemText-primary": {
              fontWeight: 500,
              fontSize: "0.9rem",
            },
          }}
        />
      </MenuItem>
      <MenuItem 
        onClick={() => console.log("Delete Account clicked")}
        sx={{
          ml: 2,
          borderLeft: "2px solid rgba(156, 39, 176, 0.5)",
          "&:hover": {
            borderLeft: "2px solid #f44336",
            background: "rgba(244, 67, 54, 0.1)",
          },
          "&:hover .MuiListItemIcon-root": {
            color: "#f44336",
            transform: "scale(1.1)",
          },
        }}
      >
        <ListItemIcon>
          <DeleteIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText 
          primary="Delete Account" 
          sx={{
            "& .MuiListItemText-primary": {
              fontWeight: 500,
              fontSize: "0.9rem",
            },
          }}
        />
      </MenuItem>
    </Collapse>

    <Box sx={{ borderTop: "1px solid rgba(156, 39, 176, 0.3)", mt: 1, pt: 1 }} />
    
    <MenuItem 
      onClick={handleLogout}
      sx={{
        "&:hover": {
          background: "rgba(244, 67, 54, 0.1)",
        },
        "&:hover .MuiListItemIcon-root": {
          color: "#f44336",
          transform: "scale(1.1)",
        },
      }}
    >
      <ListItemIcon>
        <LogoutIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText 
        primary="Logout" 
        sx={{
          "& .MuiListItemText-primary": {
            fontWeight: 500,
          },
        }}
      />
    </MenuItem>
  </>
)}
          </Menu>

        </Toolbar>
      </AppBar>

      <LoginDialog
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Snackbar for messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ 
            width: "100%",
            background: "rgba(26, 26, 26, 0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(156, 39, 176, 0.3)",
            borderRadius: "12px",
            color: "#fff",
            "& .MuiAlert-icon": {
              color: snackbarSeverity === "success" ? "#00acc1" : snackbarSeverity === "error" ? "#f44336" : "#9c27b0",
            },
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>


      <Dialog
  open={enrollmentOpen}
  onClose={() => setEnrollmentOpen(false)}
  fullWidth
  maxWidth="sm"
>
  <DialogTitle>Enroll Agent</DialogTitle>
  <DialogContent>
    <EnrollmentForm
      onSuccess={(msg) => {
        setSnackbarMessage(msg);
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        setEnrollmentOpen(false)
      }}
      onError={(msg) => {
        setSnackbarMessage(msg);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }}
      onClose={() => setEnrollmentOpen(false)}
    />
  </DialogContent>
</Dialog>

{/* Upload Dialog */}
      <Dialog open={openUpload} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          Upload Video
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <MediaUploadForm />
        </DialogContent>
      </Dialog>

      <Dialog open={openUpload} onClose={() => setOpenUpload(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Upload Video
          <IconButton
            aria-label="close"
            onClick={() => setOpenUpload(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <MediaUploadForm
            onSuccess={(msg) => {
              setSnackbarMessage(msg);
              setSnackbarSeverity("success");
              setSnackbarOpen(true);
              setOpenUpload(false); // close dialog on success
            }}
            onError={(msg) => {
              setSnackbarMessage(msg);
              setSnackbarSeverity("error");
              setSnackbarOpen(true);
            }}
          />
        </DialogContent>
      </Dialog>
    </>

    
  );
}