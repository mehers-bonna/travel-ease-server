const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
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


        const db = client.db('travel_db')
        const travelsCollection = db.collection('travels');

        app.post('/travels', async (req, res) => {
            const newTravels = req.body;
            const result = await travelsCollection.insertOne(newTravels);
            res.send(result);
        })


        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }
    finally {
        await client.close();
    }

}

run().catch(console.dir)


app.listen(port, () => {
    console.log(`travel ease server is running on port: ${port}`)
})