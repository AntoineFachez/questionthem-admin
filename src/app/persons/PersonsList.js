// filename: app/posts/PostList.js

"use client";

import React, { useState, useEffect } from "react";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { useInView } from "react-intersection-observer"; // Import the hook

export default function PersonsList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastVisibleId, setLastVisibleId] = useState(null); // This is our cursor
  const [hasMore, setHasMore] = useState(true); // Is there more data to fetch?
  const { ref, inView } = useInView({ threshold: 0 }); // Setup the observer

  // Function to fetch a page of posts
  const fetchPosts = async () => {
    if (loading) return;
    setLoading(true);

    // Construct the API URL. If we have a cursor, add it as a query param.
    let url = `https://europe-west1-questionthem-90ccf.cloudfunctions.net/api/persons?limit=10`;
    if (lastVisibleId) {
      url += `&startAfter=${lastVisibleId}`;
    }

    try {
      const response = await fetch(url);
      const data = await response.json();

      // Append new posts to the existing list
      setPosts((prevPosts) => [...prevPosts, ...data.data.docs]);
      // Update the cursor for the next fetch
      setLastVisibleId(data.data.lastVisibleId);
      // If the API returns no new cursor, we've reached the end
      setHasMore(data.data.lastVisibleId !== null);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch the initial batch of posts when the component mounts
  useEffect(() => {
    // Only fetch if not already loading and if there is more data
    if (inView && !loading && hasMore) {
      fetchPosts();
    }
  }, [inView, loading, hasMore]);

  return (
    <Box>
      {posts.map((post) => (
        <Box key={post.id} p={2} borderBottom="1px solid #ccc">
          <Typography variant="h6">{post.title}</Typography>
          <Typography>{post.content}</Typography>
        </Box>
      ))}
      <div ref={ref} />
      {loading && (
        <CircularProgress sx={{ display: "block", margin: "2rem auto" }} />
      )}

      {hasMore && !loading && (
        <Button onClick={fetchPosts} variant="contained" sx={{ mt: 2 }}>
          Load More
        </Button>
      )}

      {!hasMore && (
        <Typography sx={{ mt: 2, textAlign: "center" }}>
          You&apos;ve reached the end!
        </Typography>
      )}
    </Box>
  );
}
