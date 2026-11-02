const express = require("express");
const router = express.Router();
const careers = require("../data/careers.json");

const TAGS = ["tech", "create", "people", "food", "move", "business", "health", "analyze"];
const vec = (o) => TAGS.map((t) => o[t] || 0);
const dot = (a, b) => a.reduce((s, x, i) => s + x * b[i], 0);
const norm = (a) => Math.sqrt(dot(a, a)) || 1;

// GET /api/roadmap/careers?q=chef&category=Passion
router.get("/careers", (req, res) => {
  const q = (req.query.q || "").toLowerCase();
  const cat = req.query.category;
  res.json(careers.filter((c) => (!cat || cat === "All" || c.category === cat) && (c.name + c.desc).toLowerCase().includes(q)));
});

// GET /api/roadmap/careers/:id
router.get("/careers/:id", (req, res) => {
  const c = careers.find((x) => x.id == req.params.id);
  c ? res.json(c) : res.status(404).json({ error: "Career not found" });
});

// POST /api/roadmap/recommend   body: { answers: { tech: 2, create: 1 } }
// Cosine similarity between the student's interest vector and each career vector
router.post("/recommend", (req, res) => {
  const u = vec((req.body && req.body.answers) || {});
  const ranked = careers
    .map((c) => ({ career: c, match: Math.round((dot(u, vec(c.tags)) / (norm(u) * norm(vec(c.tags)))) * 100) }))
    .sort((a, b) => b.match - a.match)
    .slice(0, 3);
  res.json(ranked);
});

// ---------- Trained ML model (logistic regression, trained in ml/train_model.py) ----------
let model = null;
try { model = require("../ml/model.json"); }
catch { console.warn("ml/model.json not found. Run: python ml/train_model.py"); }

// POST /api/roadmap/predict   body: { answers: { tech: 2, create: 1, ... } }
router.post("/predict", (req, res) => {
  if (!model) return res.status(503).json({ error: "Model not trained yet. Run ml/train_model.py" });
  const a = (req.body && req.body.answers) || {};
  const x = model.tags.map((t) => Math.min(5, Math.max(0, Number(a[t]) || 0)));
  const z = model.coef.map((w, k) => dot(w, x) + model.intercept[k]);
  const m = Math.max(...z);
  const e = z.map((v) => Math.exp(v - m));
  const sum = e.reduce((s, v) => s + v, 0);
  const ranked = model.classes
    .map((name, k) => ({ name, probability: e[k] / sum }))
    .sort((p, q) => q.probability - p.probability)
    .slice(0, 3)
    .map((r) => ({ career: careers.find((c) => c.name === r.name), match: Math.round(r.probability * 100) }));
  res.json({ model: "Logistic Regression", test_accuracy: model.test_accuracy, results: ranked });
});

module.exports = router;
