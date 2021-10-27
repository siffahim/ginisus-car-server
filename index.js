const express = require('express');
const cors = require("cors");
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()


const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.Db_PASS}@cluster0.lyhqa.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        
        const database = client.db('carMachanic');
        const serviceCollection = database.collection('services');

        //Post Api
        app.post('/services', async(req,res) => {
            const service = req.body;
           
            
            const result = await serviceCollection.insertOne(service)
            res.send(JSON.stringify(result));
        })

        //get api
        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.send(services)
        })


        //get single api
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };

            const service = await serviceCollection.findOne(query);
            res.json(service);
        })

        //delete api
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            
            const service = await serviceCollection.deleteOne(query);
            res.json(service)
        })

        //put
        app.put('/services/:id', async (req, res) => {
            const id = req.params.id;
            const updateService = req.body;
            console.log(updateService)
            const query = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name:updateService.name,
                    price: updateService.price
                },
            };
            const result = await serviceCollection.updateOne(query, updateDoc, options)
            res.json(result)
        })

    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir)


app.get("/", (req, res) => {
    res.send("I m ginius car server")
})

app.listen(port, () => {
    console.log("Running ginius server ",port)
})