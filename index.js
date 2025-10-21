const express = require('express')
const path = require('path');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const databaseConfig = require("./config/database.config");
const adminRoutes = require("./routes/admin/index.route");
const clientRoutes = require("./routes/client/index.route");
const variableConfig = require("./config/variable.config");

const app = express()
const port = 5001

databaseConfig.connect();

// Set views directory for interface code
app.set('views', path.join(__dirname, "views"))
// Set template engines
app.set('view engine', 'pug')

// Set static file directory
app.use(express.static(path.join(__dirname, "public")))

// Create global variables in PUG files
app.locals.pathAdmin = variableConfig.pathAdmin;

// Create global variables in backend files
global.pathAdmin = variableConfig.pathAdmin;

// Allow sending data in JSON format
app.use(express.json());

// Get variables from cookie
app.use(cookieParser());

app.use(`/${variableConfig.pathAdmin}`, adminRoutes);
app.use("/", clientRoutes);

app.listen(port, () => {
  console.log(`Website is running on port ${port}`)
})