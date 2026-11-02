const { BrevoClient } = require("@getbrevo/brevo");

// =====================================================
// BREVO CLIENT
// =====================================================

if (!process.env.BREVO_API_KEY) {
  console.error("❌ BREVO_API_KEY is missing from .env");
}

if (!process.env.BREVO_SENDER_EMAIL) {
  console.error("❌ BREVO_SENDER_EMAIL is missing from .env");
}

const client = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
});

// =====================================================
// COMMON SENDER
// =====================================================

const sender = {
  email: process.env.BREVO_SENDER_EMAIL,

  name:
    process.env.BREVO_SENDER_NAME ||
    "SICR Startup & Innovation Ecosystem",
};

// =====================================================
// COMMON OTP EMAIL FUNCTION
// =====================================================

const sendOTPEmail = async ({
  email,
  firstName = "",
  lastName = "",
  otp,
  subject,
  ecosystem,
  title,
  description,
  tag,
}) => {

  try {

    if (!email) {
      throw new Error("Recipient email is required.");
    }

    if (!otp) {
      throw new Error("OTP is required.");
    }

    if (!process.env.BREVO_API_KEY) {
      throw new Error("BREVO_API_KEY is not configured.");
    }

    if (!process.env.BREVO_SENDER_EMAIL) {
      throw new Error(
        "BREVO_SENDER_EMAIL is not configured."
      );
    }

    const fullName =
      `${firstName} ${lastName}`.trim() || "there";

    // =================================================
    // TEXT EMAIL
    // =================================================

    const textContent = `
Hello ${fullName},

Your SICR ${ecosystem} verification OTP is:

${otp}

This OTP is valid for 10 minutes.

If you did not request this verification,
you can safely ignore this email.

SICR - Startup & Innovation Ecosystem
        `.trim();

    // =================================================
    // HTML EMAIL
    // =================================================

    const htmlContent = `
<!DOCTYPE html>

<html>

<head>

    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>SICR Verification</title>

</head>

<body
    style="
        margin:0;
        padding:40px 20px;
        background:#f4f7fb;
        font-family:Arial, Helvetica, sans-serif;
    "
>

    <div
        style="
            max-width:600px;
            margin:0 auto;
            background:#ffffff;
            border-radius:18px;
            overflow:hidden;
            box-shadow:0 10px 40px rgba(0,0,0,0.08);
        "
    >

        <!-- HEADER -->

        <div
            style="
                padding:32px 25px;
                background:#111827;
                text-align:center;
                color:#ffffff;
            "
        >

            <div
                style="
                    font-size:34px;
                    font-weight:800;
                    letter-spacing:3px;
                "
            >
                SICR
            </div>

            <div
                style="
                    margin-top:8px;
                    font-size:13px;
                    color:#d1d5db;
                "
            >
                Startup & Innovation Ecosystem
            </div>

        </div>


        <!-- CONTENT -->

        <div
            style="
                padding:40px 35px;
            "
        >

            <div
                style="
                    text-align:center;
                    margin-bottom:25px;
                "
            >

                <span
                    style="
                        display:inline-block;
                        padding:7px 14px;
                        background:#eef2ff;
                        color:#4f46e5;
                        border-radius:999px;
                        font-size:12px;
                        font-weight:700;
                    "
                >
                    ${ecosystem}
                </span>

            </div>


            <h1
                style="
                    margin:0;
                    text-align:center;
                    color:#111827;
                    font-size:25px;
                "
            >
                ${title}
            </h1>


            <p
                style="
                    margin-top:22px;
                    color:#374151;
                    font-size:15px;
                    line-height:1.7;
                "
            >
                Hello <strong>${fullName}</strong>,
            </p>


            <p
                style="
                    color:#6b7280;
                    font-size:15px;
                    line-height:1.7;
                "
            >
                ${description}
            </p>


            <!-- OTP -->

            <div
                style="
                    margin:32px auto;
                    padding:25px 20px;
                    max-width:320px;
                    text-align:center;
                    background:#f3f4f6;
                    border-radius:14px;
                    border:1px solid #e5e7eb;
                "
            >

                <div
                    style="
                        margin-bottom:10px;
                        color:#6b7280;
                        font-size:12px;
                        text-transform:uppercase;
                        letter-spacing:1px;
                    "
                >
                    Verification Code
                </div>


                <div
                    style="
                        color:#111827;
                        font-size:38px;
                        font-weight:800;
                        letter-spacing:9px;
                    "
                >
                    ${otp}
                </div>

            </div>


            <p
                style="
                    text-align:center;
                    color:#4b5563;
                    font-size:13px;
                    line-height:1.6;
                "
            >
                This verification code is valid for
                <strong>10 minutes</strong>.
            </p>


            <p
                style="
                    margin-top:28px;
                    color:#9ca3af;
                    font-size:12px;
                    line-height:1.6;
                    text-align:center;
                "
            >
                If you did not request this verification
                code, you can safely ignore this email.
            </p>

        </div>


        <!-- FOOTER -->

        <div
            style="
                padding:22px;
                background:#f9fafb;
                border-top:1px solid #f0f0f0;
                text-align:center;
            "
        >

            <div
                style="
                    color:#9ca3af;
                    font-size:11px;
                "
            >
                &copy; ${new Date().getFullYear()}
                SICR - Startup & Innovation Ecosystem
            </div>

        </div>

    </div>

</body>

</html>
        `.trim();


    // =================================================
    // BREVO SEND
    // =================================================

    const result =
      await client.transactionalEmails.sendTransacEmail({

        sender,

        to: [
          {
            email,
            name: fullName,
          },
        ],

        subject,

        textContent,

        htmlContent,

        tags: [
          "SICR",
          tag,
        ],
      });


    console.log(
      `✅ ${ecosystem} OTP email sent successfully → ${email}`
    );

    console.log(
      "Brevo Message ID:",
      result?.messageId || "N/A"
    );

    return result;

  } catch (error) {

    console.error(
      `❌ ${ecosystem} OTP EMAIL ERROR`
    );

    console.error(
      "Message:",
      error?.message
    );

    console.error(
      "Status:",
      error?.statusCode
    );

    console.error(
      "Body:",
      error?.body
    );

    throw error;
  }
};


// =====================================================
// STARTUP OTP
// =====================================================

const sendStartupOTP = async (
  email,
  otp,
  firstName = "",
  lastName = ""
) => {

  return sendOTPEmail({

    email,
    otp,
    firstName,
    lastName,

    ecosystem:
      "Startup Ecosystem",

    subject:
      "SICR Startup Email Verification OTP",

    title:
      "Verify Your Startup Account",

    description:
      "Use the verification code below to verify your email and continue creating your SICR Startup account.",

    tag:
      "Startup-OTP",
  });
};


// =====================================================
// INVESTOR OTP
// =====================================================

const sendInvestorOTP = async (
  email,
  otp,
  firstName = "",
  lastName = ""
) => {

  return sendOTPEmail({

    email,
    otp,
    firstName,
    lastName,

    ecosystem:
      "Investor & Funder Ecosystem",

    subject:
      "SICR Investor & Funder Email Verification OTP",

    title:
      "Verify Your Investor / Funder Account",

    description:
      "Use the verification code below to verify your email and continue creating your SICR Investor or Funder account.",

    tag:
      "Investor-Funder-OTP",
  });
};


// =====================================================
// BACKWARD COMPATIBILITY
// =====================================================

const sendInvestorFunderOTP = async (
  email,
  otp,
  firstName = "",
  lastName = ""
) => {

  return sendInvestorOTP(
    email,
    otp,
    firstName,
    lastName
  );
};


// =====================================================
// MENTOR OTP
// =====================================================

const sendMentorOTP = async (
  email,
  otp,
  firstName = "",
  lastName = ""
) => {

  return sendOTPEmail({

    email,
    otp,
    firstName,
    lastName,

    ecosystem:
      "Mentor & Expertise Ecosystem",

    subject:
      "SICR Mentor & Expertise Email Verification OTP",

    title:
      "Verify Your Mentor Account",

    description:
      "Use the verification code below to verify your email and continue creating your SICR Mentor & Expertise account.",

    tag:
      "Mentor-Expertise-OTP",
  });
};


// =====================================================
// CORPORATE & INDUSTRY OTP
// =====================================================

const sendCorporateOTPEmail = async (
  email,
  otp,
  companyName = ""
) => {

  return sendOTPEmail({

    email,

    otp,

    firstName:
      companyName,

    lastName:
      "",

    ecosystem:
      "Corporate & Industry Ecosystem",

    subject:
      "SICR Corporate & Industry Verification OTP",

    title:
      "Verify Your Company Email",

    description:
      `Use the verification code below to verify the official email address of ${companyName || "your company"} and continue creating your SICR Corporate & Industry account.`,

    tag:
      "Corporate-Industry-OTP",
  });
};


// =====================================================
// EXPORTS
// =====================================================

module.exports = {

  sendStartupOTP,

  sendInvestorOTP,

  sendInvestorFunderOTP,

  sendMentorOTP,

  sendCorporateOTPEmail,

};