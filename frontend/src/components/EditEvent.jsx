import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import CustomizedInput from './shared/CustomizedInput';
import { Box, Typography, Button, Card, CardContent, Divider } from '@mui/material';
import { format } from "date-fns";
import NavigationLink from './shared/NavigationLink';
import { updateEvent } from '../helpers/api_communicator';

const EditEvent = () => {
  const auth = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth?.user) {
      navigate("*");
    }
  }, [auth, navigate]);

  const [prevEvent, setPrevEvent] = useState(location?.state?.Event);

  const onInputChange = (e) => {
    setPrevEvent({ ...prevEvent, [e.target.name]: e.target.value });
  };

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
      await updateEvent(`/update/${prevEvent.id}`, name, username, description, place, city, country, date);
      toast.success("Evento actualizado correctamente ✅");
    } catch (error) {
      console.log(error);
      toast.error("Error al actualizar el evento ❌");
    }
  };

  if (!prevEvent) return null;

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
          boxShadow: "0 8px 30px rgba(255, 215, 0, 0.3)",
          p: 3,
          background: "linear-gradient(145deg, #000000, #1a1a1a)",
          color: "gold",
          position: "relative",
          zIndex: 2,
          border: "2px solid gold",
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            textAlign="center"
            fontWeight="bold"
            sx={{ color: "gold" }}
            gutterBottom
          >
            Editar Evento
          </Typography>
          <Divider sx={{ mb: 3, borderColor: "gold" }} />

          <form onSubmit={handleSubmit}>
            {["name", "description", "place", "city", "country"].map((field) => (
              <CustomizedInput
                key={field}
                type="text"
                name={field}
                label={field.charAt(0).toUpperCase() + field.slice(1)}
                value={prevEvent[field]}
                onChange={onInputChange}
                sx={goldInputStyle}
              />
            ))}

            <CustomizedInput
              type="date"
              name="date"
              label="Fecha"
              value={format(new Date(prevEvent.date), "yyyy-MM-dd")}
              onChange={onInputChange}
              sx={goldInputStyle}
            />

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
              💾 Actualizar Evento
            </Button>

            <Box mt={3} textAlign="center">
              <NavigationLink
                bg="rgba(255, 215, 0, 0.1)"
                to="/dashboard"
                text="⬅ Volver al Dashboard"
                textColor="gold"
              />
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

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

export default EditEvent;
