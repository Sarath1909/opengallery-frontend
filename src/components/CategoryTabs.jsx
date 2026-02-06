import React, { useState } from "react";
import { Box, Button, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export default function CategoryTabs({ categories, selected, onChange }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        display: "flex",
        overflowX: "auto",
        overflowY: "hidden",
        background: "linear-gradient(135deg, rgba(10, 10, 10, 0.95) 0%, rgba(26, 13, 26, 0.95) 50%, rgba(13, 26, 26, 0.95) 100%)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(156, 39, 176, 0.2)",
        px: 2,
        py: 1.8,
        paddingBottom: isMobile ? 2 : 3,
        gap: { xs: 1, sm: 1.5 },
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": { display: "none" },
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "linear-gradient(90deg, rgba(156, 39, 176, 0.05) 0%, transparent 50%, rgba(0, 172, 193, 0.05) 100%)",
          pointerEvents: "none",
        },
        zIndex: 1,
      }}
    >
      {categories.map((cat, i) => (
        <Button
          key={i}
          onClick={() => onChange(cat)}
          sx={{
            borderRadius: "20px",
            textTransform: "none",
            fontSize: isMobile ? "0.75rem" : "0.9rem",
            px: isMobile ? 2 : 2.5,
            py: isMobile ? 1.5 : 1.8,
            flexShrink: 0,
            position: "relative",
            zIndex: 2,
            background: selected === cat 
              ? "linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)"
              : "rgba(26, 26, 26, 0.7)",
            backdropFilter: "blur(10px)",
            border: selected === cat 
              ? "1px solid rgba(156, 39, 176, 0.8)"
              : "1px solid rgba(156, 39, 176, 0.3)",
            color: selected === cat ? "#fff" : "#b0bec5",
            fontWeight: selected === cat ? 600 : 500,
            boxShadow: selected === cat 
              ? "0 4px 20px rgba(156, 39, 176, 0.4)"
              : "0 2px 10px rgba(0, 0, 0, 0.2)",
            transition: "all 0.3s ease-in-out",
            "&:hover": {
              background: selected === cat 
                ? "linear-gradient(135deg, #ba68c8 0%, #9c27b0 100%)"
                : "rgba(156, 39, 176, 0.2)",
              border: "1px solid rgba(156, 39, 176, 0.6)",
              transform: "translateY(-2px) scale(1.02)",
              boxShadow: selected === cat 
                ? "0 6px 25px rgba(156, 39, 176, 0.5)"
                : "0 4px 15px rgba(156, 39, 176, 0.3)",
              color: "#fff",
            },
            "&:active": {
              transform: "translateY(0px) scale(0.98)",
            },
            ...(selected === cat && {
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
                borderRadius: "20px",
                pointerEvents: "none",
              },
            }),
          }}
        >
          <Box
            component="span"
            sx={{
              position: "relative",
              zIndex: 1,
              ...(selected === cat && {
                background: "linear-gradient(135deg, #ffffff 0%, #e8eaf6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                textShadow: "0 0 10px rgba(255, 255, 255, 0.3)",
              }),
            }}
          >
            {cat}
          </Box>
        </Button>
      ))}
    </Box>
  );
}