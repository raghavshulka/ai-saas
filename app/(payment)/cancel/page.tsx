"use client";

import { XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

const CancelPage = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-red-100">
      <XCircle className="w-20 h-20 text-red-600" />
      <h1 className="text-4xl font-bold text-red-700 mt-4">Payment Cancelled</h1>
      <p className="text-lg text-gray-700 mt-2">Your payment has been cancelled. Please try again.</p>

      <button
        className="mt-6 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
        onClick={() => router.push('/subscriptions')}
      >
        Back to Subscriptions
      </button>
    </div>
  );
};

export default CancelPage;
