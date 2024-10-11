"use client";

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import Loader from '@/components/ui/loader';

const CheckoutContent = () => {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan');

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan }),
      });

      if (!res.ok) {
        const errorMessage = await res.text();
        console.error('Error response:', errorMessage);
        throw new Error('Failed to create checkout session');
      }

      const { url } = await res.json();
      window.location.href = url;
    } catch (error) {
      console.error('Checkout error:', error);
      alert('An error occurred while processing your request. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Checkout for {plan}</h1>
      <button
        onClick={handleCheckout}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Proceed to Checkout
      </button>
    </div>
  );
};

const Checkout = () => {
  return (
    <Suspense fallback={<Loader />}>
      <CheckoutContent />
    </Suspense>
  );
};

export default Checkout;