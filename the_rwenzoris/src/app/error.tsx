'use client'; // Marked as a Client Component

import Link from 'next/link';

export default function Custom404() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-blue-900 text-white">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-2xl mt-4">Page Not Found</p>
      <Link href="/" className="mt-6 text-blue-300 hover:text-blue-200">
        Go Back Home
      </Link>
    </div>
  );
}
