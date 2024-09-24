import React, { useState } from 'react';

const pricingPlans = [
  {
    name: 'Basic',
    price: '$10',
    features: ['Feature 1', 'Feature 2', 'Feature 3'],
  },
  {
    name: 'Pro',
    price: '$20',
    features: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4'],
  },
  {
    name: 'Enterprise',
    price: '$30',
    features: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4', 'Feature 5'],
  },
];

const PricingComponent = () => {
  const [isYearly, setIsYearly] = useState(false);

  const toggleSwitch = () => setIsYearly(!isYearly);

  return (
    <div className="flex items-center w-full h-full justify-center p-4 md:p-8 lg:p-12">
      <div className="p-6 rounded-lg shadow-lg w-full md:max-w-2xl lg:max-w-4xl">
        <h1 className="text-3xl font-bold text-center text-white mb-6">
          Pricing Plans
        </h1>
        
        <div className="flex justify-center mb-4">
          <span className="text-white mr-2">Monthly</span>
          <div
            onClick={toggleSwitch}
            className={`${isYearly ? 'bg-blue-600' : 'bg-gray-400'} relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer`}
          >
            <span className="sr-only">Toggle plan type</span>
            <span className={`transform transition-all duration-200 ease-in-out ${isYearly ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 bg-white rounded-full`} />
          </div>
          <span className="text-white ml-2">Yearly</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pricingPlans.map((plan) => (
            <div key={plan.name} className="bg-gray-800 rounded-lg shadow-md p-4 flex flex-col items-center transition-transform transform hover:scale-105">
              <h2 className="text-xl font-semibold text-blue-400 mb-2">{plan.name}</h2>
              <p className="text-3xl font-bold text-white mb-4">{isYearly ? `${plan.price}/yr` : `${plan.price}/mo`}</p>
              <ul className="text-gray-300 mb-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <svg className="w-5 h-5 text-blue-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition duration-300">
                Select Plan
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingComponent;