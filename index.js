const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const hewan = require('./data');

// Endpoint API
app.get('/api/hewan', (req, res) => {
    const { asalBenua } = req.query;

    if (asalBenua) {
        const hasilFilter = hewan.filter(h =>
            h.asalBenua.toLowerCase() === asalBenua.toLowerCase()
        );
        return res.json({ status: 'success', data: hasilFilter });
    }

    res.json({ status: 'success', data: hewan });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
