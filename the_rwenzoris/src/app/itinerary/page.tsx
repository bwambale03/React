// app/itinerary/page.js
import BookingSystem from '../../components/BookingSystem';

export default function Itinerary() {
  return (
    <div className="min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-center my-8 text-gray-900">Plan Your Trip</h1>
      <BookingSystem />
    </div>
  );
}
