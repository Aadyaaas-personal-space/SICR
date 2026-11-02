const jwt = require("jsonwebtoken");

const generateMentorToken = (mentor) => {
    return jwt.sign(
        {
            id: mentor._id,
            ecosystem: "MENTOR",
            role: "MENTOR",
            email: mentor.email,
        },

        process.env.JWT_SECRET,

        {
            expiresIn:
                process.env.JWT_EXPIRE || "7d",
        }
    );
};

module.exports = generateMentorToken;