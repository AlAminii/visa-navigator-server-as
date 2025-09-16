const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
// visaNavigator
// 9WEMpp6B2a9XdYJU

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zgntale.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    await client.connect();
    const visaCollection = client.db("visaDB").collection("visas");

    app.get("/", (req, res) => {
      res.send("Visa navigator server");
    });

  

    app.get("/visa",async(req,res)=>{
      const cursor = visaCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })
    
    app.get("/visa/:id", async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await visaCollection.findOne(query)
      res.send(result)
    })

    app.post("/visa", async (req, res) => {
      const newVisa = req.body;
      console.log(newVisa, "add new visa");
      const result = await visaCollection.insertOne(newVisa)
      res.send(result)
    
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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
