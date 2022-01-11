import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

export const mongoserver = async () => { return await MongoMemoryServer.create() }

const dbName = "inv-gql-test"

/**
 * connect to mock in-memory database
 */
export const setupConnection = async (mongod: MongoMemoryServer) => {
    try {
        const uri = mongod.getUri()

        const mongooseOpts = {
            useNewUrlParser: true,
            dbName,
        };

        return await mongoose.connect(uri, mongooseOpts);
    } catch (err) {
        console.error(`Error: ${err.name}\nMessage:${err.message}`);

        return false
    }

}

/**
 * Close database connection
 */
export const closeDatabase = async (mongod: MongoMemoryServer) => {
    try {
        await mongoose.connection.db.dropDatabase()
        await mongoose.connection.close();
        await mongod.stop();
        return true
    } catch (err) {
        console.error(`Error: ${err.name}\nMessage:${err.message}`);

        return false
    }

}

/**
 * Delete db collections
 */
export const clearDatabase = async () => {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany({});
    }
}