const express = require('express');
const path = require('path');
const db = require('./config/connection');
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./schemas');
const { authMiddleware } = require('./utils/auth');


// const routes = require('./routes');


//import our typeDefs and resolvers
// const { typeDefs, resolvers } = require('./schemas');

const app = express();
const PORT = process.env.PORT || 3001;

//create new Apollo server and pass in our schema data
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware
});
apolloServer.applyMiddleware({ app });
app.use(express.urlencoded({extended: true}));
app.use(express.json)
// async function startServer() {
//     apolloServer = new ApolloServer({
//         typeDefs,
//         resolvers,
//     });
//     await apolloServer.start();
//     apolloServer.applyMiddleware({ app });
//   }
// startServer();

    if (process.env.NODE_ENV === 'production') {
      app.use(express.static(path.join(__dirname, '../client/build')));
    }
    
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/build/index.html'));
    });
    
    
    
    // app.use(routes); 
    
    
    db.once('open', () => {
      app.listen(PORT, () => {
        console.log(`API server running on port ${PORT}!`);
        // log where we can go to test our GQL API
        console.log(`Use GraphQL at http://localhost:${PORT}${apolloServer.graphqlPath}`);
    
      });
    });
    
    process.on('uncaughtException', function(err) {
      console.log('Caught exception: ' + err);
    });
  
//integrate our Apollo server with Express application as middleware




// if we're in production, serve client/build as static assets

