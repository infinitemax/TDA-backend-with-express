const port = process.env.PORT || 3001;
const express = require("express");
const app = express();
const booksRoutes = require("./routes/books")
require('dotenv').config()



app.use(express.json({ extended: false })); // we do this because the browser cannot read json format on it's own. IMPORTANT! NOTE - this did not work without adding ({ extended: false })...

app.use("/books", booksRoutes); // this is the magic line of code that lets us use the "routes" file which makes life easier. 

app.get("/", (req, res) => {
    res.send(`this is the empty main page - try localhost:${port}/books instead`)
})

app.get("/health", (req, res) => {
    res.json({
      status: "okay",
    });
  });


app.listen(port, () => {
    console.log(`app listening on port ${port}`)
})