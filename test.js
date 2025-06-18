import { MongoClient  } from 'mongodb';

const uri = "mongodb+srv://gabrielklaris:OKqZmR90sNm5qmRU@tl-onboarding.qnklyy9.mongodb.net/?retryWrites=true&w=majority&appName=TL-onboarding";

const client = new MongoClient(uri);

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    const database = client.db('tl-onboarding');
    const collection = database.collection('users');
    const all = await collection.find({}).toArray();
    console.log(all);
    const users = await collection.findOne({userId: "user_2xnQs35DhXqTuQdNgYPcWEfqm5d"});
    console.log(users);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);