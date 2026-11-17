import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  Divider,
} from "@mui/material";
import { format } from "date-fns";
import { getAttendees } from "../helpers/api_communicator";
import backgroundImage from "/fondo.png";

const ViewEvent = () => {
  const [attendees, setAttendees] = useState([]);
  const [eventData, setEventData] = useState(null);

  const auth = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const prevEvent = location?.state?.Event;

  useEffect(() => {
    if (!auth?.user) {
      navigate("*");
    } else {
      setEventData(prevEvent);
      loadAttendees();
    }
  }, [auth, navigate]);

  const loadAttendees = async () => {
    try {
      const data = await getAttendees(`/attendees/${prevEvent.id}`, auth.token);
      setAttendees(data);
    } catch (error) {
      console.error("Error cargando asistentes:", error);
      toast.error("Error cargando asistentes");
    }
  };

  if (!eventData) return null;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: `url(${backgroundImage})`,
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
        p: 2,
      }}
    >
      <Box sx={{ position: "relative", zIndex: 2 }}>
        {/* Botón de volver */}
        <Box sx={{ mb: 2 }}>
          <Button
            variant="outlined"
            sx={{
              color: "gold",
              borderColor: "gold",
              "&:hover": { bgcolor: "rgba(255,215,0,0.2)", borderColor: "gold" },
            }}
            onClick={() => navigate("/dashboard")}
          >
            ⬅ Volver al Dashboard
          </Button>
        </Box>

        <Grid container spacing={4}>
          {/* Panel Izquierdo */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: "0 8px 30px rgba(255, 215, 0, 0.3)",
                p: 3,
                background: "linear-gradient(145deg, #000000, #1a1a1a)",
                color: "gold",
                border: "2px solid gold",
              }}
            >
              <CardContent>
                <Typography
                  variant="h5"
                  textAlign="center"
                  fontWeight="bold"
                  color="gold"
                >
                  Información del Evento
                </Typography>
                <Divider sx={{ my: 2, borderColor: "gold" }} />

                {/* Campos del evento habilitados, fondo negro y texto dorado */}
                {["name", "description", "place", "city", "country", "date"].map(
                  (field) => (
                    <TextField
                      key={field}
                      fullWidth
                      margin="normal"
                      label={field.charAt(0).toUpperCase() + field.slice(1)}
                      value={
                        field === "date" && eventData.date
                          ? format(new Date(eventData.date), "yyyy-MM-dd")
                          : eventData[field] || ""
                      }
                      sx={{
                        "& .MuiInputLabel-root": { color: "gold" },
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "#1a1a1a", // fondo negro
                          "& fieldset": { borderColor: "gold" },
                          "&:hover fieldset": { borderColor: "#d4af37" },
                          "&.Mui-focused fieldset": { borderColor: "gold" },
                          "& input": { color: "gold" }, // texto dorado
                        },
                        mb: 1,
                      }}
                    />
                  )
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Panel Derecho */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: "0 8px 30px rgba(255, 215, 0, 0.3)",
                p: 3,
                background: "linear-gradient(145deg, #000000, #1a1a1a)",
                color: "gold",
                border: "2px solid gold",
              }}
            >
              <CardContent>
                <Typography
                  variant="h5"
                  textAlign="center"
                  fontWeight="bold"
                  color="gold"
                >
                  Detalles y Asistentes
                </Typography>
                <Divider sx={{ my: 2, borderColor: "gold" }} />

                <Typography
                  variant="h6"
                  fontWeight={600}
                  mt={3}
                  mb={1}
                  textAlign="center"
                  color="gold"
                >
                  Asistentes
                </Typography>

                {attendees.length === 0 ? (
                  <Typography textAlign="center" color="gold">
                    No hay asistentes registrados.
                  </Typography>
                ) : (
                  <Grid container spacing={2}>
                    {attendees.map((attendee, index) => (
                      <Grid item xs={12} sm={6} key={attendee.id || index}>
                        <Card
                          sx={{
                            borderRadius: 2,
                            boxShadow: 3,
                            backgroundColor: "#1a1a1a",
                            border: "1px solid gold",
                            "&:hover": {
                              transform: "scale(1.02)",
                              boxShadow: "0 4px 20px rgba(255,215,0,0.5)",
                            },
                            transition: "0.2s",
                          }}
                        >
                          <CardContent>
                            <Typography variant="body1" fontWeight={600} color="gold">
                              {attendee.name}
                            </Typography>
                            <Typography variant="body2" color="gold">
                              {attendee.email}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}

                <Box textAlign="center" mt={3}>
                  <Button
                    sx={{
                      py: 1.5,
                      px: 4,
                      borderRadius: 3,
                      fontWeight: "bold",
                      fontSize: "1rem",
                      bgcolor: "gold",
                      color: "black",
                      ":hover": { bgcolor: "#d4af37" },
                    }}
                    onClick={() =>
                      navigate("/editEvent", { state: { Event: eventData } })
                    }
                  >
                    ✏️ Actualizar Evento
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ViewEvent;
