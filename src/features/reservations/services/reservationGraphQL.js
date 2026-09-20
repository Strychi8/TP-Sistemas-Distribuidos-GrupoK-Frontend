import { gql } from "@apollo/client";

export const GET_RESERVAS = gql`
  query GetReservas($filtro: FiltroReserva) {
    reservas(filtro: $filtro) {
      idReserva
      fechaInicio
      fechaFin
      importeTotal
      precioDiario
      estado
      cliente {
        idCliente
        nombre
        apellido
        dni
        email
      }
      vehiculo {
        idVehiculo
        patente
        marca
        modelo
        tipoVehiculo
      }
    }
  }
`;