const express = require("express");
const router = express.Router();

const universalConnectionAuth = require("../middleware/universalConnectionAuth");

const {
    createIdea,
    getIdeas,
    getIdeaById,
    updateIdea,
    deleteIdea,
    searchDiscoverIdeas,
} = require("../controllers/ideaController");

router.use(universalConnectionAuth);

router.post("/", createIdea);
router.get("/", getIdeas);
router.get("/discover", searchDiscoverIdeas);
router.get("/:ideaId", getIdeaById);
router.patch("/:ideaId", updateIdea);
router.delete("/:ideaId", deleteIdea);

module.exports = router;

