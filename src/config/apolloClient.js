import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

// Enlace HTTP base
const httpLink = new HttpLink({
  uri: import.meta.env.VITE_GRAPHQL_URL || "http://localhost:8081/graphql",
});

const authLink = setContext((_, { headers }) => {
  const token = sessionStorage.getItem("rentar_token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;