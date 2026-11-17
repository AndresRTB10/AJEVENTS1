import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Card, CardContent, Typography, Button, Grid } from '@mui/material';
import { getAllEvents } from '../helpers/api_communicator';
import { format } from "date-fns";
import NavigationLink from './shared/NavigationLink';

const CommonEvents = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  // Cargar eventos al montar el componente
  useEffect(() => {
    loadEvents();
  }, [navigate]);

  // Función para obtener todos los eventos desde la API
  const loadEvents = async () => {
    try {
      const response = await getAllEvents();
      const events = response.map(event => ({
        ...event,
        date: new Date(event.date)
      }));
      setEvents(events);
    } catch (error) {
      console.error('Error cargando los eventos:', error);
    }
  }

  return (
    // Contenedor principal con fondo y overlay oscuro
    <Box
      sx={{
        minHeight: '100vh',
        padding: 4,
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
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 2 }}>
        {/* Título principal */}
        <Typography
          variant="h4"
          textAlign="center"
          fontWeight="bold"
          sx={{ color: "gold", mb: 4 }}
        >
          Todos los Eventos
        </Typography>

        {/* Contenedor de tarjetas */}
        <Grid container spacing={3}>
          {events.map((event, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  borderRadius: "20px",
                  boxShadow: "0 8px 20px rgba(255,215,0,0.3)",
                  background: "linear-gradient(145deg, #fff, #f9f5e1)",
                  color: "black",
                  border: "2px solid gold",
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  p: 2,
                  height: '100%',
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 12px 30px rgba(255,215,0,0.5)"
                  }
                }}
              >
                {/* Contenido de la tarjeta */}
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {event.name}
                  </Typography>
                  <Typography variant="body2">Ciudad: {event.city}</Typography>
                  <Typography variant="body2">País: {event.country}</Typography>
                  <Typography variant="body2">
                    Fecha: {format(event.date, "MMMM do, yyyy")}
                  </Typography>
                </CardContent>

                {/* Botones de acción */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  {/* Botón Ver */}
                  <Link
                    to={{ pathname: "/viewCommonEvent" }}
                    state={{ Event: event }}
                    style={{ textDecoration: 'none' }}
                  >
                    <Button
                      variant="contained"
                      sx={{
                        bgcolor: "gold",
                        color: "black",
                        fontWeight: "bold",
                        transition: "transform 0.3s, box-shadow 0.3s",
                        ":hover": {
                          bgcolor: "#d4af37",
                          transform: "scale(1.05)",
                          boxShadow: "0 5px 15px rgba(255,215,0,0.6)"
                        }
                      }}
                    >
                      Ver
                    </Button>
                  </Link>

                  {/* Botón Registrar */}
                  <Link
                    to={{ pathname: "/registerAttendee" }}
                    state={{ Event: event }}
                    style={{ textDecoration: 'none' }}
                  >
                    <Button
                      variant="outlined"
                      sx={{
                        borderColor: "gold",
                        color: "black",
                        fontWeight: "bold",
                        transition: "transform 0.3s, box-shadow 0.3s",
                        ":hover": {
                          borderColor: "#d4af37",
                          transform: "scale(1.05)",
                          boxShadow: "0 5px 15px rgba(255,215,0,0.3)"
                        }
                      }}
                    >
                      Registrar
                    </Button>
                  </Link>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Link de regresar al inicio */}
        <Box mt={4} textAlign="center">
          <NavigationLink
            bg="rgba(255,215,0,0.1)"
            to="/"
            text="⬅ Volver al Inicio"
            textColor="gold"
          />
        </Box>
      </Box>
    </Box>
  )
}

export default CommonEvents;
