const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("colors");
require("dotenv").config();
const jwt = require('jsonwebtoken');

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

// Default Route
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


// only homepage to show 3 data by limit()
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

// get service all data
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

// create a service
app.post("/services", async (req, res) => {
  try {
    const service = req.body;
    const services = await serviceCollection.insertOne(service);
    if (services.acknowledged) {
      res.send({
        success: true,
        message: "Successfully created data!",
        data: services,
      });
    }
  } catch (error) {
    console.log(error.name.bgRed, error.message.bold);
  }
});

// get specific service
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

//get all reviews
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

app.get("/reviews", async (req, res) => {
  try {
    let query = {};
    if (req.query.service_id) {
      query = {
        service_id: req.query.service_id,
      };
    }
    const cursor = reviewCollection.find(query).sort({ _id: -1 });
    const reviews = await cursor.toArray();
    res.send({
      success: true,
      message: "Successfully got the data",
      data: reviews,
    });
  } catch (error) {
    console.log(error.name.bgRed, error.message.bold);
  }
});

// get my review
app.get("/myReviews", async (req, res) => {
  try {
    let query = {};
    if (req.query.email) {
      query = {
        email: req.query.email,
      };
    }
    const cursor = reviewCollection.find(query);
    const myReviews = await cursor.toArray();
    res.send({
      success: true,
      message: "Successfully got the data",
      data: myReviews,
    });
  } catch (error) {
    console.log(error.name.bgRed, error.message.bold);
  }
});

//get specific review
app.get("/myReview/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const query = { _id: ObjectId(id) };
    const myReview = await reviewCollection.findOne(query);
    res.send({
      success: true,
      message: "Successfully got the data",
      data: myReview,
    });
  } catch (error) {
    console.log(error.name.bgRed, error.message.bold);
  }
});

// update review
app.patch("/myReview/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const query = { _id: ObjectId(id) };
    const result = await reviewCollection.updateOne(query, { $set: req.body });
    if (result.matchedCount) {
      res.send({
        success: true,
        message: "Successfully updated data!",
      });
    } else {
      res.send({
        success: false,
        error: "Couldn't update the product",
      });
    }
  } catch (error) {
    console.log(error.name.bgRed, error.message.bold);
  }
});

// delete Review
app.delete("/myReviews/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const query = { _id: ObjectId(id) };
    const result = await reviewCollection.deleteOne(query);
    if (result.deletedCount) {
      res.send({
        success: true,
        message: "Successfully Deleted!",
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
