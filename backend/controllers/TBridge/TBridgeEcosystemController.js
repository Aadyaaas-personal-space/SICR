const {
    joinEcosystem,
    getJoinedEcosystems,
    updateEcosystemCompletion
} = require(
    "../../services/TBridge/tBridgeEcosystemService"
);


/*
|--------------------------------------------------------------------------
| Join Ecosystem
|--------------------------------------------------------------------------
*/

const join = async (req, res) => {

    try {

        const {
            ecosystem,
            answers
        } = req.body;


        if (!ecosystem) {

            return res.status(400).json({
                success: false,
                message: "Ecosystem is required"
            });

        }


        const membership =
            await joinEcosystem(
                req.tBridgeId,
                ecosystem,
                answers || {}
            );


        return res.status(201).json({

            success: true,

            message:
                "Successfully joined ecosystem",

            membership

        });

    } catch (error) {

        console.error(
            "Join ecosystem error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                error.message ||
                "Failed to join ecosystem"

        });

    }

};


/*
|--------------------------------------------------------------------------
| Get Joined Ecosystems
|--------------------------------------------------------------------------
*/

const getMyEcosystems = async (
    req,
    res
) => {

    try {

        const ecosystems =
            await getJoinedEcosystems(
                req.tBridgeId
            );


        return res.json({

            success: true,

            ecosystems

        });

    } catch (error) {

        console.error(
            "Get ecosystems error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to fetch ecosystems"

        });

    }

};


/*
|--------------------------------------------------------------------------
| Ecosystem Completion
|--------------------------------------------------------------------------
*/

const completion = async (
    req,
    res
) => {

    try {

        const {
            ecosystem,
            answers
        } = req.body;


        if (!ecosystem) {

            return res.status(400).json({

                success: false,

                message:
                    "Ecosystem is required"

            });

        }


        const membership =
            await updateEcosystemCompletion(
                req.tBridgeId,
                ecosystem,
                answers || {}
            );


        return res.json({

            success: true,

            message:
                "Ecosystem profile completed",

            membership

        });

    } catch (error) {

        console.error(
            "Ecosystem completion error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                error.message ||
                "Failed to update completion"

        });

    }

};


module.exports = {

    join,

    getMyEcosystems,

    completion

};