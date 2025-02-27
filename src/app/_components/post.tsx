"use client";

import { useState, useEffect } from "react";

interface Post {
  id: string; // Assuming there's an ID
  name: string; // The name of the post
  // Add other properties as needed
}

export function LatestPost() {
  const [latestPost, setLatestPost] = useState<Post | null>(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch the latest post
  useEffect(() => {
    const fetchLatestPost = async () => {
      try {
        const response = await fetch('/api/posts/latest'); // Adjust the endpoint as needed
        if (!response.ok) {
          throw new Error('Failed to fetch latest post');
        }
        const data: Post = await response.json(); // Ensure the data is typed correctly
        setLatestPost(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLatestPost();
  }, []);

  // Create a new post
  const createPost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      const newPost: Post = await response.json();
      setLatestPost(newPost); // Update the latest post with the newly created post
      setName(""); // Clear the input field
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xs">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : latestPost ? (
        <p className="truncate">Your most recent post: {latestPost.name}</p>
      ) : (
        <p>You have no posts yet.</p>
      )}
      <form onSubmit={createPost} className="flex flex-col gap-2">
        <input
          type="text"
          placeholder="Title"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-full px-4 py-2 text-black"
        />
        <button
          type="submit"
          className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}