import React from 'react';
import Link from 'next/link';

const PricingSection = () => {
  const plans = [
    {
      title: "Free Mode",
      price: "$0",
      features: [
        "Create up to 3 flashcard decks",
        "Basic AI-powered flashcard creation",
        "Access to interactive learning tools",
        "Limited support"
      ],
      style: "bg-white backdrop-filter backdrop-blur-lg",
      buttonStyle: "bg-purple-600 hover:bg-purple-700 text-white"
    },
    {
      title: "Basic Mode",
      price: "$4.99/month",
      features: [
        "Create up to 10 flashcard decks",
        "Limited storage (500 MB)",
        "Export flashcards to PDF or CSV",
        "Email support"
      ],
      style: "bg-gradient-to-br from-gray-800 to-gray-900 text-white",
      buttonStyle: "bg-white text-gray-800 hover:bg-gray-100"
    },
    {
      title: "Pro Mode",
      price: "$9.99/month",
      features: [
        "Unlimited flashcard decks",
        "Unlimited storage",
        "Priority support and updates",
        "Sync across multiple devices"
      ],
      style: "bg-white backdrop-filter backdrop-blur-lg",
      buttonStyle: "bg-purple-600 hover:bg-purple-700 text-white"
    }
  ];

  return (
    <section className="py-20 px-4 bg-gray-200 w-full rounded-2xl p-20">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
          Flexible and Transparent Pricing
        </h2>
        <div className="flex flex-col lg:flex-row justify-center items-center lg:items-stretch gap-8">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`w-full max-w-sm rounded-2xl overflow-hidden shadow-lg ${plan.style} transform transition-all duration-300 hover:scale-105`}
            >
              <div className="px-6 py-8">
                <h3 className="text-2xl font-semibold mb-2">{plan.title}</h3>
                <p className="text-3xl font-bold mb-6">{plan.price}</p>
                <ul className="mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center mb-3">
                      <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href="/signup" className={`block w-full py-3 px-4 rounded-lg text-center font-semibold transition-colors duration-200 ${plan.buttonStyle}`}>
                  Get Started
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;