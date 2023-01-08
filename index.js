const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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

const reviewCollection = client.db("monikasTherapy").collection("reviews");

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
  try {
    const cursor = serviceCollection.find({}).limit(3);
    const homeServices = await cursor.toArray();

    res.send({
      success: true,
      message: "Successfully got the data",
      data: homeServices,
    });
  } catch (error) {
    console.log(error.name.bgRed, error.message.bold);
  }
});

app.get("/services", async (req, res) => {
  try {
    const cursor = serviceCollection.find({});
    const services = await cursor.toArray();

    res.send({
      success: true,
      message: "Successfully got the data",
      data: services,
    });
  } catch (error) {
    console.log(error.name.bgRed, error.message.bold);
  }
});

app.get("/services/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const query = { _id: ObjectId(id) };
    const service = await serviceCollection.findOne(query);
    res.send({
      success: true,
      message: "Successfully got the data",
      data: service,
    });
  } catch (error) {
    console.log(error.name.bgRed, error.message.bold);
  }
});

app.post("/reviews", async (req, res) => {
  try {
    const review = req.body;
    const result = await reviewCollection.insertOne(review);

    if (result.insertedId) {
      res.send({
        success: true,
        message: "Successfully data inserted!",
      });
    }
  } catch (error) {
    console.log(error.name.bgRed, error.message.bold);
  }
});

app.listen(port, () =>
  console.log(
    `Monika's Therapy listening at http://localhost:${port}`.cyan.bold
  )
);
