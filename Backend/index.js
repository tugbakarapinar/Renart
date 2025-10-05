const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 5001;

app.use(cors({ origin: 'http://localhost:5173' })); 

app.use(express.json());

const rawData = fs.readFileSync('./products.json', 'utf8');
const products = JSON.parse(rawData);

const getGoldPricePerGram = async () => {
    return 65.00;
};

const calculatePrice = (product, goldPrice) => {
    const price = (product.popularityScore + 1) * product.weight * goldPrice;
    return price.toFixed(2);
};

app.get('/api/products', async (req, res) => {
    try {
        const goldPrice = await getGoldPricePerGram();

        const productsWithPrice = products.map(product => {
            const calculatedPrice = calculatePrice(product, goldPrice);
            return {
                ...product,
                price: parseFloat(calculatedPrice)
            };
        });

        res.json(productsWithPrice);
    } catch (error) {
        console.error("Fiyat hesaplanırken bir hata oluştu.", error);
        res.status(500).json({ error: "Ürünler yüklenirken bir hata oluştu." });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Backend Server is running on http://localhost:${PORT}`);
});