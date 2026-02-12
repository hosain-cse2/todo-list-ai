const express = require("express");

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

app.get("/api/projects", (req, res) => {
  res.json({ projects: [] });
});

app.post("/api/projects", (req, res) => {
  res.status(501).json({
    message: "Project creation not yet implemented",
    data: req.body,
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
