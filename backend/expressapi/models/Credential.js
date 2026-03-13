const mongoose = require('mongoose');

const credentialSchema = new mongoose.Schema({
    recipientAddress: { type: String, required: true, index: true },
    issuerAddress: { type: String, required: true },
    skillName: { type: String, required: true },
    ipfsHash: { type: String }, // Link to the metadata stored on IPFS
    tokenId: { type: String }, // The ID from your Soulbound Token contract
    status: { type: String, enum: ['pending', 'issued'], default: 'pending' },
    issuedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Credential', credentialSchema);