// const express = require('express');
// const app = express();
// const {MongoClient,ServerApiVersion} = require('mongodb');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const password = 'BfYFTrHtjFZ79ip7';
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cors());


// const uri = "mongodb+srv://rabbi443418:BfYFTrHtjFZ79ip7@testermongo.fea0flo.mongodb.net/?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { 
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// },
//   });



// app.get('/', (req, res) => {
//   res.sendFile(__dirname + "/index.html");
// });



// client.connect(err => {
//   const collection = client.db("organicdata").collection("product");
//   // perform actions on the collection object
//   app.post('/addproduct', function (req, res) {
//     const productitem = req.body;
//     collection.insertOne(productitem)
//     .then(result => {
//       console.log("One product added");
//   });
        
// });
  
//   console.log("database connected");

// });


// app.listen(3000);

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');

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
                    res.send("Product added successfully");
                })
                .catch(err => {
                    console.error("Error adding product:", err);
                    res.status(500).send("Internal server error");
                });
        });
    } finally {
        // Close the MongoDB client when it's no longer needed
        // await client.close();
    }
}

run().catch(console.dir);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
