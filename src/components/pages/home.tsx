import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../../api/axios";
import "../styles/home.css";

const Home = () => {
  const [books, setBooks] = useState<any[]>([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get("/book");
        setBooks(response.data);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div className="home-container">
      <div className="container mt-4">
        <h1 className="mb-4 text-center">Books</h1>
        <div className="row">
          {books.map((book) => (
            <div key={book._id} className="col-md-4 mb-4">
              <div
                className="card book-card border-light shadow-sm"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.3)",
                  border: "none",
                  backdropFilter: "blur(10px)",
                }}
              >
                <Link to={`/book/${book._id}`} className="text-decoration-none">
                  <img
                    src={book.coverImageUrl || "default-image-url"}
                    alt={book.title}
                    className="card-img-top book-img img-fluid"
                  />
                </Link>
                <div
                  className="card-body"
                  style={{ backgroundColor: "rgba(255, 255, 255, 0)" }}
                >
                  <Link
                    to={`/book/${book._id}`}
                    className="text-decoration-none"
                  >
                    <h5
                      className="card-title book-title"
                      style={{ color: "rgba(0, 0, 0, 1)" }}
                    >
                      {book.title}
                    </h5>
                  </Link>
                  <p
                    className="card-text book-description"
                    style={{ color: "rgba(0, 0, 0, 1)" }}
                  >
                    {book.description}
                  </p>
                  <p
                    className="card-text book-author"
                    style={{ color: "rgba(0, 0, 0, 1)" }}
                  >
                    <small>by {book.author}</small>
                  </p>
                  <p
                    className="card-text book-pages"
                    style={{ color: "rgba(0, 0, 0, 1)" }}
                  >
                    <small>Pages: {book.pages}</small>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
