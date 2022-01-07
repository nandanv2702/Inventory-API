import 'reflect-metadata'
import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import { buildSchema } from 'type-graphql'

const main = async () => {
    const schema = await buildSchema({
        resolvers: [__dirname + "./**/*.resolver.{ts,js}"]
    })
    
    const apolloServer = new ApolloServer({
        schema
    })

    await apolloServer.start()

    const app = express()

    apolloServer.applyMiddleware({ app })

    app.listen(4000, () => {
        console.log('listening on :4000/graphql');
    })
}

main();

