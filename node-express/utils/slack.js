const axios = require("axios");

// const HOOK = 'T02NHM88DV0/B04CZTJQ4PL/WGsRC7klOpmjQSYtRorxJ5vC';
const HOOK = 'T049TUHL25U/B04A31TM19A/0NJFeQFp13KtLVAGhfTIdFBD';

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const sendErrorNotification = async (error, log) => {
    const environment = capitalizeFirstLetter(process.env.APP_ENV || 'development')
    try {
        let slackbody;
        if (log) {
            slackbody = {
                mkdwn: true,
                attachments: [{
                    pretext: `${environment.toUpperCase()} Notification`,
                    title: "Activity Log",
                    color: "good",
                    text: log,
                },],
            };
        } else if (error) {
            slackbody = {
                mkdwn: true,
                text: "Danny Torrence left a 1 star review for your property.",
                blocks: [
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": "Danny Torrence left the following review for your property:"
                        }
                    },
                    {
                        "type": "section",
                        "block_id": "section567",
                        "text": {
                            "type": "mrkdwn",
                            "text": "<https://example.com|Overlook Hotel> \n :star: \n Doors had too many axe holes, guest in room 237 was far too rowdy, whole place felt stuck in the 1920s."
                        },
                        "accessory": {
                            "type": "image",
                            "image_url": "https://is5-ssl.mzstatic.com/image/thumb/Purple3/v4/d3/72/5c/d3725c8f-c642-5d69-1904-aa36e4297885/source/256x256bb.jpg",
                            "alt_text": "Haunted hotel image"
                        }
                    },
                    {
                        "type": "section",
                        "block_id": "section789",
                        "fields": [
                            {
                                "type": "mrkdwn",
                                "text": "*Average Rating*\n1.0"
                            }
                        ]
                    }
                ],
                attachments: [{
                    pretext: `${environment.toUpperCase()} Error Notification`,
                    title: error?.message || error,
                    color: "#f50057",
                    text: error?.stack || '',
                },],
            };
        }
        await axios.post(
            `https://hooks.slack.com/services/${HOOK}`,
            slackbody
        );
    } catch (err) {
        console.log(err);
    }
};

module.exports = {
    sendErrorNotification,
};