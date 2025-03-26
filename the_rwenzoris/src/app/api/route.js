// app/api/bookings/route.js
import { NextResponse } from 'next/server';
import { db } from '../../../src/services/firebase'; // Adjust path as needed
import { collection, addDoc, getDocs } from 'firebase/firestore';

export async function POST(request) {
  try {
    const newBooking = await request.json();

    // Basic server-side validation
    if (!newBooking.name || !newBooking.email || !newBooking.date || !newBooking.destination) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Add booking to Firestore
    const bookingData = {
      ...newBooking,
      createdAt: new Date().toISOString(),
    };
    const docRef = await addDoc(collection(db, 'bookings'), bookingData);

    return NextResponse.json(
      { message: 'Booking confirmed', booking: { id: docRef.id, ...bookingData } },
      { status: 201 }
    );
  } catch (error) {
    console.error('Booking error:', error);
    return NextResponse.json({ error: 'Failed to process booking' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const querySnapshot = await getDocs(collection(db, 'bookings'));
    const bookings = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(bookings, { status: 200 });
  } catch (error) {
    console.error('Fetch bookings error:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}
