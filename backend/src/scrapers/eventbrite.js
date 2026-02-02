const axios = require("axios");
const cheerio = require("cheerio");
const Event = require("../models/Event");

const EVENTBRITE_URL =
    "https://www.eventbrite.com.au/d/australia--sydney/events/";

const scrapeEventbrite = async () => {
    console.log("🕷️ Scraping Eventbrite...");

    const { data } = await axios.get(EVENTBRITE_URL, {
        headers: {
            "User-Agent": "Mozilla/5.0",
        },
    });

    const $ = cheerio.load(data);

    const scrapedUrls = [];

    $(".search-event-card-wrapper").each(async (_, el) => {
        const title = $(el).find("h3").text().trim();
        const eventUrl = $(el).find("a").attr("href");
        const datetime = $(el).find("time").text().trim();
        const venue = $(el).find(".card-text--truncated__one").text().trim();

        if (!eventUrl || !title) return;

        scrapedUrls.push(eventUrl);

        const existingEvent = await Event.findOne({ eventUrl });

        if (!existingEvent) {
            // NEW EVENT
            await Event.create({
                title,
                datetime,
                venue,
                city: "Sydney",
                source: "Eventbrite",
                eventUrl,
                status: "new",
                lastScrapedAt: new Date(),
            });

            console.log("🟢 New event:", title);
        } else {
            // CHECK FOR UPDATE
            if (
                existingEvent.title !== title ||
                existingEvent.datetime !== datetime ||
                existingEvent.venue !== venue
            ) {
                existingEvent.title = title;
                existingEvent.datetime = datetime;
                existingEvent.venue = venue;
                existingEvent.status = "updated";
                existingEvent.lastScrapedAt = new Date();

                await existingEvent.save();
                console.log("🔵 Updated event:", title);
            } else {
                existingEvent.lastScrapedAt = new Date();
                await existingEvent.save();
            }
        }
    });

    // MARK INACTIVE EVENTS
    const allEvents = await Event.find({ source: "Eventbrite" });

    for (const event of allEvents) {
        if (!scrapedUrls.includes(event.eventUrl)) {
            event.status = "inactive";
            await event.save();
            console.log("⚫ Inactive event:", event.title);
        }
    }

    console.log("✅ Eventbrite scraping done");
};

module.exports = scrapeEventbrite;
