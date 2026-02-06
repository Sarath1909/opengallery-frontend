import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import CategoryTabs from "../components/CategoryTabs";
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { ThemeProvider, createTheme } from "@mui/material/styles";

export default function Home({ isLoggedIn }) {
  const categories = ["All", "YOUTUBE", "INSTAGRAM", "FACEBOOK", "OTHERS"];

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: "#9c27b0", // Purple primary
        light: "#ba68c8",
        dark: "#7b1fa2",
      },
      secondary: {
        main: "#00acc1", // Teal secondary
        light: "#4dd0e1",
        dark: "#00838f",
      },
      background: {
        default: "#0a0a0a",
        paper: "#1a1a1a",
      },
      text: {
        primary: "#ffffff",
        secondary: "#b0bec5",
      },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            background: "linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)",
            borderRadius: "16px",
            border: "1px solid rgba(156, 39, 176, 0.2)",
            transition: "all 0.3s ease-in-out",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: "0 8px 25px rgba(156, 39, 176, 0.3)",
              border: "1px solid rgba(156, 39, 176, 0.5)",
            },
          },
        },
      },
      MuiCardMedia: {
        styleOverrides: {
          root: {
            borderRadius: "12px 12px 0 0",
          },
        },
      },
    },
  });

  const [videos, setVideos] = useState([]);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [playerOpen, setPlayerOpen] = useState(false);

  // Fetch media from backend
  useEffect(() => {
    fetch("http://localhost:8080/api/public/media/getAsset/all") // change ALL → YOUTUBE/FACEBOOK etc.
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch assets");
        return res.json();
      })
      .then((data) => {
        setVideos(data);
      })
      .catch((err) => console.error("Error fetching media:", err));
  }, []);

  const platformMap = {
    All: "all",
    YOUTUBE: "youtube",
    INSTAGRAM: "instagram",
    FACEBOOK: "facebook",
    OTHERS: "others"
  }

  const handleMenuOpen = (event, video) => {
    setMenuAnchor(event.currentTarget);
    setSelectedVideo(video);
  };

  const handleMenuClose = () => setMenuAnchor(null);

  const handleAction = (type) => {
    setActionType(type);
    setConfirmOpen(true);
    handleMenuClose();
  };

  const handleConfirm = () => {
    if (actionType === "delete" || actionType === "hide") {
      setVideos((prev) => prev.filter((v) => v.id !== selectedVideo.id));
    }
    setConfirmOpen(false);
  };

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
    setPlayerOpen(true);
  };

  const extractYouTubeId = (url) => {
    const regExp = /(?:v=|\/)([0-9A-Za-z_-]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  const [selectedCategory, setSelectedCategory] = useState("All");

  const extractInstagramShortcode = (url) => {
    const match = url.match(/instagram\.com\/p\/([^/]+)/);
    return match ? match[1] : null;
  };

  const getInstagramEmbedUrl = (url) => {
    // Match /p/, /reel/, /tv/ URLs
    const match = url.match(/instagram\.com\/(p|reel|tv)\/([^/]+)/);
    if (!match) return null; // invalid URL
    const type = match[1];    // p / reel / tv
    const code = match[2];    // shortcode
    return `https://www.instagram.com/${type}/${code}/embed`;
  };

  // fetch media when selectedCategory changes
  useEffect(() => {
    const platform = platformMap[selectedCategory] || "ALL";
    fetch(`http://localhost:8080/api/public/media/getAsset/${platform}`)
      .then(async (res) => {
        if (res.status === 204) {
          return []; // backend sent NO_CONTENT
        }
        if (!res.ok) {
          throw new Error("Failed to fetch assets");
        }
        return res.json();
      })
      .then((data) => {
        setVideos(data);
      })
      .catch((err) => console.error("Error fetching media:", err));
  }, [selectedCategory]);




  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        sx={{
          height: "87vh",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #0a0a0a 0%, #1a0d1a 50%, #0d1a1a 100%)",
          color: "#fff",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "radial-gradient(circle at 20% 80%, rgba(156, 39, 176, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(0, 172, 193, 0.1) 0%, transparent 50%)",
            pointerEvents: "none",
          },
        }}
      >
        <CategoryTabs 
          categories={categories} 
          selected={selectedCategory} 
          onChange={setSelectedCategory} 
        />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            mt: { xs: "40px", sm: "1px" },
            scrollbarWidth: "none", // Firefox
            "&::-webkit-scrollbar": { display: "none" }, // Chrome, Safari
            position: "relative",
            zIndex: 1,
            padding: { xs: "16px", sm: "24px" },
            backdropFilter: "blur(10px)",
          }}
        >
          <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} justifyContent="center">
            {videos.map((video) => (
              <Grid item xs={12} sm={6} md={3} key={video.id}>
                <Card
                  sx={{
                    height: { xs: 280, sm: 300, md: 340 },
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    cursor: "pointer",
                    position: "relative",
                    overflow: "hidden",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
                      zIndex: 1,
                      pointerEvents: "none",
                    },
                  }}
                  onClick={() => handleVideoClick(video)}
                >
                  <Box sx={{ position: "relative", height: "60%" }}>
                    <CardMedia
                      component="img"
                      height="100%"
                      image={video.externalThumbnailUrl || "/fallback-thumbnail.png"}
                      alt={video.title}
                      sx={{
                        transition: "transform 0.3s ease-in-out",
                        "&:hover": {
                          transform: "scale(1.05)",
                        },
                      }}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.7) 100%)",
                        opacity: 0,
                        transition: "opacity 0.3s ease-in-out",
                        "&:hover": {
                          opacity: 1,
                        },
                      }}
                    />
                  </Box>

                  <CardContent
                    sx={{
                      flexGrow: 1,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      p: 2,
                      position: "relative",
                      zIndex: 2,
                      background: "rgba(26, 26, 26, 0.8)",
                      backdropFilter: "blur(10px)",
                      borderTop: "1px solid rgba(156, 39, 176, 0.2)",
                    }}
                  >
                    <Box>
                      <Typography
                        variant="body1"
                        sx={{ 
                          fontSize: { xs: "0.9rem", sm: "1rem" },
                          fontWeight: 600,
                          background: "linear-gradient(135deg, #ffffff 0%, #b0bec5 100%)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        }}
                      >
                        {video.title}
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1, alignItems: "center", mt: 0.5 }}>
                        <Box
                          sx={{
                            px: 1,
                            py: 0.25,
                            borderRadius: "12px",
                            background: "linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)",
                            fontSize: { xs: "0.65rem", sm: "0.7rem" },
                            fontWeight: 500,
                            color: "white",
                          }}
                        >
                          {video.platform}
                        </Box>
                        <Box
                          sx={{
                            px: 1,
                            py: 0.25,
                            borderRadius: "12px",
                            background: "linear-gradient(135deg, #00acc1 0%, #00838f 100%)",
                            fontSize: { xs: "0.65rem", sm: "0.7rem" },
                            fontWeight: 500,
                            color: "white",
                          }}
                        >
                          {video.status}
                        </Box>
                      </Box>
                    </Box>

                    {isLoggedIn && (
                      <IconButton
                        size="small"
                        sx={{
                          background: "linear-gradient(135deg, rgba(156, 39, 176, 0.2) 0%, rgba(0, 172, 193, 0.2) 100%)",
                          backdropFilter: "blur(10px)",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                          "&:hover": {
                            background: "linear-gradient(135deg, rgba(156, 39, 176, 0.4) 0%, rgba(0, 172, 193, 0.4) 100%)",
                            transform: "scale(1.1)",
                          },
                          transition: "all 0.3s ease-in-out",
                        }}
                        onClick={(e) => {
                          e.stopPropagation(); // prevent triggering video click
                          handleMenuOpen(e, video);
                        }}
                      >
                        <MoreVertIcon sx={{ color: "#fff" }} />
                      </IconButton>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Menu */}
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => handleAction("hide")}>Hide Content</MenuItem>
          <MenuItem onClick={() => handleAction("delete")}>Delete Content</MenuItem>
        </Menu>

        {/* Delete/Hide confirm */}
        <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
          <DialogTitle>Confirm {actionType}</DialogTitle>
          <DialogContent>
            Are you sure you want to {actionType} this content?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmOpen(false)} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleConfirm} variant="contained" color="error">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>

        {/* Video Player */}
        <Dialog
          open={playerOpen}
          onClose={() => setPlayerOpen(false)}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle>{selectedVideo?.title}</DialogTitle>
          <DialogContent dividers>
            {selectedVideo && (
              <>
                {selectedVideo.platform?.toLowerCase() === "youtube" ? (
                  <iframe
                    width="100%"
                    height="400"
                    src={`https://www.youtube.com/embed/${extractYouTubeId(selectedVideo.externalUrl)}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : selectedVideo.platform?.toLowerCase() === "instagram" ? (
                      getInstagramEmbedUrl(selectedVideo.externalUrl) ? (
                        <iframe
                          src={getInstagramEmbedUrl(selectedVideo.externalUrl)}
                          width="100%"
                          height="480"
                          frameBorder="0"
                          allowFullScreen
                        />
                      ) : (
                        <Typography>Video unavailable</Typography>
                      )
                    ) : (
                  <video
                    width="100%"
                    height="auto"
                    controls
                    autoPlay
                    src={selectedVideo.externalUrl}
                  />
                )}
              </>
            )}
            <Typography sx={{ mt: 2 }}>{selectedVideo?.description}</Typography>
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setPlayerOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>

      </Box>
    </ThemeProvider>
  );
}