import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Card,
  CardContent,
  TextField,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  BottomNavigation,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import axios from "axios";
import "../../src/App.css";

const PostManagementPage = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedQuery = localStorage.getItem("searchQuery");
    if (savedQuery) {
      setSearchQuery(savedQuery);
    }

    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          "https://jsonplaceholder.typicode.com/posts"
        );
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    localStorage.setItem("searchQuery", searchQuery);
  }, [searchQuery]);

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.body.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenDialog = (post) => {
    setSelectedPost(post);

    const fetchComments = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `https://jsonplaceholder.typicode.com/posts/${post.id}/comments`
        );
        setComments(response.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedPost(null);
    setComments([]);
  };

  const handleDeletePost = (post) => {
    const deletePost = async () => {
      setIsLoading(true);
      try {
        await axios.delete(
          `https://jsonplaceholder.typicode.com/posts/${post.id}`
        );

        setIsDialogOpen(false);
        setPosts((prevPosts) => prevPosts.filter((p) => p.id !== post.id));
      } catch (error) {
        console.error("Error deleting post:", error);
      } finally {
        setIsLoading(false);
      }
    };

    deletePost();
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div>
      <AppBar position="sticky" color="default">
        <Toolbar>
          <Typography variant="h6">Simple Post Management page</Typography>
          <div
            style={{
              position: "relative",
              flexGrow: 1,
              display: "flex",
              alignItems: "center",
              minHeight: "56px",
            }}
          >
            <TextField
              label="Search Posts"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              fullWidth
            />
            {searchQuery && (
              <IconButton
                style={{
                  position: "absolute",
                  top: "50%",
                  right: "8px",
                  transform: "translateY(-50%)",
                }}
                onClick={clearSearch}
              >
                <ClearIcon />
              </IconButton>
            )}
          </div>
        </Toolbar>
      </AppBar>

      {isLoading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <CircularProgress color="success" />
        </div>
      ) : filteredPosts.length === 0 ? (
        <Typography
          variant="h5"
          style={{ textAlign: "center", margin: "16px" }}
        >
          No results found.
        </Typography>
      ) : (
        filteredPosts.map((post) => (
          <Card
            key={post.id}
            style={{ marginBottom: "16px" }}
            onClick={() => handleOpenDialog(post)}
          >
            <CardContent>
              <Typography
                variant="h6"
                component="div"
                fontFamily="serif"
                align="center"
              >
                {post.title}
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                fontFamily="sans-serif"
                align="inherit"
              >
                {post.body}
              </Typography>
            </CardContent>
            <Button
              className="delete-button"
              onClick={(e) => {
                e.stopPropagation();
                handleDeletePost(post);
              }}
            >
              Delete
            </Button>
          </Card>
        ))
      )}

      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Comments for {selectedPost?.title}</DialogTitle>
        <DialogContent>
          {isLoading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "50vh",
              }}
            >
              <CircularProgress color="success" />
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id}>
                <Typography variant="subtitle2">{comment.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {comment.body}
                </Typography>
              </div>
            ))
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => handleDeletePost(selectedPost)}
            color="primary"
          >
            Delete Post
          </Button>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <BottomNavigation position="sticky" color="default">
        <Toolbar>
          <Typography variant="h6">Simple Post Management page</Typography>
          <div
            style={{
              position: "relative",
              flexGrow: 1,
              display: "flex",
              alignItems: "center",
              minHeight: "56px",
            }}
          ></div>
        </Toolbar>
      </BottomNavigation>
    </div>
  );
};

export default PostManagementPage;
