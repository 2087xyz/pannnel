const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

const licensesPath = path.join(__dirname, "licenses.json");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(bodyParser.urlencoded({ extended: false }));

// Hilfsfunktion: Lizenzen laden oder leeres Array
function loadLicenses() {
  try {
    const data = fs.readFileSync(licensesPath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.warn("⚠️ Lizenzdatei nicht gefunden. Neue Datei wird erstellt.");
    fs.writeFileSync(licensesPath, "[]");
    return [];
  }
}

// Lizenzprüfung (API)
app.get("/check", (req, res) => {
  const key = req.query.key;
  const licenses = loadLicenses();
  const valid = licenses.includes(key);
  res.json({ valid });
});

// Web-Oberfläche anzeigen
app.get("/", (req, res) => {
  const licenses = loadLicenses();
  res.render("index", { licenses });
});

// Neue Lizenz hinzufügen
app.post("/add", (req, res) => {
  const newKey = req.body.key;
  if (!newKey) return res.redirect("/");

  const licenses = loadLicenses();
  if (!licenses.includes(newKey)) {
    licenses.push(newKey);
    fs.writeFileSync(licensesPath, JSON.stringify(licenses, null, 2));
  }

  res.redirect("/");
});

// Lizenz entfernen
app.post("/remove", (req, res) => {
  const delKey = req.body.key;
  let licenses = loadLicenses();
  licenses = licenses.filter(k => k !== delKey);
  fs.writeFileSync(licensesPath, JSON.stringify(licenses, null, 2));
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`🔐 Lizenzserver läuft unter http://localhost:${PORT}`);
});
