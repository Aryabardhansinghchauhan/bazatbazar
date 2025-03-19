// server.js
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio"); // For scraping websites
const cors = require("cors"); // To allow requests from your frontend

const app = express();
const PORT = 5000;

// Enable CORS to allow cross-origin frontend requests
app.use(cors());

// Route: Homepage
app.get("/", (req, res) => {
  res.send("Welcome to the Product Comparison Backend!");
});

// Mock Comparison API
const compareProducts = async (searchQuery) => {
  // Simulating product prices from Flipkart, Amazon, and Myntra
  return [
    { platform: "Flipkart", product: searchQuery, price: `$${Math.random() * 100}` },
    { platform: "Amazon", product: searchQuery, price: `$${Math.random() * 120}` },
    { platform: "Myntra", product: searchQuery, price: `$${Math.random() * 80}` },
  ];
};

// Route: Compare Products Endpoint
app.get("/compare", async (req, res) => {
  const searchQuery = req.query.q;

  if (!searchQuery) {
    return res.status(400).json({ error: "Please provide a search query (q parameter)." });
  }

  try {
    // Replace this logic with real scraping or API integrations
    const results = await compareProducts(searchQuery);
    res.json({ query: searchQuery, results });
  } catch (error) {
    console.error("Error fetching product data:", error);
    res.status(500).json({ error: "Failed to fetch comparison data." });
  }
});

// Route: Placeholder for Product Scraping (Optional)
app.get("/scrape", async (req, res) => {
  const url = "https://example.com"; // Replace with a real product URL

  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // Scrape product title and price (example selectors)
    const title = $("h1.product-title").text();
    const price = $(".product-price").text();

    res.json({ title, price });
  } catch (error) {
    console.error("Error scraping data:", error);
    res.status(500).json({ error: "Scraping failed." });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
