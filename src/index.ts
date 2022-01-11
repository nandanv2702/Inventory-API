import 'reflect-metadata'
import { createSchema } from './utils/createSchema'
import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import { connect } from 'mongoose'

const main = async () => {
    const schema = await createSchema()

    const apolloServer = new ApolloServer({
        schema
    })

    await apolloServer.start()

    const app = express()

    apolloServer.applyMiddleware({ app })

    connect('mongodb://localhost:27017/inv-gql')

    app.listen(4000, () => {
        console.log('listening on :4000/graphql');
    })
}

main();

