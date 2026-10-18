import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "";
const client = new MongoClient(uri);

try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log(
        "Pinged your deployment. You successfully connected to MongoDB!"
    );
} catch(err) {
    console.error(err);
}
const coursesDb = client.db("data1");
const rentalCarsDb = client.db("data2");
const studentsDb = client.db("data3");

export { coursesDb, rentalCarsDb, studentsDb };