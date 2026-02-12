const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const deepDiagnose = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`\n--- DB CONNECTION ---`);
        console.log(`URI: ${process.env.MONGO_URI}`);
        console.log(`Database Name: ${conn.connection.db.databaseName}`);

        console.log(`\n--- RAW MONGO INSPECTION ---`);
        const collections = await conn.connection.db.listCollections().toArray();
        for (const coll of collections) {
            const count = await conn.connection.db.collection(coll.name).countDocuments();
            console.log(`Collection [${coll.name}]: ${count} docs`);
            if (coll.name === 'products') {
                const sample = await conn.connection.db.collection(coll.name).findOne({});
                console.log(`Sample Doc Fields (Raw): ${Object.keys(sample || {}).join(', ')}`);
            }
        }

        console.log(`\n--- MONGOOSE MODEL INSPECTION ---`);
        console.log(`Model Name: Product`);
        console.log(`Collection used by Mongoose: ${Product.collection.name}`);
        const mProducts = await Product.find({});
        console.log(`Mongoose Find Count: ${mProducts.length}`);

        if (mProducts.length > 0) {
            const p = mProducts[0];
            console.log(`\nSample Mongoose Doc (First):`);
            console.log(` - ID: ${p._id}`);
            console.log(` - Name: ${p.name}`);
            console.log(` - farmerName: [${p.farmerName}]`);
            console.log(` - farmerPhone: [${p.farmerPhone}]`);
        }

        process.exit();
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
};

deepDiagnose();
