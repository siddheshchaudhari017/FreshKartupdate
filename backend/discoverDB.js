const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const discover = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Connected to: ${process.env.MONGO_URI}`);

        const admin = new mongoose.mongo.Admin(conn.connection.db);
        const dbs = await admin.listDatabases();
        console.log('\nDatabases:');
        dbs.databases.forEach(db => console.log(` - ${db.name}`));

        const collections = await conn.connection.db.listCollections().toArray();
        console.log('\nCollections and Counts:');
        for (const coll of collections) {
            const count = await conn.connection.db.collection(coll.name).countDocuments();
            console.log(` - ${coll.name}: ${count}`);
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

discover();
