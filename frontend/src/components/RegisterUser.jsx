import React from 'react';
import { Box, Typography, Button, Card, CardContent } from '@mui/material';
import CustomizedInput from './shared/CustomizedInput';
import { toast } from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { addAttendee } from '../helpers/api_communicator';
import NavigationLink from './shared/NavigationLink';

const AttendeeRegister = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const prevEvent = location?.state.Event;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    const name = data.get("name");
    const email = data.get("email");

    try {
      toast.loading("Registrando asistente...");

      const response = await addAttendee(prevEvent.id, name, email);
      console.log(response);

      toast.success("Registro exitoso ✅");
      setTimeout(() => toast.dismiss(), 3000);

    } catch (error) {
      console.log(error);
      toast.error("Error al registrar ❌");
      setTimeout(() => toast.dismiss(), 3000);
    }

    console.log(name + " y " + email);
    navigate("/allEvents");
  }

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
          border: "2px solid gold",
          position: "relative",
          zIndex: 2,
          p: 3,
        }}
      >
        <CardContent>
          {/* Título */}
          <Typography
            variant="h4"
            textAlign="center"
            fontWeight="bold"
            sx={{ color: "gold", mb: 3 }}
          >
            Registro de Asistente
          </Typography>

          {/* Formulario */}
          <form onSubmit={handleSubmit}>
            <CustomizedInput type="text" name="name" label="Nombre completo" />
            <CustomizedInput type="email" name="email" label="Correo electrónico" />

            {/* Botón de registro */}
            <Button
              type="submit"
              fullWidth
              sx={{
                mt: 3,
                py: 1.5,
                borderRadius: 3,
                fontWeight: "bold",
                fontSize: "1rem",
                bgcolor: "gold",
                color: "black",
                transition: "transform 0.3s, box-shadow 0.3s",
                ":hover": {
                  bgcolor: "#d4af37",
                  transform: "scale(1.05)",
                  boxShadow: "0 5px 15px rgba(255,215,0,0.6)",
                },
              }}
            >
              Registrar al Evento
            </Button>
          </form>

          {/* Botón de regreso */}
          <Box mt={3} textAlign="center">
            <NavigationLink
              bg="rgba(255,215,0,0.1)"
              to="/"
              text="⬅ Volver al Inicio"
              textColor="gold"
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default AttendeeRegister;
