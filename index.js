const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
const bodyParser = require("body-parser");
const ObjectId = require("mongodb").ObjectId;

app.use(cors());
app.use(express.json());
const uri =
  "mongodb+srv://db-todo1:72XVa7s1Tq6TOPMT@cluster0.sot2j.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    client.connect();
    const toDOList = client.db("CreateList").collection("dotask");
    const completeList = client.db("CreateList").collection("complete");
    app.post("/todo", async (req, res) => {
      const newlist = req.body;
      const result = await toDOList.insertOne(newlist);
      res.send(result);
    });
    app.post("/completelist", async (req, res) => {
      const newlist = req.body;
      const result = await completeList.insertOne(newlist);
      res.send(result);
    });
    app.get("/completelist", async (req, res) => {
      const query = {};
      const cursor = completeList.find(query);
      const users = await cursor.toArray();
      res.send(users);
    });
    app.get("/todo", async (req, res) => {
      const query = {};
      const cursor = toDOList.find(query);
      const users = await cursor.toArray();
      res.send(users);
    });
    app.delete("/todo/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await toDOList.deleteOne(query);
      res.send(result);
    });
    app.put("/todo/:id", async (req, res) => {
      const id = req.params.id;
      let updatedtask = req.body;
      console.log(updatedtask.task);
      const query = { _id: ObjectId(id) };
      const options = { upsert: false };
      let updateDoc = {
        $set: {
          task: updatedtask.task,
        },
      };
      const result = await toDOList.updateOne(query, updateDoc, options);
      res.send(result);
    });
    app.listen(port, () => {
      console.log("listening to the port", port);
    });
  } finally {
  }
}

run().catch(console.dir);
