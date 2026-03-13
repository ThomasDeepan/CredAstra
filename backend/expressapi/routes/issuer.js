const express = require('express');
const router = express.Router();
const Credential = require('../models/Credential');

// Endpoint to log a new credential issuance
router.post('/issue', async (req, res) => {
    try {
        const { recipient, skill, ipfs } = req.body;
        const newCred = new Credential({
            recipientAddress: recipient,
            skillName: skill,
            ipfsHash: ipfs,
            issuerAddress: req.body.issuer // In production, get this from auth middleware
        });
        await newCred.save();
        res.status(201).json({ message: "Credential logged successfully", data: newCred });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add this to your issuer.js file
router.get('/skills/:address', async (req, res) => {
    try {
        const skills = await Credential.find({ recipientAddress: req.params.address });
        res.json(skills);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch skills" });
    }
});

router.post('/issue', async (req, res) => {
    try {
        const { recipient, skill, ipfs, issuer } = req.body;
        const newCred = new Credential({
            recipientAddress: recipient,
            skillName: skill,
            ipfsHash: ipfs,
            issuerAddress: issuer
        });
        const saved = await newCred.save();
        res.status(201).json(saved); // Send back the success result
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;