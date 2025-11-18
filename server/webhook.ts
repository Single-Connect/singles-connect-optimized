import { Request, Response } from "express";
import Stripe from "stripe";
import * as db from "./db";
import { getProductById } from "./products";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-10-29.clover",
});

export async function handleStripeWebhook(req: Request, res: Response) {
  const sig = req.headers["stripe-signature"];

  if (!sig) {
    console.error("[Webhook] No signature provided");
    return res.status(400).send("No signature");
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch (err: any) {
    console.error("[Webhook] Signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle test events
  if (event.id.startsWith("evt_test_")) {
    console.log("[Webhook] Test event detected, returning verification response");
    return res.json({
      verified: true,
    });
  }

  console.log("[Webhook] Event received:", event.type, event.id);

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        
        const userId = parseInt(session.metadata?.user_id || "0");
        const coins = parseInt(session.metadata?.coins || "0");
        const packageId = session.metadata?.package_id;

        if (!userId || !coins) {
          console.error("[Webhook] Missing metadata:", session.metadata);
          return res.status(400).send("Missing metadata");
        }

        console.log(`[Webhook] Payment successful for user ${userId}, adding ${coins} coins`);

        // Add coins to user
        await db.updateUserCoins(userId, coins);

        console.log(`[Webhook] Successfully added ${coins} coins to user ${userId}`);
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("[Webhook] PaymentIntent succeeded:", paymentIntent.id);
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.error("[Webhook] PaymentIntent failed:", paymentIntent.id);
        break;
      }

      default:
        console.log(`[Webhook] Unhandled event type: ${event.type}`);
    }

    return res.json({ received: true });
  } catch (error: any) {
    console.error("[Webhook] Error processing event:", error);
    return res.status(500).send(`Webhook handler failed: ${error.message}`);
  }
}
