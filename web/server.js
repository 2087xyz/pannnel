const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const licenses = JSON.parse(fs.readFileSync("./licenses.json", "utf8"));
const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(bodyParser.urlencoded({ extended: false }));

// Lizenzprüfung (API)
app.get("/check", (req, res) => {
  const key = req.query.key;
  const licenses = JSON.parse(fs.readFileSync("./licenses.json", "utf8"));
  const valid = licenses.includes(key);
  res.json({ valid });
});

// Web-Oberfläche
app.get("/", (req, res) => {
  const licenses = JSON.parse(fs.readFileSync("./licenses.json", "utf8"));
  res.render("index", { licenses });
});

app.post("/add", (req, res) => {
  const newKey = req.body.key;
  if (!newKey) return res.redirect("/");
  const licenses = JSON.parse(fs.readFileSync("./licenses.json", "utf8"));
  if (!licenses.includes(newKey)) {
    licenses.push(newKey);
    fs.writeFileSync("./web/licenses.json", JSON.stringify(licenses, null, 2));
  }
  res.redirect("/");
});

app.post("/remove", (req, res) => {
  const delKey = req.body.key;
  let licenses = JSON.parse(fs.readFileSync("./web/licenses.json", "utf8"));
  licenses = licenses.filter(k => k !== delKey);
  fs.writeFileSync("./web/licenses.json", JSON.stringify(licenses, null, 2));
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`🔐 Lizenzserver & Panel auf http://localhost:${PORT}`);
});
