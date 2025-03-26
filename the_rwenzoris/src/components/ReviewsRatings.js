const ReviewsRatings = ({ reviews }) => {
    return (
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-2">
              <span className="text-yellow-500">★★★★★</span>
              <span className="ml-2 text-gray-700">{review.rating}/5</span>
            </div>
            <p className="text-gray-700">{review.comment}</p>
            <p className="text-sm text-gray-500 mt-2">- {review.user}</p>
          </div>
        ))}
      </div>
    );
  };
  
  export default ReviewsRatings;
  