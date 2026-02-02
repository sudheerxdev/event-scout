const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const eventRoutes = require("./routes/eventRoutes");
const emailRoutes = require("./routes/emailRoutes");
