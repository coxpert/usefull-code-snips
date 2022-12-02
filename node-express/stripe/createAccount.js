const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

/**
 *  Create a new account on Stripe
 *  Returns stripe account object
 *  Document: https://stripe.com/docs/api/accounts/create
 * 
 *  https://stripe.com/docs/connect/service-agreement-types#recipient
 */
const createAccount = async () => {
    try {
        const account = await stripe.accounts.create({
            country: 'US', // https://dashboard.stripe.com/test/settings/connect/express
            type: 'express',
            capabilities: {
                card_payments: { requested: true },
                transfers: { requested: true },
            },
            business_type: 'individual',
            // optional
            metadata: {
                // attatch metadata. ex: userId,
            },
        });

        return account
    } catch (error) {
        console.error(error)
        return null
    }
};