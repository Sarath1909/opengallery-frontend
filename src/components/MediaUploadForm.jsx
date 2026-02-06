import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  MenuItem,
  Divider
} from "@mui/material";
import { useEffect } from "react";

export default function MediaUploadForm({ onSuccess, onError, onClose }) {
  const [uploadMode, setUploadMode] = useState("url"); // "url" | "device"
  const [thumbnailMode, setThumbnailMode] = useState("default");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: "",
    platform: "OTHERS",
    type: "VIDEO",
    externalUrl: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (formData.platform === "INSTAGRAM" || formData.platform === "FACEBOOK") {
      setThumbnailMode("override"); // force override
    } else if (formData.platform === "YOUTUBE") {
      setThumbnailMode("default"); // or let user choose
    }
  }, [formData.platform]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("No token found. Please log in again.");
        return;
      }

      const payload = new FormData();

      // Build the request object
      const requestObj = {
        title: formData.title,
        description: formData.description,
        platform: formData.platform,
        type: formData.type,
        externalUrl: uploadMode === "url" ? formData.externalUrl : null,
        useDefaultThumbnail: uploadMode === "url" && thumbnailMode === "default",
        tagsCsv: formData.tags // backend can split comma separated tags
      };

      // append JSON "request"
      payload.append(
        "request",
        new Blob([JSON.stringify(requestObj)], { type: "application/json" })
      );

      // if device upload (video file)
      if (uploadMode === "device" && formData.videoFile) {
        payload.append("videoFile", formData.videoFile);
      }

      // if thumbnail override chosen
      if (thumbnailMode === "override" && formData.thumbnailFile) {
        payload.append("thumbnailFile", formData.thumbnailFile);
      }

      // if device upload and thumbnail required
      if (uploadMode === "device" && formData.thumbnailFile) {
        payload.append("thumbnailFile", formData.thumbnailFile);
      }

      // Decide which API to call
      const endpoint =
        uploadMode === "device"
          ? "http://localhost:8080/api/media-assets/upload"
          : "http://localhost:8080/api/media-assets/external-resource";

      const response = await fetch(endpoint,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`, // send token
          },
          body: payload, // form-data payload
        }
      );

      if (response.ok) {
        const data = await response.json();
        onSuccess("Media submitted successfully!");
      } else {
        const err = await response.json();
        onError(err.error || "Media submission failed!");
      }
    } catch (error) {
      onError("Error submitting media: " + error.message);
    }
  };

  return (
    <Card sx={{ maxWidth: 600, mx: "auto", mt: 5, p: 2 }}>
      <CardContent component="form" onSubmit={handleSubmit}>
        <Typography variant="h5" gutterBottom>
          Add Media
        </Typography>

        {/* Upload Source */}
        <FormControl component="fieldset" fullWidth sx={{ mb: 3 }}>
          <FormLabel>Media Source</FormLabel>
          <RadioGroup
            row
            value={uploadMode}
            onChange={(e) => setUploadMode(e.target.value)}
          >
            <FormControlLabel
              value="url"
              control={<Radio />}
              label="Share Media URL"
            />
            <FormControlLabel
              value="device"
              control={<Radio />}
              label="Upload from Device"
            />
          </RadioGroup>
        </FormControl>

        {/* Conditional Fields */}
        {uploadMode === "url" ? (
          <TextField
            name="externalUrl"
            label="Media URL"
            type="url"
            fullWidth
            margin="normal"
            placeholder="Paste YouTube / Instagram / Facebook URL"
            onChange={handleChange}
            required
          />
        ) : (
          <Button variant="outlined" component="label" fullWidth sx={{ my: 1 }}>
            Upload Video
            <input
              hidden
              type="file"
              accept="video/*"
              onChange={(e) =>
                setFormData({ ...formData, videoFile: e.target.files[0] })
              }
            />
          </Button>
        )}

        {/* Common fields */}
        <TextField
          name="title"
          label="Title"
          fullWidth
          margin="normal"
          onChange={handleChange}
          required
        />
        <TextField
          name="description"
          label="Description"
          fullWidth
          margin="normal"
          multiline
          rows={3}
          onChange={handleChange}
        />
        <TextField
          name="tags"
          label="Tags (comma separated)"
          fullWidth
          margin="normal"
          onChange={handleChange}
        />

        {/* Platform Dropdown */}
        <TextField
          select
          label="Platform"
          fullWidth
          margin="normal"
          name="platform"
          value={uploadMode === "device" ? "OTHERS" : formData.platform}
          disabled={uploadMode === "device"}
          onChange={handleChange}
        >
          <MenuItem value="OTHERS">None</MenuItem>
          <MenuItem value="YOUTUBE">YouTube</MenuItem>
          <MenuItem value="FACEBOOK">Facebook</MenuItem>
          <MenuItem value="INSTAGRAM">Instagram</MenuItem>
        </TextField>

        {/* Media Type */}
        <TextField
          select
          label="Media Type"
          fullWidth
          margin="normal"
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
        >
          <MenuItem value="VIDEO">Video</MenuItem>
          <MenuItem value="IMAGE">Image</MenuItem>
        </TextField>

        <Divider sx={{ my: 3 }} />

        {/* Thumbnail Section */}
        {uploadMode === "url" && (
          <FormControl component="fieldset" fullWidth>
            <FormLabel>Thumbnail</FormLabel>
            <RadioGroup
              row
              value={thumbnailMode}
              onChange={(e) => setThumbnailMode(e.target.value)}
            >
              <FormControlLabel
                value="default"
                control={<Radio />}
                label="Default Thumbnail"
                disabled={formData.platform === "INSTAGRAM" || formData.platform === "FACEBOOK"} // disable
              />
              <FormControlLabel
                value="override"
                control={<Radio />}
                label="Override Thumbnail"
                disabled={formData.platform === "INSTAGRAM" || formData.platform === "FACEBOOK"} // disable
              />
            </RadioGroup>
          </FormControl>
        )}

        {thumbnailMode === "override" && (
          <Button variant="outlined" component="label" fullWidth sx={{ mt: 2 }}>
            Upload Thumbnail
            <input
              hidden
              type="file"
              accept="image/*"
              onChange={(e) =>
                setFormData({ ...formData, thumbnailFile: e.target.files[0] })
              }
            />
          </Button>
        )}

        {uploadMode === "device" && (
          <Button variant="outlined" component="label" fullWidth sx={{ mt: 2 }}>
            Upload Thumbnail (required)
            <input
              hidden
              type="file"
              accept="image/*"
              onChange={(e) =>
                setFormData({ ...formData, thumbnailFile: e.target.files[0] })
              }
            />
          </Button>
        )}

        {/* Submit */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 4 }}
        >
          Submit Media
        </Button>
      </CardContent>
    </Card>
  );
}
