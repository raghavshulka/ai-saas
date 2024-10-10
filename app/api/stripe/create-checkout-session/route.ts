import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-09-30.acacia',
});

// Handle POST requests to create a checkout session
export async function POST(req: Request) {
  const { plan } = await req.json(); // Parse the JSON request body

  try {
    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'], // Specify payment method types
      line_items: [
        {
          price_data: {
            currency: 'usd', // Specify currency
            product_data: {
              name: plan === 'basic' ? 'Basic Plan' : 'Premium Plan',
            },
            unit_amount: plan === 'basic' ? 499 : 999, // Set amount in cents
          },
          quantity: 1, // Specify quantity
        },
      ],
      mode: 'payment', // Set the payment mode
      success_url: `${process.env.NEXT_PUBLIC_URL}/success`, // Redirect URL on success
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/cancel`, // Redirect URL on cancel
    });

    // Return the session URL to redirect to
    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}
