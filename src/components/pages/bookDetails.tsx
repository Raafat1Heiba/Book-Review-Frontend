import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import AuthContext from "../context/AuthProvider";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import "../styles/book.css";

const BookDetails = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const [book, setBook] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(1);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const axiosPrivate = useAxiosPrivate();
  const { auth }: any = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookDetails = async () => {
      if (!axiosPrivate) return;

      try {
        const bookResponse = await axiosPrivate.get(`/book/${bookId}`);
        setBook(bookResponse.data);

        const reviewsResponse = await axiosPrivate.get(
          `/reviews?bookId=${bookId}`
        );
        setReviews(reviewsResponse.data);
      } catch (error) {
        console.error("Error fetching book details and reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [bookId, axiosPrivate]);

  const handleAddReview = async () => {
    if (!axiosPrivate) return;

    try {
      const response = await axiosPrivate.post("/reviews", {
        bookId,
        reviewText,
        rating,
      });

      setReviews([...reviews, response.data]);
      setReviewText("");
      setRating(1);
      setShowReviewForm(false);
    } catch (error) {
      if (error.response?.status === 401) {
        navigate("/login");
      } else {
        console.error(
          "Error adding review:",
          error.response?.data || error.message
        );
      }
    }
  };

  const handleEditReview = async () => {
    if (!editingReviewId) return;

    try {
      const response = await axiosPrivate.patch(`/reviews/${editingReviewId}`, {
        reviewText,
        rating,
      });

      setReviews(
        reviews.map((review) =>
          review._id === editingReviewId ? response.data : review
        )
      );
      setEditingReviewId(null);
      setReviewText("");
      setRating(1);
      setShowReviewForm(false);
    } catch (error) {
      console.error(
        "Error updating review:",
        error.response?.data || error.message
      );
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!axiosPrivate) return;

    try {
      await axiosPrivate.delete(`/reviews/${reviewId}`);
      setReviews(reviews.filter((review) => review._id !== reviewId));
    } catch (error) {
      console.error(
        "Error deleting review:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="container mt-4">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {book && (
            <div
              className="card mb-4"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.3)",
                border: "none",
                backdropFilter: "blur(10px)",
              }}
            >
              <img
                src={book.coverImageUrl || "default-image-url"}
                alt={book.title}
                className="card-img-top img-fluid"
              />
              <div
                className="card-body"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }}
              >
                <h1 className="card-title">{book.title}</h1>
                <p className="card-text">{book.description}</p>
                <p className="card-text">
                  <small className="text-muted">by {book.author}</small>
                </p>
                <p className="card-text">
                  <strong>Pages:</strong> {book.pages}
                </p>
              </div>
            </div>
          )}

          <h2 className="mt-4 mb-3">Reviews</h2>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div
                key={review._id}
                className="card mb-3 p-3"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.3)",
                  border: "none",
                  backdropFilter: "blur(10px)",
                }}
              >
                <div className="card-body">
                  <p className="card-text">{review.reviewText}</p>
                  <p className="card-text">
                    Rating:{" "}
                    <span className="badge bg-warning text-dark">
                      {review.rating}/5
                    </span>
                  </p>
                  <p className="card-text">
                    <small className="text-muted">
                      Reviewed by: {review.userId.fullName}
                    </small>
                  </p>
                  {auth.userId === review.userId._id && (
                    <div className="review-actions mt-2">
                      <button
                        className="btn btn-primary me-2"
                        onClick={() => {
                          setEditingReviewId(review._id);
                          setReviewText(review.reviewText);
                          setRating(review.rating);
                          setShowReviewForm(true);
                        }}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDeleteReview(review._id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>No reviews yet.</p>
          )}

          <button
            className="btn btn-success mt-3"
            onClick={() => setShowReviewForm(!showReviewForm)}
          >
            {showReviewForm ? "Cancel" : "Add Review"}
          </button>

          {showReviewForm && (
            <div className="mt-3 border rounded p-3 bg-light shadow-sm">
              <textarea
                className="form-control mb-2"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Write your review"
              />
              <label className="form-label">Rating: </label>
              <select
                className="form-select mb-2"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
              <button
                className="btn btn-success"
                onClick={() =>
                  editingReviewId ? handleEditReview() : handleAddReview()
                }
              >
                {editingReviewId ? "Update Review" : "Submit Review"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BookDetails;
