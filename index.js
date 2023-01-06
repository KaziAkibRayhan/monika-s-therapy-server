const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("colors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());
// MongDb url and client.
const uri = `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_PASSWORD}@cluster0.7mdpwuk.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function dbConnect() {
  try {
    await client.connect();
    console.log("Connected to Database".bgGreen.bold);
  } catch (error) {
    console.log(error.name.bgRed, error.message.bold);
  }
}
dbConnect();
// Database & Collection

const serviceCollection = client
  .db("monikasTherapy")
  .collection("therapyServices");

// api end point
app.get("/", async (req, res) => {
  try {
    res.send({
      success: true,
      message: "Monika's Therapy Server Running",
    });
  } catch (error) {
    console.log(error.name.bgRed, error.message.bold);
  }
});

app.get("/homeService", async (req, res) => {
  const cursor = serviceCollection.find({}).limit(3);
  const homeServices = await cursor.toArray();

  res.send({
    success: true,
    message: "Successfully got the data",
    data: homeServices,
  });
});




app.listen(port, () =>
  console.log(
    `Monika's Therapy listening at http://localhost:${port}`.cyan.bold
  )
);
