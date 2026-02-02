const dotenv = require("dotenv");
dotenv.config();

const app = require("./app");
const connectDB = require("./config/db");
const startScrapeCron = require("./cron/scrapeCron");

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    startScrapeCron(); // 👈 start cron

    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
});
