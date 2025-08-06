import { Check } from 'lucide-react';
import React from 'react';

type PaymentConfirmationProps = {
  orderNumber: string;
  amount: string;
  paymentMethod: string;
  onContinueShopping: () => void;
};

const PaymentConfirmation: React.FC<PaymentConfirmationProps> = ({
  orderNumber,
  amount,
  paymentMethod,
  onContinueShopping,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <Check className="text-green-900 text-6xl" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful</h1>
          <p className="text-gray-600">Thank you for your purchase!</p>
        </div>

        <div className="border-t border-b border-gray-200 py-6 my-6">
          <div className="flex justify-between mb-4">
            <span className="text-gray-600">Order Number:</span>
            <span className="font-medium">{orderNumber}</span>
          </div>
          <div className="flex justify-between mb-4">
            <span className="text-gray-600">Amount Paid:</span>
            <span className="font-medium">{amount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Payment Method:</span>
            <span className="font-medium">{paymentMethod}</span>
          </div>
        </div>

        <div className="text-center mb-6">
          <p className="text-gray-600 mb-4">
            Your order has been placed and is being processed. You will receive a confirmation email shortly.
          </p>
          <p className="text-gray-600">
            Order ID: <span className="font-medium">{orderNumber}</span>
          </p>
        </div>

        <div className="flex flex-col space-y-3">
          <button
            onClick={onContinueShopping}
            className="w-full bg-green-900 hover:bg-green-900 text-white font-medium py-2 px-4 rounded-md transition duration-200"
          >
            Continue Shopping
          </button>
          <button className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-md transition duration-200">
            View Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentConfirmation;
