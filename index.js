
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const mongodb=require('mongodb'); //to work delete
  

const uri = "mongodb+srv://rabbi443418:BfYFTrHtjFZ79ip7@testermongo.fea0flo.mongodb.net/?retryWrites=true&w=majority";

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

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
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
        const db = client.db("organicdata");
        const col1 = db.collection("product");

        // Read data
        app.get('/product', async (req, res) => {
            try {
                const documents = await col1.find({}).toArray();
                res.send(documents);
            } catch (err) {
                console.error("Error reading products:", err);
                res.status(500).send("Internal server error");
            }
        });




        // Insert to MongoDB
        app.post('/addproduct', (req, res) => {
            const productitem = req.body;
            col1.insertOne(productitem)
                .then(result => {
                    console.log("Product added");
                    // res.send("Product added successfully");
                    res.redirect('/');
                })
                .catch(err => {
                    console.error("Error adding product:", err);
                    res.status(500).send("Internal server error");
                });
        });

  //update read  data
  app.get('/updatedata/:id', async(req,res)=>{

    try{

        const docunments=await col1.find({ _id :new mongodb.ObjectId(req.params.id)}).toArray();
        res.send(docunments[0]);
    }
    catch(err){
        console.error("Error Updating product:",err);
        res.status(500).send("Internal server error");
    }
   })

   //update to push data
   app.patch('/updatedata/:id',async(req,res)=>{
    try{
        await col1.updateOne({ _id :new mongodb.ObjectId(req.params.id)},
          {
            $set: {
                pdprice:req.body.price,quantity:req.body.quantityes
              },
              $currentDate: { lastUpdated: true }
              

          })
         
        //   res.send($currentDate > 0);

    }
    catch(err){
        console.error("Error update push products:", err);
        res.status(500).send("Internal server error");
    }


   })


  //delete data
  app.delete('/deletedata/:id',async (req, res)=>{

    try{
     
         const result = await col1.deleteOne({ _id :new mongodb.ObjectId(req.params.id)});
         console.log("Number of documents deleted: " + result.deletedCount);
         res.send(result.deletedCount>0);
        //console.log(req.params.id); 
    }catch (err) {
        console.error("Error reading products:", err);
        res.status(500).send("Internal server error");
    }


  })

// app.delete('/deletedata/:id', (req, res)=>{

//       col1.deleteOne({_id:objectId(req.params.id)})
//       .then(result =>{
//         console.log("Product delete successfully");
//       })
//       .catch(err => {
//         console.error("Error adding product:", err);
//         res.status(500).send("Internal server error");
//     });
     
      
      //console.log("Number of documents deleted: " + result.deletedCount);
        //console.log(req.params.id);  

  //})







    } finally {
        // Close the MongoDB client when it's no longer needed
        // await client.close();
    }
}

run().catch(console.dir);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
