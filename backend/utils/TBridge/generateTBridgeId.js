const TBridgeAccount = require("../../models/TBridge/TBridgeAccount");

const generateTBridgeId = async () => {
    let id;
    let exists = true;

    while (exists) {
        const randomNumber = Math.floor(
            10000 + Math.random() * 90000
        );

        id = `TBR-${new Date().getFullYear()}-${randomNumber}`;

        exists = await TBridgeAccount.findOne({
            tBridgeId: id
        });
    }

    return id;
};

module.exports = generateTBridgeId;