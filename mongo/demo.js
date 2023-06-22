const { MongoClient } = require('mongodb');
const { updateNew, readNew } = require("./mongo.js");

const main = async () => {
    const uri = "mongodb+srv://offbalance:onbalance@y2proj.6xt0v5e.mongodb.net/?retryWrites=true&w=majority";
    const client = new MongoClient(uri);
    try {
        await client.connect();
        await updateNew(client, { underpants: "Arnav" });
        console.log(await readNew(client));
        await updateNew(client, { underpants: "Daniel" });
        console.log(await readNew(client));
    } finally {
        await client.close();
    }
}

main().catch(console.error);