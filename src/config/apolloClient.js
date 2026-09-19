import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";

// 1. Configuramos el enlace base de la URL
const httpLink = HttpLink({
  uri: "http://localhost:4000/graphql", // Tu URL de GraphQL
});
/*
PARA TENER EN CUENTA AL IMPLEMENTAR AAUTENTICAION + JWT

// 2. Interceptamos cada petición para inyectar el token automáticamente
const authLink = SetContextLink((_, { headers }) => {
  // Buscamos el token donde sea que lo guardes (usualmente localStorage)
  const token = localStorage.getItem("token");

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});
*/

// 3. Creamos el cliente uniendo el interceptor con el enlace HTTP
export const client = new ApolloClient({
  // link: authLink.concat(httpLink), // CON AUTH + JWT
  link: httpLink,
  cache: new InMemoryCache(),
});
