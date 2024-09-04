const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

//MiddleWare
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.COURSE_MANAGEMENT_SECRET_USER}:${process.env.COURSE_MANAGEMENT_SECRET_PASSWORD}@cluster0.luy9u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    //Database and Collection
    const courseCollection = client.db("learnerDB").collection("courses");

    //* Course related APIs
    //!Get all Course--> Read : (CRUD) (Default all get)
    app.get("/courses", async (req, res) => {
      const cursor = courseCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    //! Get Course data by specific ID
    app.get("/courses/:id", async (req, res) => {
      const id = req.params.id;
      try {
        if (!ObjectId.isValid(id)) {
          throw new Error("Invalid ID format");
        }

        const query = { _id: new ObjectId(id) };
        const result = await courseCollection.findOne(query);
        res.send(result);
      } catch (error) {
        console.error("Failed to create ObjectId:", error.message);
        // Handle the error appropriately
      }
    });

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged Server to MongoDB Database Successfully!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello Learner's!");
});

app.listen(port, () => {
  console.log(`Learner's Server listening on port ${port}`);
});
