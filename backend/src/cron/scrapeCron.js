const cron = require("node-cron");
const runScrapers = require("../scrapers");

const startScrapeCron = () => {
    // Runs every 6 hours
    cron.schedule("0 */6 * * *", async () => {
        console.log("⏰ Cron job started: scraping events...");
        try {
            await runScrapers();
            console.log("✅ Cron job finished successfully");
        } catch (error) {
            console.error("❌ Cron job error:", error.message);
        }
    });

    console.log("🕒 Scrape cron scheduled (every 6 hours)");
};

module.exports = startScrapeCron;
