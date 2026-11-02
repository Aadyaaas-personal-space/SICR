const { BrevoClient } = require("@getbrevo/brevo");

const sendTBridgeOTPEmail = async (email, otp) => {
    try {
        if (!process.env.BREVO_API_KEY) {
            throw new Error("BREVO_API_KEY is missing");
        }

        if (!process.env.BREVO_SENDER_EMAIL) {
            throw new Error("BREVO_SENDER_EMAIL is missing");
        }

        const client = new BrevoClient({
            apiKey: process.env.BREVO_API_KEY
        });

        const result =
            await client.transactionalEmails.sendTransacEmail({
                sender: {
                    email: process.env.BREVO_SENDER_EMAIL,
                    name:
                        process.env.BREVO_SENDER_NAME ||
                        "SICR T-Bridge"
                },

                to: [
                    {
                        email: email
                    }
                ],

                subject:
                    "SICR T-Bridge - Email Verification OTP",

                htmlContent: `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="UTF-8">
                        <title>T-Bridge OTP</title>
                    </head>

                    <body style="
                        margin: 0;
                        padding: 0;
                        background: #f4f6f8;
                        font-family: Arial, sans-serif;
                    ">

                        <div style="
                            max-width: 600px;
                            margin: 40px auto;
                            background: white;
                            padding: 40px;
                            border-radius: 12px;
                            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
                        ">

                            <h1 style="
                                margin: 0 0 10px;
                                color: #111827;
                            ">
                                SICR T-Bridge
                            </h1>

                            <p style="
                                color: #4b5563;
                                font-size: 16px;
                            ">
                                Welcome to T-Bridge.
                            </p>

                            <p style="
                                color: #4b5563;
                                font-size: 16px;
                            ">
                                Use the following OTP to verify
                                your email address:
                            </p>

                            <div style="
                                margin: 30px 0;
                                padding: 20px;
                                text-align: center;
                                background: #f3f4f6;
                                border-radius: 10px;
                            ">

                                <span style="
                                    font-size: 36px;
                                    font-weight: bold;
                                    letter-spacing: 10px;
                                    color: #111827;
                                ">
                                    ${otp}
                                </span>

                            </div>

                            <p style="
                                color: #6b7280;
                                font-size: 14px;
                            ">
                                This OTP is valid for
                                <strong>10 minutes</strong>.
                            </p>

                            <p style="
                                color: #6b7280;
                                font-size: 14px;
                            ">
                                If you did not request this OTP,
                                you can safely ignore this email.
                            </p>

                            <hr style="
                                border: none;
                                border-top: 1px solid #e5e7eb;
                                margin: 30px 0;
                            ">

                            <p style="
                                color: #9ca3af;
                                font-size: 12px;
                            ">
                                SICR Startup Ecosystem
                                — T-Bridge
                            </p>

                        </div>

                    </body>
                    </html>
                `
            });

        console.log(
            "================================="
        );

        console.log(
            "T-BRIDGE OTP EMAIL SENT"
        );

        console.log(
            "Recipient:",
            email
        );

        console.log(
            "Message ID:",
            result.messageId
        );

        console.log(
            "================================="
        );

        return {
            success: true,
            messageId: result.messageId
        };

    } catch (error) {

        console.error(
            "================================="
        );

        console.error(
            "T-BRIDGE EMAIL ERROR"
        );

        console.error(
            "Message:",
            error.message
        );

        console.error(
            "Status:",
            error.statusCode
        );

        console.error(
            "Body:",
            error.body
        );

        console.error(
            "================================="
        );

        throw error;
    }
};

module.exports = {
    sendTBridgeOTPEmail
};