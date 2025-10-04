const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;


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
    const userCollection = client.db("visaDB").collection("users");
    const applyVisaCollection = client.db("visaDB").collection("applyvisa")


    app.get("/", (req, res) => {
      res.send("Visa navigator server");
    });

  

app.get("/visa", async (req, res) => {
  const limit = parseInt(req.query.limit) || 0;
  const email = req.query.email;
  let query = {}
  if(email){
query = {UserEmail: email}
  }
 

  let cursor = visaCollection.find(query);
  
  if (limit > 0) {
    cursor = cursor.sort({ _id: -1 }).limit(limit);
  }

  const result = await cursor.toArray();
  res.send(result);
});

    
    app.get("/visa/:id", async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await visaCollection.findOne(query)
      res.send(result)
    })

   

    app.post("/visa", async (req, res) => {
      const newVisa = req.body;
      const visa = {
        ...newVisa,
        UserEmail: newVisa.UserEmail

      }
      // console.log( "add new visa", visa);
      const result = await visaCollection.insertOne(visa)
      res.send(result)
    
    });

    app.delete("/visa/:id", async(req,res)=>{

      const id = req.params.id;
      // console.log('delete id', id)
      const query = {_id: new ObjectId(id)}
      const result = await visaCollection.deleteOne(query)
      res.send(result)
    })


    // 

    app.get("/applyvisa", async(req,res)=>{
      const cursor = applyVisaCollection.find();
      const result = await cursor.toArray()
      res.send(result)
    })

    app.post("/applyvisa", async(req,res)=>{
      const newApply = req.body;
      // console.log('new apply', newApply)
      const result = await applyVisaCollection.insertOne(newApply)
      res.send(result)
    })

    app.put('/visa/:id', async(req,res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options = {upsert:true}
      const updateVisa = req.body;

      const updateDoc = {
    $set: {
      img: updateVisa.img,
      country: updateVisa.country,
      visaType: updateVisa.visaType,
      time: updateVisa.time,
      description: updateVisa.description,
      age: updateVisa.age,
      fee: updateVisa.fee,
      validity: updateVisa.validity,
      method: updateVisa.method,
    },
  };
      const result = await visaCollection.updateOne(filter, updateDoc,options)
      res.send(result)
    
    })

    app.delete("/applyvisa/:id",async(req,res)=>{
      const id = req.params.id;
      // console.log('delete id', id)
      const query = {_id: new ObjectId(id)}
      const result = await applyVisaCollection.deleteOne(query)
      res.send(result)
    })


    //  users part

    app.post("/users",async(req,res)=>{
      const newUser = req.body;
      // console.log("new user create", newUser);
      const result = await userCollection.insertOne(newUser)
      res.send(result)
    })

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
