const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json())



const uri = "mongodb+srv://travelDBUser:k0h4JOeXYQ1Z9yGh@cluster0.uftqhoa.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


app.get('/', (req, res) => {
    res.send('travel ease server is running')
})

async function run() {
    try {
        await client.connect();


        const db = client.db('travel-db')
        const travelCollection = db.collection('travels');

        // API calls for allVehicle page

        app.get('/travels', async (req, res) => {
            const result = await travelCollection.find().toArray()
            res.send(result)
        })

        // API calls for single data view details

        app.get('/travels/:id', async (req, res) => {
            const { id } = req.params
            console.log(id)

            const result = await travelCollection.findOne({ _id: new ObjectId(id) })

            res.send({
                success: true,
                result
            })
        })

        // post method for sending data to mongodb

        app.post('/travels', async (req, res) => {
            const data = req.body
            // console.log(data)
            const result = await travelCollection.insertOne(data)
            res.send({
                success: true,
                result
            })
        })

        // put method for updating data
        app.put('/travels/:id', async (req, res) => {
            const { id } = req.params
            const data = req.body
            // console.log(id)
            // console.log(data)

            const objectId = new ObjectId(id)
            const filter = {_id: objectId}
            const update = {
                $set: data
            }

            const result = await travelCollection.updateOne(filter, update)

            res.send({
                success: true,
                result
            })
        })

        // to get latest 6 data

        app.get('/latestVehicles', async (req, res) => {
            const result = await travelCollection.find().sort({createdAt: 'desc'}).limit(6).toArray()
            
            console.log(result)

            res.send(result)
        })



        // -----------------
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }
    finally {
        // await client.close();
    }

}

run().catch(console.dir)


app.listen(port, () => {
    console.log(`travel ease server is running on port: ${port}`)
})