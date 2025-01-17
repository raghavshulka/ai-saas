import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-09-30.acacia',
});

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const buf = await req.arrayBuffer(); // Read the body as ArrayBuffer
  const buffer = Buffer.from(buf);
  const sig = req.headers.get('stripe-signature'); // Use get method to access headers

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      buffer,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: unknown) {
    console.error('⚠️  Webhook signature verification failed.', err instanceof Error ? err.message : 'Unknown error');
    return NextResponse.json({ error: `Webhook Error: ${err instanceof Error ? err.message : 'Unknown error'}` }, { status: 400 });
  }

  // Handle the event based on its type
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;

      try {
        // Retrieve the customer and subscription data
        const customerResponse = await stripe.customers.retrieve(session.customer as string);

        if (customerResponse.deleted) {
          // Handle the case where the customer is deleted
          console.error('Customer was deleted.');
          return NextResponse.json({ error: 'Customer was deleted.' }, { status: 400 });
        }

        // Now that we know the customer is not deleted, we can safely cast to Stripe.Customer
        const customer = customerResponse as Stripe.Customer;

        const subscriptionId = session.subscription as string;
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);

        // Check if the user exists in the database using their email
        const user = await prisma.user.findUnique({
          where: { email: customer.email! },
        });

        if (user) {
          // Determine the plan and assign corresponding credits
          const plan = session.metadata?.plan; // Ensure you set this metadata when creating the session
          const credits = plan === 'basic' ? 50 : 100;

          // Update or create the user's subscription record
          await prisma.subscription.create({
            data: {
              userId: user.id,
              credits,
              stripCustomerId: session.customer as string,
              stripeSubcriptionId: subscriptionId,
              stripePriceId: session.metadata?.price_id || '',
              stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000), // Extract from subscription
            },
          });

          // Increment user credits in the User model
          await prisma.user.update({
            where: { id: user.id },
            data: { credits: { increment: credits } },
          });
        } else {
          console.error('⚠️ User not found for the email:', customer.email);
        }
      } catch (error) {
        console.error('⚠️ Error processing checkout session:', error);
      }

      break;
    }

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  return NextResponse.json({ received: true });
};
