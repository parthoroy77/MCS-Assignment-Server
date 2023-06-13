const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.h0arnkr.mongodb.net/?retryWrites=true&w=majority`;

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
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const tasksCollection = client.db("mcsDB").collection("tasks");
    // Read Operation
    app.get("/allTask", async (req, res) => {
      const result = await tasksCollection.find().toArray();
      res.send(result);
    });
    // Create Operation
    app.post("/addTask", async (req, res) => {
      const task = req.body;
      const result = await tasksCollection.insertOne(task);
      res.send(result);
    });
    // Update Operations
    app.patch('/updateTask', async (req, res) => {
        const updatedData = req.body;
        const id = req.query.id;
        console.log(updatedData, id);
        const filter = { _id: new ObjectId(id) };
        const updatedDoc = {
            $set: {
                taskTitle: updatedData.taskTitle, description: updatedData.description
            }
        }
        const result = await tasksCollection.updateOne(filter, updatedDoc);
        res.send(result);
    })
    app.patch("/statusUpdate", async (req, res) => {
      const id = req.query.id;
      const status = req.query.status;
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          status: status,
        },
      };
      const result = await tasksCollection.updateOne(filter, updatedDoc);
      res.send(result);
    });
    // Delete Operation
    app.delete("/deleteTask", async (req, res) => {
      const id = req.query.id;
      const result = await tasksCollection.deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Mohite Consultancy Services Server Running");
});

app.listen(port);
