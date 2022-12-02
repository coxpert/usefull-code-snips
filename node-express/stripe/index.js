/**
 * Get started
 * 
 * Install npm packages
 * npm install stripe / yarn add stripe
 * 
 * Set env for stripe secrete key and redirect urls.
 * we can get stripe keys from the following link.
 * https://dashboard.stripe.com/test/apikeys
 * STRIPE_SECRET_KEY="sk_test_..."
 * STRIPE_CONNECT_REDIRECT_URL=http://localhost:3000/account/payment-info
 * 
 * Setup stripe webhook url
 * 
 * Find Web secret
 * https://dashboard.stripe.com/test/webhooks
 * STRIPE_WEBHOOK_SECRET="whsec_..."
 * 
 * NOTES: to listen to the onboarding event for the customer, the webhook type should be Connect not Account
 * https://prnt.sc/s0ms7gcWBXJH
 * 
 * Local Environment
 * https://stripe.com/docs/stripe-cli
 * 
 * - Download stripe cli from here 
 *   https://github.com/stripe/stripe-cli/releases/latest
 * - Unzip the stripe_X.X.X_windows_x86_64.zip file
 * - copy stripe.exe file to /Users/Administrator
 * - Open cmd
 * - Command: stripe login
 * 
 * - Listen stripe events to local
 * https://stripe.com/docs/cli/listen
 * 
 * Command: stripe listen --forward-to http://localhost:3005/api/v1/stripe/webhooks
 * 
 * - Resend stripe webhook
 * Command: stripe events resend evt_1LesCa2QKKDnnwyrfTLN1QLv
 * 
 */


// Webhook exception from body-parser

app.use(bodyParser.json({
    extended: true, limit: '50mb',
    verify: function (req, res, buf) {
        if (req.originalUrl.endsWith('/stripe/webhooks')) {
            req.rawBody = buf
        }
    }
}))


const handleWebhooks = (req, res) => {

    try {
        const webhookEvent = verifyWebhook(
            req,
            process.env.STRIPE_WEBHOOK_SECRET
        );

        switch (webhookEvent.type) {
            case 'account.updated': {
                return handleAccountUpdateEvent(webhookEvent)
            }

            // TODO: some more event handlers here...

            default: {
                res.status(200).send({
                    message: 'Success'
                })
            }
        }

    } catch (error) {
        return res.status(500).send({
            message: error.message || error
        })
    }
}

const handleAccountUpdateEvent = (event, res) => {
    try {
        const data = event.data.object

        if (!data) {
            throw "Invalid request"
        }

        const { id: accountId, charges_enabled, details_submitted, payouts_enabled, metadata } = data

        // TODO: something with databse

        res.status(200).send({
            message: "Success"
        })
    } catch (error) {
        console.error(error)
        res.status(500).send({
            message: error.message || error
        })
    }
}

module.exports = handleWebhooks
