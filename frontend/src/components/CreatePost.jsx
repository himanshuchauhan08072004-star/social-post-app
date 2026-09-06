import { useRef, useState } from "react";
import { Box, Avatar, TextField, Button, IconButton, Paper } from "@mui/material";
import ImageRoundedIcon from "@mui/icons-material/ImageRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useAuth } from "../context/AuthContext";
import { createPostRequest } from "../services/postService";
import { colorForName, initialsFor } from "../utils/avatarColor";

const CreatePost = ({ onPostCreated, onError, composerRef }) => {
  const { user } = useAuth();
  const fileInputRef = useRef(null);
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [focused, setFocused] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text.trim() && !imageFile) {
      onError("Write something or attach an image to post.");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("text", text.trim());
      if (imageFile) formData.append("image", imageFile);

      const data = await createPostRequest(formData);
      onPostCreated(data.post);

      setText("");
      removeImage();
      setFocused(false);
    } catch (err) {
      onError(err.response?.data?.message || "Could not create the post. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const canPost = (text.trim() || imageFile) && !submitting;

  return (
    <Paper
      ref={composerRef}
      className={focused ? "composer-card composer-card--active" : "composer-card"}
      component="form"
      onSubmit={handleSubmit}
      elevation={0}
    >
      <Box sx={{ display: "flex", gap: 1.5 }}>
        <Avatar className="user-avatar composer-avatar" style={{ background: colorForName(user?.name) }}>
          {initialsFor(user?.name)}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <TextField
            fullWidth
            multiline
            minRows={focused || text ? 3 : 1}
            maxRows={10}
            placeholder="What's on your mind?"
            variant="standard"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onFocus={() => setFocused(true)}
            InputProps={{ disableUnderline: true }}
            className="composer-input"
            inputProps={{ "aria-label": "Write a post" }}
          />

          {preview && (
            <Box className="composer-preview">
              <img src={preview} alt="Selected attachment preview" />
              <IconButton
                size="small"
                className="remove-image-btn"
                onClick={removeImage}
                aria-label="Remove selected image"
              >
                <CloseRoundedIcon fontSize="small" />
              </IconButton>
            </Box>
          )}

          <Box className="composer-actions">
            <Button
              component="label"
              startIcon={<ImageRoundedIcon />}
              className="attach-btn"
              size="small"
            >
              Photo
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleFileChange}
                aria-label="Attach an image"
              />
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={!canPost}
              className="post-btn"
              disableElevation
            >
              {submitting ? "Posting…" : "Post"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default CreatePost;
