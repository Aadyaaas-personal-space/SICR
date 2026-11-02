const jwt = require("jsonwebtoken");

const generateInvestorFunderToken = (investorFunder) => {
    return jwt.sign(
        {
            id: investorFunder._id,
            role: investorFunder.role,
            email: investorFunder.email,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRE || "7d",
        }
    );
};

module.exports = generateInvestorFunderToken;