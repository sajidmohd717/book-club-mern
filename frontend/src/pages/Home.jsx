import React, { useState, useEffect } from "react";
import axios from "axios";

const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3500/books")
      .then((response) => {
        setBooks(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading books: {error.message}</p>;

  return (
    <>
      <h1>Books</h1>
      <ul>
        {books.map((book) => (
          <li key={book._id}>{book.title}</li>
        ))}
      </ul>
    </>
  );
};

export default Home;
