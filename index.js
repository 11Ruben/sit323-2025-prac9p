const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const app = express();
const port = 3040;

// MongoDB setup
const uri = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:27017/${process.env.MONGO_DB}?authSource=${process.env.MONGO_DB}`;
const client = new MongoClient(uri);
let db;

app.use(express.json());

// Connect to MongoDB
async function connectToMongoDB() {
    try {
        await client.connect();
        db = client.db(process.env.MONGO_DB);
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("MongoDB connection failed:", err.message);
    }
}
connectToMongoDB();

// Default route
app.get("/", (req, res) => {
    res.send("Welcome! Use Postman to POST a calculation and use GET /history to view past calculations");
});

// POST /calculate to perform different arithmetic operation
app.post("/calculate", async (req, res) => {
    const { n1, n2, operation } = req.body;

    if (typeof n1 !== "number" || typeof n2 !== "number" || !operation) {
        return res.status(400).json({ error: "Invalid input" });
    }

    let result;
    switch (operation) {
        case "add": result = n1 + n2; break;
        case "subtract": result = n1 - n2; break;
        case "multiply": result = n1 * n2; break;
        case "divide":
            if (n2 === 0) return res.status(400).json({ error: "Cannot divide by zero." });
            result = n1 / n2;
            break;
        default:
            return res.status(400).json({ error: "Unsupported operation" });
    }

    res.json({ statuscode: 200, result });

    try {
        await db.collection("calculations").insertOne({
            operation,
            n1,
            n2,
            result,
            timestamp: new Date()
        });
    } catch (err) {
        console.error("Failed to POST calculation:", err.message);
    }
});

// GET /history to view all calculation history
app.get("/history", async (req, res) => {
    try {
        const history = await db.collection("calculations").find({}).toArray();
        res.json(history);
    } catch (err) {
        res.status(500).send("Failed to read history: " + err.message);
    }
});

// DELETE /delete/id to delete calculation by ID
app.delete("/delete/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const result = await db.collection("calculations").deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "No calculation found with that ID" });
        }

        res.json({ statuscode: 200, message: "calculation deleted" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete calculation: " + err.message });
    }
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
