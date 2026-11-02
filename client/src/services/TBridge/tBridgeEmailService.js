const axios = require("axios");

const sendTBridgeOTPEmail = async (email, otp) => {
    try {
        const apiKey = process.env.BREVO_API_KEY;

        if (!apiKey) {
            throw new Error("BREVO_API_KEY is missing");
        }

        const senderEmail =
            process.env.BREVO_SENDER_EMAIL;

        const senderName =
            process.env.BREVO_SENDER_NAME ||
            "SICR T-Bridge";

        await axios.post(
            "https://api.brevo.com/v3/smtp/email",
            {
                sender: {
                    name: senderName,
                    email: senderEmail
                },

                to: [
                    {
                        email
                    }
                ],

                subject: "Your SICR T-Bridge OTP",

                htmlContent: `
                    <div style="
                        font-family: Arial, sans-serif;
                        padding: 30px;
                        background: #f5f7fb;
                    ">
                        <div style="
                            max-width: 500px;
                            margin: auto;
                            background: white;
                            padding: 30px;
                            border-radius: 15px;
                        ">
                            <h1>SICR T-Bridge</h1>

                            <p>
                                Your verification OTP is:
                            </p>

                            <h2 style="
                                letter-spacing: 8px;
                                font-size: 32px;
                            ">
                                ${otp}
                            </h2>

                            <p>
                                This OTP is valid for 10 minutes.
                            </p>

                            <p>
                                If you did not request this OTP,
                                please ignore this email.
                            </p>
                        </div>
                    </div>
                `
            },
            {
                headers: {
                    "api-key": apiKey,
                    "Content-Type": "application/json"
                }
            }
        );

        return true;
    } catch (error) {
        console.error(
            "T-Bridge email error:",
            error.response?.data || error.message
        );

        throw error;
    }
};

module.exports = {
    sendTBridgeOTPEmail
};