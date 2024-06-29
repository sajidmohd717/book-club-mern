import React, { useState, useEffect } from "react";
import axios from "axios";
import { AiOutlineEdit } from "react-icons/ai";
import { BsInfoCircle } from "react-icons/bs";
import { MdOutlineAddBox, MdOutlineDelete } from "react-icons/md";
import "./Home.css";

const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editBook, setEditBook] = useState(null);
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    publishYear: "",
  });
  const [isAdding, setIsAdding] = useState(false);

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

  const handleEditClick = (book) => {
    setEditBook(book);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editBook) {
      setEditBook({ ...editBook, [name]: value });
    } else if (isAdding) {
      setNewBook({ ...newBook, [name]: value });
    }
  };

  const handleCancelClick = () => {
    setEditBook(null);
    setIsAdding(false);
  };

  const handleApplyClick = () => {
    if (editBook) {
      axios
        .put(`http://localhost:3500/books/${editBook._id}`, editBook)
        .then((response) => {
          setBooks(
            books.map((book) => (book._id === editBook._id ? editBook : book))
          );
          setEditBook(null);
        })
        .catch((error) => {
          console.error(error);
        });
    } else if (isAdding) {
      axios
        .post("http://localhost:3500/books", newBook)
        .then((response) => {
          setBooks([...books, response.data]);
          setNewBook({ title: "", author: "", publishYear: "" });
          setIsAdding(false);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const handleAddClick = () => {
    setIsAdding(true);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading books: {error.message}</p>;

  return (
    <div className="container">
      <div className="header">
        <h1>Books List</h1>
        <MdOutlineAddBox className="addbox" onClick={handleAddClick} />
      </div>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Author</th>
            <th>Publish Year</th>
            <th>Operations</th>
          </tr>
        </thead>
        <tbody>
          {isAdding && (
            <tr>
              <td>
                <input
                  type="text"
                  name="title"
                  value={newBook.title}
                  onChange={handleInputChange}
                  placeholder="Enter book title"
                />
              </td>
              <td>
                <input
                  type="text"
                  name="author"
                  value={newBook.author}
                  onChange={handleInputChange}
                  placeholder="Enter author name"
                />
              </td>
              <td>
                <input
                  type="text"
                  name="publishYear"
                  value={newBook.publishYear}
                  onChange={handleInputChange}
                  placeholder="Enter publish year"
                />
              </td>
              <td className="operations">
                <button onClick={handleApplyClick}>Apply</button>
                <button onClick={handleCancelClick}>Cancel</button>
              </td>
            </tr>
          )}
          {books.map((book) => (
            <tr key={book._id}>
              <td>
                {editBook && editBook._id === book._id ? (
                  <input
                    type="text"
                    name="title"
                    value={editBook.title}
                    onChange={handleInputChange}
                  />
                ) : (
                  book.title
                )}
              </td>
              <td>
                {editBook && editBook._id === book._id ? (
                  <input
                    type="text"
                    name="author"
                    value={editBook.author}
                    onChange={handleInputChange}
                  />
                ) : (
                  book.author
                )}
              </td>
              <td>
                {editBook && editBook._id === book._id ? (
                  <input
                    type="text"
                    name="publishYear"
                    value={editBook.publishYear}
                    onChange={handleInputChange}
                  />
                ) : (
                  book.publishYear
                )}
              </td>
              <td className="operations">
                {editBook && editBook._id === book._id ? (
                  <>
                    <button onClick={handleApplyClick}>Apply</button>
                    <button onClick={handleCancelClick}>Cancel</button>
                  </>
                ) : (
                  <>
                    <BsInfoCircle className="bsinfocircle" />
                    <AiOutlineEdit
                      className="aioutlineedit"
                      onClick={() => handleEditClick(book)}
                    />
                    <MdOutlineDelete className="delete" />
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Home;
