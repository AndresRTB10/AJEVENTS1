import React, { useEffect } from 'react'
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import CustomizedInput from './shared/CustomizedInput';
import {
  Box,
  Typography,
  Button,
  Grid,
  Divider,
  Card,
  CardContent
} from '@mui/material'
import { addEvent } from '../helpers/api_communicator';
import NavigationLink from './shared/NavigationLink';

const AddEvent = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth?.user) {
      return navigate("*");
    }
  }, [auth, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    const name = data.get("name");
    const description = data.get("description");
    const place = data.get("place");
    const city = data.get("city");
    const country = data.get("country");
    const date = data.get("date");

    const username = auth.user.username;

    try {
      const response = await addEvent(
        name, username, description, place, city, country, date
      );
      console.log(response);
      toast.success("Evento agregado correctamente ✅");
    } catch (error) {
      console.log(error);
      toast.error("Error al agregar el evento ❌");
    }

    console.log(username + " creó el evento " + name);
  };

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
          bgcolor: "rgba(0,0,0,0.6)",
          zIndex: 1,
        },
      }}
    >
      <Card
        sx={{
          maxWidth: 1000,
          width: "100%",
          borderRadius: "20px",
          boxShadow: "0 8px 30px rgba(255, 215, 0, 0.3)", // sombra dorada
          p: 3,
          background: "linear-gradient(145deg, #000000, #1a1a1a)", // negro degradado
          color: "gold",
          position: "relative",
          zIndex: 2,
          border: "2px solid gold", // borde dorado
        }}
      >
        <CardContent>
          {/* 📌 Título */}
          <Typography
            variant="h5"
            textAlign="center"
            fontWeight="bold"
            sx={{ color: "gold" }}
            gutterBottom
          >
            Crear Nuevo Evento
          </Typography>
          <Divider sx={{ mb: 3, borderColor: "gold" }} />

          {/* 📌 Formulario */}
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <CustomizedInput
                  type="text"
                  name="name"
                  label="Nombre del evento"
                  sx={goldInputStyle}
                />
              </Grid>
              <Grid item xs={12}>
                <CustomizedInput
                  type="text"
                  name="description"
                  label="Descripción"
                  sx={goldInputStyle}
                />
              </Grid>
              <Grid item xs={6}>
                <CustomizedInput
                  type="text"
                  name="place"
                  label="Lugar"
                  sx={goldInputStyle}
                />
              </Grid>
              <Grid item xs={6}>
                <CustomizedInput
                  type="text"
                  name="city"
                  label="Ciudad"
                  sx={goldInputStyle}
                />
              </Grid>
              <Grid item xs={6}>
                <CustomizedInput
                  type="text"
                  name="country"
                  label="País"
                  sx={goldInputStyle}
                />
              </Grid>
              <Grid item xs={6}>
                <CustomizedInput
                  type="date"
                  name="date"
                  label="Fecha"
                  sx={goldInputStyle}
                />
              </Grid>
            </Grid>

            {/* 📌 Botón principal */}
            <Button
              type="submit"
              fullWidth
              sx={{
                mt: 4,
                py: 1.5,
                borderRadius: 3,
                fontWeight: "bold",
                fontSize: "1rem",
                bgcolor: "gold",
                color: "black",
                ":hover": {
                  bgcolor: "#d4af37",
                },
              }}
            >
              ➕ Agregar Evento
            </Button>
          </form>

          {/* 📌 Link de volver */}
          <Box mt={3} textAlign="center">
            <NavigationLink
              bg="rgba(255, 215, 0, 0.1)"
              to="/dashboard"
              text="⬅ Volver al Dashboard"
              textColor="gold"
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

// 🎨 Estilo reutilizable para inputs dorados
const goldInputStyle = {
  "& .MuiInputLabel-root": { color: "gold" },
  "& .MuiInputLabel-root.Mui-focused": { color: "gold" },
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "gold" },
    "&:hover fieldset": { borderColor: "#d4af37" },
    "&.Mui-focused fieldset": { borderColor: "gold" },
    "& input": { color: "gold", caretColor: "gold" },
  },
};

export default AddEvent;
