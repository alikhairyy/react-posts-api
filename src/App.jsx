import { useEffect, useState } from "react";

const API_URL = "https://dummyjson.com/posts";

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchPosts = async () => {
      try {
        const response = await fetch(`${API_URL}?limit=10`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setPosts(data.posts);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();

    return () => controller.abort();
  }, []);

  if (loading) return <p style={styles.status}>Loading posts...</p>;
  if (error) return <p style={{ ...styles.status, color: "crimson" }}>Error: {error}</p>;

  return (
    <div style={styles.container}>
      <h1>Posts</h1>
      <ul style={styles.list}>
        {posts.map((post) => (
          <li key={post.id} style={styles.card}>
            <h3 style={styles.title}>{post.id}. {post.title}</h3>
            <p style={styles.body}>{post.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "700px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  list: {
    listStyle: "none",
    padding: 0,
  },
  card: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "12px 16px",
    marginBottom: "12px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
  },
  title: {
    margin: "0 0 8px",
  },
  body: {
    margin: 0,
    color: "#555",
  },
  status: {
    textAlign: "center",
    marginTop: "40px",
  },
};

export default App;