import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
//import { SetContextLink } from "@apollo/client/link/context";

// Enlace HTTP base
const httpLink = new HttpLink({
  uri: import.meta.env.VITE_GRAPHQL_URL || "http://localhost:8081/graphql",
});

// Preparado para autenticación + JWT
// Cuando se implemente autenticación, se puede habilitar:
//
// const authLink = new SetContextLink((_, { headers }) => {
//   const token = localStorage.getItem("token");
//
//   return {
//     headers: {
//       ...headers,
//       authorization: token ? `Bearer ${token}` : "",
//     },
//   };
// });

const client = new ApolloClient({
  // Cuando se implemente JWT:
  // link: authLink.concat(httpLink),
  link: httpLink,
  cache: new InMemoryCache(),
});

export default client;