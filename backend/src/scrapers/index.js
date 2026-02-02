const scrapeEventbrite = require("./eventbrite");

const runScrapers = async () => {
    await scrapeEventbrite();
};

module.exports = runScrapers;
