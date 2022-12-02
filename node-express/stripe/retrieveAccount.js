
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

/**
 * Get stripe account information by account id.
 * Returns sripe account object
 * Document: https://stripe.com/docs/api/accounts/retrieve
 * 
 * @param {string} accountId // account id from database
 */
const retrieveAccount = async (accountId) => {
    try {
        account = await stripe.accounts.retrieve(accountId);

        return {
            success: true,
            accountId,
            account,
        };
    } catch (error) {
        console.error('Stripe account retrieve failed: ', error);
        return {
            success: false,
            accountId,
            message: 'Stripe account retrieve failed.',
            error: error.message || error,
        };
    }
};

module.exports = retrieveAccount;