const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

/**
 * Link user to stripe account.
 * Returns stripe account connect onboarding link.
 * Document: https://stripe.com/docs/api/account_links/create
 * 
 * @param {string} accountId // stripe account id from just created one or database
 * @returns 
 */
const accountLink = async (accountId) => {
    try {
        const accountLink = await stripe().accountLinks.create({
            account: accountId,
            refresh_url: `${process.env.STRIPE_CONNECT_REDIRECT_URL}`,
            return_url: `${process.env.STRIPE_CONNECT_REDIRECT_URL}`,
            type: "account_onboarding",
        })

        return {
            success: true,
            accountId,
            url: accountLink.url,
            message: 'Account onboarding link created successfully.'
        }
    } catch (error) {
        console.error('Stripe account create link failed: ', error)
        return {
            success: false,
            accountId,
            url: null,
            message: 'Stripe account create link failed',
            error: error.message || error,
        }
    }
}

module.exports = accountLink;