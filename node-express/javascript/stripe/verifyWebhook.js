
import Stripe from "stripe"

export const stripe = () => {
    return new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: "2020-08-27",
        typescript: true,
    })
}

// Doc: https://stripe.com/docs/webhooks/signatures
// Github: https://github.com/stripe/stripe-node#webhook-signing

/**
 * Make sure
 * You are using correct webhook secret
 * The coming request does not pass bodyParser.
 * Add express.raw middleware to get raw body or get it from veryfy function of the body parser.
 * 
 */

const verifyWebhook = (req, secret) => {
    let event

    try {
        event = stripe().webhooks.constructEvent(
            req.body,

            req.headers["Stripe-Signature"],

            secret
        )
    } catch (error) {
        console.log("Verifying Signature failed", error)
        throw "Webhook not verifyable"
    }

    return event
}

module.exports = verifyWebhook