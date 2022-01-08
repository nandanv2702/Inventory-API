import 'reflect-metadata'
import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import { buildSchema } from 'type-graphql'
import { connect } from 'mongoose'
import ProductResolver from './product/product.resolver'
import WarehouseResolver from './warehouse/warehouse.resolver'
import InventoryItemResolver from './inventoryItem/inventoryItem.resolver'

const main = async () => {
    const schema = await buildSchema({
        resolvers: [ProductResolver, WarehouseResolver, InventoryItemResolver]
    })

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

