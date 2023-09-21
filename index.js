var express = require('express')
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://rabbi443418:BfYFTrHtjFZ79ip7@testermongo.fea0flo.mongodb.net/?retryWrites=true&w=majority";
app.use(bodyParser.json());
app.use(cors());


app.get('/',  (req, res)=> {
    res.sendFile(__dirname+"/index.html");
  })


  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });
  async function run() {
    try {
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();
      // Send a ping to confirm a successful connection
      const db = client.db("organicdata");
      const col = db.collection("product");
    //  const collectonDandC= await client.db().collection(); 
    //     //command({ ping: 1 });

      let product={name:"Oill",price:23,quatity:40,
      "contribs": [ "Turing machine", "Turing test", "Turingery" ],
      "views": 1250000}
      const p = await col.insertOne(product)
      .then(res=>{
        console.log("one added");
      });

      console.log("Pinged your deployment. You successfully connected to MongoDB!");
     
    } 
    finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
  }
  run().catch(console.dir);
app.listen(3000);