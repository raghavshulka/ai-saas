"use client";

import { CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

const SuccessPage = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-green-100">
      <CheckCircle className="w-20 h-20 text-green-600" />
      <h1 className="text-4xl font-bold text-green-700 mt-4">Payment Successful!</h1>
      <p className="text-lg text-gray-700 mt-2">Thank you for your purchase.</p>

      <button
        className="mt-6 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
        onClick={() => router.push('/')}
      >
        Go to Dashboard
      </button>
    </div>
  );
};

export default SuccessPage;
