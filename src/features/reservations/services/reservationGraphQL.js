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

export const GET_HISTORIAL_ALQUILERES = gql`
  query GetHistorialAlquileres($idCliente: ID!) {
    historialAlquileres(idCliente: $idCliente) {
      vehiculo
      patente
      fechaInicio
      fechaFinalizacion
      cantidadDias
      importeTotal
      estado
    }
  }
`;