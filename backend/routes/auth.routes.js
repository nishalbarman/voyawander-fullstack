const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Router } = require("express");
const { OAuth2Client } = require("google-auth-library");

const router = Router();

// google signin
router.get("/google/request", (req, res) => {});

router.get("/google/callback", async (req, res) => {});

module.exports = router;
