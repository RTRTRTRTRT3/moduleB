const express = require('express');
const app = express();
const PORT = 3000;
const tokens = require('./tokens');

const serviceRates = {
    'Service #1': 0.0015,
    'Service #2': 0.005
};

const usageData = [
    { token: 'development token', service: 'Service #1', time: 0.162 },
    { token: 'production token', service: 'Service #1', time: 1.039 },
    { token: 'production token', service: 'Service #2', time: 0.501 }
];

app.get('/api/billing', (req, res) => {
    let totalCost = 0;
    const tokenUsage = {};

    usageData.forEach(({ token, service, time }) => {
        if (!tokens.some(t => t.name === token)) {
            return;
        }

        const cost = time * (serviceRates[service] || 0);
        totalCost += cost;

        if (!tokenUsage[token]) {
            tokenUsage[token] = [];
        }
        tokenUsage[token].push({ service, time, rate: serviceRates[service], cost: cost.toFixed(2) });
    });

    res.json({ usage: tokenUsage, total: totalCost.toFixed(2) });
});

app.listen(PORT, () => {
    console.log(`Billing server running on http://localhost:${PORT}`);
});
