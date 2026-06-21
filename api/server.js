const express = require('express');
const { GoogleGenAI } = require('@google/genai');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname)));

const ai = new GoogleGenAI({ apiKey: "AIzaSyAZfkSxXE-oAc9wBuABOcQEkWl084QlAPc" }); 

// All bag entries set to a uniform flat rate of KSh 360
let bagsData = [
    { id: 1, name: "Vintage Suede TikTok Tote Bag", price: 360, image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600", available: true },
    { id: 2, name: "Y2K Aesthetic Utility Shoulder Bag", price: 360, image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600", available: true },
    { id: 3, name: "TikTok Viral Streetwear Crossbody Mini", price: 360, image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600", available: true },
    { id: 4, name: "Minimalist Soft Leather Hobo Bag", price: 360, image: "https://images.unsplash.com/photo-1566150905458-1bf1fc15a490?w=600", available: true },
    { id: 5, name: "Classic Cargo Denim Backpack", price: 360, image: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=600", available: true },
    { id: 6, name: "Retro Checkerboard Knit Bag", price: 360, image: "https://images.unsplash.com/photo-1575032617751-6ddec2089882?w=600", available: true }
];

app.get('/api/bags', (req, res) => {
    res.json(bagsData);
});

app.post('/api/buy', (req, res) => {
    const { id } = req.body;
    const bagIndex = bagsData.findIndex(b => b.id === parseInt(id));

    if (bagIndex !== -1 && bagsData[bagIndex].available) {
        bagsData[bagIndex].available = false; 
        return res.json({ success: true, message: "Reserved instantly!" });
    }
    res.status(400).json({ success: false, message: "Item unavailable." });
});

app.post('/api/ai', async (req, res) => {
    const { message } = req.body;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `You are Priced AI, the specialized assistant built for 'Jeruu Collections'—a premier online shop selling exclusive thrift bags originally trending on TikTok.
                       Here are your rules:
                       1. Each bag costs exactly KSh 360.
                       2. Shipping to Nakuru costs exactly KSh 1,000.
                       3. Shipping to Free Area costs exactly KSh 534.
                       4. If a user wants to buy, calculate the total cost for them based on their location (Bag price KSh 360 + shipping) and instruct them to send the money to 0790218482 and call immediately to confirm.
                       User message: ${message}`
        });

        res.json({ reply: response.text });
    } catch (error) {
        console.error("Gemini connection error:", error);
        res.json({ reply: "Priced AI is taking a quick break! Call 0790218482 directly to place your order!" });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Jeruu Collections server running at http://localhost:${PORT}`);
});