const InvestorFunder = require("../models/InvestorFunder");

const ML_SERVICE_URL =
  process.env.ML_SERVICE_URL || "http://127.0.0.1:5001";

const searchInvestorMatches = async (req, res) => {
  try {
    const {
      idea,
      stage = "MVP",
      requiredFunding = 0,
      location = "",
      topN = 10,
    } = req.body;

    if (!idea || !idea.trim()) {
      return res.status(400).json({
        success: false,
        message: "Startup idea is required",
      });
    }

    // Get live, completed investors from SICR MongoDB
    const investors = await InvestorFunder.find({
      status: "ACTIVE",
      profileCompleted: true,
    })
      .select("-password -__v")
      .lean();

    if (!investors.length) {
      return res.status(200).json({
        success: true,
        message: "No active completed investor profiles found",
        detectedDomains: [],
        recommendations: [],
        totalResults: 0,
      });
    }

    // Send live SICR investors to Python ML service
    const mlResponse = await fetch(
      `${ML_SERVICE_URL}/recommend-investors`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idea,
          stage,
          required_funding: Number(requiredFunding) || 0,
          location,
          investors,
          top_n: Number(topN) || 10,
        }),
      }
    );

    if (!mlResponse.ok) {
      const errorText = await mlResponse.text();

      console.error("ML service error:", errorText);

      return res.status(502).json({
        success: false,
        message: "ML matching service returned an error",
        error: errorText,
      });
    }

    const mlData = await mlResponse.json();

    return res.status(200).json({
      success: true,
      detectedDomains: mlData.detectedDomains || [],
      recommendations: mlData.recommendations || [],
      totalResults:
        mlData.totalResults ??
        (mlData.recommendations || []).length,
    });
  } catch (error) {
    console.error("Investor ML matching error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate investor recommendations",
      error: error.message,
    });
  }
};

module.exports = {
  searchInvestorMatches,
};