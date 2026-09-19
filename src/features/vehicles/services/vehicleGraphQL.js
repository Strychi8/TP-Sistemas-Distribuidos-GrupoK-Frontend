import { gql } from "@apollo/client";

export const GET_VEHICULOS_DISPONIBLES = gql`
  query GetVehiculosDisponibles(
    $inicio: String!
    $fin: String!
    $filtro: FiltroDisponibilidad
  ) {
    vehiculosDisponibles(inicio: $inicio, fin: $fin, filtro: $filtro) {
      idVehiculo
      patente
      marca
      modelo
      anio
      color
      tipoVehiculo
      precioDiario
      estado
      activo
    }
  }
`;
