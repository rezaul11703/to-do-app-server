const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
const bodyParser = require("body-parser");

app.use(cors());
app.use(bodyParser.json());
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
    app.post("/todo", async (req, res) => {
      const newlist = req.body;
      const result = await toDOList.insertOne(newlist);
      console.log(result);
      res.send(result);
    });
    app.get("/todo", async (req, res) => {
      const query = {};
      const cursor = toDOList.find(query);
      const users = await cursor.toArray();
      res.send(users);
    });
    app.listen(port, () => {
      console.log("listening to the port", port);
    });
  } finally {
  }
}

run().catch(console.dir);
