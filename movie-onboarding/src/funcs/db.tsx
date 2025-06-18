import { MongoClient  } from 'mongodb';
const uri = process.env.MONGODB_URI!;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
export async function run() {
  const client = new MongoClient(uri);
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    const database = client.db('tl-onboarding');
    const col = database.collection('users');
    return { col, client };
  } 
  catch (e) {
    console.error("Error connecting to MongoDB:", e);
  }
}

