import { useContext, useEffect, useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import AuthContext from "../context/AuthProvider";
import { FaEdit, FaTrash } from "react-icons/fa";
import "../styles/user.css";

const User = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [editingReview, setEditingReview] = useState<any | null>(null);
  const [newReviewText, setNewReviewText] = useState<string>("");
  const axiosPrivate = useAxiosPrivate();
  const { auth }: any = useContext(AuthContext);

  useEffect(() => {
    const fetchUserReviews = async () => {
      if (!axiosPrivate || !auth.userId) {
        console.log("User ID or axios instance not available");
      }

      console.log("Fetching user reviews...");
      try {
        const response = await axiosPrivate.get("/reviews/user-reviews");
        console.log("Response received");
        setReviews(response.data);
      } catch (error) {
        console.error("Error fetching user reviews:", error);
      }
    };

    fetchUserReviews();
  }, [auth.userId, axiosPrivate]);

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

  const handleEditClick = (review: any) => {
    setEditingReview(review);
    setNewReviewText(review.reviewText);
  };

  const handleUpdateReview = async () => {
    if (!axiosPrivate || !editingReview) return;

    try {
      await axiosPrivate.patch(`/reviews/${editingReview._id}`, {
        reviewText: newReviewText,
      });
      setReviews(
        reviews.map((review) =>
          review._id === editingReview._id
            ? { ...review, reviewText: newReviewText }
            : review
        )
      );
      setEditingReview(null);
    } catch (error) {
      console.error(
        "Error updating review:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Your Reviews</h1>

      {editingReview && (
        <div className="edit-review-form mb-4">
          <h2>Edit Review</h2>
          <textarea
            className="form-control mb-3"
            value={newReviewText}
            onChange={(e) => setNewReviewText(e.target.value)}
            rows={4}
          />
          <button className="btn btn-primary me-2" onClick={handleUpdateReview}>
            Update
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => setEditingReview(null)}
          >
            Cancel
          </button>
        </div>
      )}

      {reviews.length > 0 ? (
        reviews.map((review) => (
          <div
            key={review._id}
            className="card mb-3"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.3)",
              border: "none",
              backdropFilter: "blur(10px)",
            }}
          >
            <div
              className="card-body"
              style={{ backgroundColor: "rgba(255, 255, 255, 0)" }}
            >
              <h5 className="card-title">Book: {review.bookId?.title}</h5>
              <p className="card-text">{review.reviewText}</p>
              <p className="card-text">
                Rating:{" "}
                <span className="badge bg-warning text-dark">
                  {review.rating}/5
                </span>
              </p>
              <div className="d-flex">
                <button
                  className="btn btn-primary me-2"
                  onClick={() => handleEditClick(review)}
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
            </div>
          </div>
        ))
      ) : (
        <p>You have not written any reviews yet.</p>
      )}
    </div>
  );
};

export default User;
