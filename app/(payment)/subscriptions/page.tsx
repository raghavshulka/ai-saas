"use client"
import { useRouter } from 'next/navigation';

const Subscriptions = () => {
  const router = useRouter();

  const handleSubscription = (plan: string) => {
    router.push(`/checkout?plan=${plan}`);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Choose Your Subscription Plan</h1>
      <div className="space-y-4">
        <button
          onClick={() => handleSubscription('basic')}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Basic Plan - $4.99
        </button>
        <button
          onClick={() => handleSubscription('premium')}
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
        >
          Premium Plan - $9.99
        </button>
      </div>
    </div>
  );
};

export default Subscriptions;
