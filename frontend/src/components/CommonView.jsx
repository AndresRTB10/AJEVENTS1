import React from 'react';
import { useLocation } from 'react-router-dom';
import CustomizedInput from './shared/CustomizedInput';
import { Box, Typography, Card, CardContent } from '@mui/material';
import NavigationLink from './shared/NavigationLink';
import { format } from "date-fns";

const CommonViewEvent = () => {
  const location = useLocation();
  const prevEvent = location?.state?.Event;

  if (!prevEvent) return <Typography color="red">No se encontró el evento</Typography>;

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{
        backgroundImage: "url('/fondo.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        "::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          bgcolor: "rgba(0,0,0,0.5)",
          zIndex: 1,
        },
        p: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 500,
          width: "100%",
          borderRadius: "20px",
          boxShadow: "0 8px 30px rgba(255,215,0,0.3)",
          background: "linear-gradient(145deg, #fff, #f9f5e1)",
          color: "black",
          position: "relative",
          zIndex: 2,
          border: "2px solid gold",
          p: 3,
        }}
      >
        <CardContent>
          <Typography
            variant="h4"
            textAlign="center"
            fontWeight="bold"
            sx={{ color: "gold", mb: 3 }}
          >
            Detalles del Evento
          </Typography>

          {/* Inputs estilizados */}
          <CustomizedInput type="text" name="name" label="Nombre" value={prevEvent.name} disabled />
          <CustomizedInput type="text" name="description" label="Descripción" value={prevEvent.description} disabled />
          <CustomizedInput type="text" name="place" label="Lugar" value={prevEvent.place} disabled />
          <CustomizedInput type="text" name="city" label="Ciudad" value={prevEvent.city} disabled />
          <CustomizedInput type="text" name="country" label="País" value={prevEvent.country} disabled />
          <CustomizedInput type="date" name="date" label="Fecha" value={format(prevEvent.date, "yyyy-MM-dd")} disabled />

          {/* Botón de regreso */}
          <Box mt={3} textAlign="center">
            <NavigationLink
              bg="rgba(255,215,0,0.1)"
              to="/allEvents"
              text="⬅ Volver"
              textColor="gold"
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default CommonViewEvent;
