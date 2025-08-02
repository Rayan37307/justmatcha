import React from 'react'
import PaymentConfirmation from '../components/PaymentConfirmation';

const PaymentConformed = () => {
  return (
    <PaymentConfirmation 
  orderNumber="#12345678"
  amount="$49.99"
  paymentMethod="Credit Card"
  onContinueShopping={() => {
    // Handle continue shopping logic
    console.log('Continue shopping clicked');
  }}
/>
  )
}

export default PaymentConformed