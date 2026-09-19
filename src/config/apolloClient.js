import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const apolloClient = new ApolloClient({
  link: new HttpLink({
    uri: import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:8081/graphql',
  }),
  cache: new InMemoryCache(),
});

export default apolloClient;