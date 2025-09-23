import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div style={{
      minHeight: "80vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center"
    }}>
      <h1 style={{ fontSize: "5rem", marginBottom: "1rem" }}>404</h1>
      <h2 style={{ marginBottom: "1rem" }}>Page Not Found</h2>
      <p style={{ marginBottom: "2rem" }}>
        Sorry, the page you are looking for does not exist.
      </p>
      <Link to="/" style={{
        padding: "0.75rem 1.5rem",
        background: "#007bff",
        color: "#fff",
        borderRadius: "4px",
        textDecoration: "none",
        fontWeight: "bold"
      }}>
        Go to Home
      </Link>
    </div>
  );
};

export default NotFound;
