//require necessary packages
const express = require("express");
const path = require("path");

//call default contructor and create express instance
const server = express();

//define PORT
const PORT = process.env.PORT || 3434;

//set up body parsers
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

//make public folder accessible on frontend
server.use(express.static(path.join(__dirname,"/public")));

//attach routes
server.use(require("./routes/apiRoutes"));
server.use(require("./routes/htmlRoutes"));

//listen
server.listen(PORT, () => {
    console.log(`Listening on PORT: ${PORT}`);
});