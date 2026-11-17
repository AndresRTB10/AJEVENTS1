import React, { useState } from "react";
import { request } from "../helpers/axios_helper";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  Alert,
} from "@mui/material";

const PredictAttendance = () => {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [place, setPlace] = useState("");

  const [prediction, setPrediction] = useState("");
  const [error, setError] = useState("");
  const [recommendation, setRecommendation] = useState("");

  const getRecommendation = (value) => {
    const p = value.toLowerCase();

    if (p.includes("baja")) {
      return "La asistencia proyectada es BAJA. Reforzar publicidad, aumentar promoción en redes y evaluar reducción de costos.";
    }
    if (p.includes("media")) {
      return "La asistencia proyectada es MEDIA. Intensifica el marketing, ofrece descuentos y mejora la experiencia del evento.";
    }
    if (p.includes("alta")) {
      return "La asistencia proyectada es ALTA. Refuerza logística, aumenta personal y revisa la capacidad del lugar.";
    }

    return "";
  };

  const handlePredict = async () => {
    if (!name || !city || !country || !place) {
      setError("Todos los campos son obligatorios");
      setPrediction("");
      setRecommendation("");
      return;
    }

    try {
      setError("");
      setPrediction("");
      setRecommendation("");

      const response = await request(
        "GET",
        `/api/predict?name=${name}&city=${city}&country=${country}&place=${place}`
      );

      const value = response.data;
      setPrediction(value);
      setRecommendation(getRecommendation(value));

    } catch (error) {
      console.error("Error al predecir:", error);
      setError("Ocurrió un error. Intenta nuevamente.");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        gap: 3,
        minHeight: "100vh",
        padding: 4,
        backgroundImage: "url('/fondo.png')", // ⬅️ COLOCA AQUÍ LA IMAGEN
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* TARJETA IZQUIERDA */}
      <Card
        sx={{
          p: 3,
          maxWidth: 450,
          backgroundColor: "rgba(0,0,0,0.4)", // TRANSPARENTE OSCURA
          border: "2px solid gold",
          color: "gold",
          backdropFilter: "blur(3px)", // efecto glass
        }}
      >
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, color: "gold" }}>
            Realizar predicción de asistencia
          </Typography>

          {error && (
            <Alert
              severity="error"
              sx={{ mb: 2, backgroundColor: "rgba(0,0,0,0.5)", color: "gold" }}
            >
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Nombre del evento"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{
              mb: 2,
              "& label": { color: "gold" },
              "& input": { color: "gold" },
              "& fieldset": { borderColor: "gold" },
              "& .MuiOutlinedInput-root:hover fieldset": { borderColor: "gold" },
            }}
          />

          <TextField
            fullWidth
            label="Ciudad"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            sx={{
              mb: 2,
              "& label": { color: "gold" },
              "& input": { color: "gold" },
              "& fieldset": { borderColor: "gold" },
              "& .MuiOutlinedInput-root:hover fieldset": { borderColor: "gold" },
            }}
          />

          <TextField
            fullWidth
            label="País"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            sx={{
              mb: 2,
              "& label": { color: "gold" },
              "& input": { color: "gold" },
              "& fieldset": { borderColor: "gold" },
              "& .MuiOutlinedInput-root:hover fieldset": { borderColor: "gold" },
            }}
          />

          <TextField
            fullWidth
            label="Lugar"
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            sx={{
              mb: 2,
              "& label": { color: "gold" },
              "& input": { color: "gold" },
              "& fieldset": { borderColor: "gold" },
              "& .MuiOutlinedInput-root:hover fieldset": { borderColor: "gold" },
            }}
          />

          <Button
            variant="outlined"
            fullWidth
            onClick={handlePredict}
            sx={{
              color: "gold",
              borderColor: "gold",
              "&:hover": {
                borderColor: "gold",
                backgroundColor: "rgba(255,215,0,0.1)",
              },
            }}
          >
            Predecir asistencia
          </Button>

          {prediction && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="body1" sx={{ color: "gold" }}>
                <strong>Resultado:</strong> {prediction}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* TARJETA DERECHA DE RECOMENDACIONES */}
      {recommendation && (
        <Card
          sx={{
            p: 3,
            width: 350,
            backgroundColor: "rgba(0,0,0,0.4)", // transparente oscura
            border: "2px solid gold",
            color: "gold",
            backdropFilter: "blur(3px)",
          }}
        >
          <CardContent>
            <Typography variant="h6" sx={{ mb: 1, color: "gold" }}>
              Recomendaciones
            </Typography>

            <Typography variant="body2" sx={{ color: "gold" }}>
              {recommendation}
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default PredictAttendance;
