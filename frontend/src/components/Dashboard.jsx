import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import RecommendationButton from "./RecommendationButton";
import PredictAttendance from "./PredictAttendance";
import AddEvent from "./AddEvent";
import ChatAssistant from "./ChatAssistant";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Card,
  CardContent,
  Typography,
  CardActions,
  Grid,
  Box,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";


import { useNavigate } from "react-router-dom";
import { getEvents, getAttendees } from "../helpers/api_communicator";
import { request } from "../helpers/axios_helper";
import { format } from "date-fns";

import {
  Email,
  Person,
  Public,
  CalendarToday,
} from "@mui/icons-material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";


const drawerWidth = 220;

const Dashboard = () => {
    const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

  const [events, setEvents] = useState([]);
  const [selectedView, setSelectedView] = useState("events");
  const [attendeesData, setAttendeesData] = useState({}); // Guardará asistentes por evento
  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    if (!auth?.user) {
      navigate("*");
    } else {
      loadEvents();
    }
  }, [auth, navigate]);

  const loadEvents = async () => {
    try {
      const response = await getEvents();
      const eventsFormatted = response.map((event) => ({
        ...event,
        date: new Date(event.date),
      }));
      setEvents(eventsFormatted);
    } catch (error) {
      console.error("Error cargando eventos:", error);
    }
  };

  // 🔹 Cargar asistentes de cada evento
  const loadAttendeesForReports = async () => {
    try {
      const dataMap = {};
      for (const event of events) {
        const data = await getAttendees(`/attendees/${event.id}`, auth.token);
        dataMap[event.id] = data;
      }
      setAttendeesData(dataMap);
    } catch (error) {
      console.error("Error cargando asistentes para reportes:", error);
    }
  };

  const onDelete = async (id) => {
    try {
      await request("DELETE", `/delete/${id}`, {});
      loadEvents();
    } catch (error) {
      console.error("Error eliminando evento:", error);
    }
  };

  const handleLogout = () => {
    auth.logout();
    navigate("/");
  };

  // 📊 Estadísticas generales
  const totalEventos = events.length;
  const totalPaises = [...new Set(events.map((e) => e.country?.trim().toLowerCase()))].length;
  const totalCiudades = [...new Set(events.map((e) => e.city?.trim().toLowerCase()))].length;
  const ultimoEvento = events.length > 0 ? events.reduce((a, b) => (a.date > b.date ? a : b)) : null;

  // 📊 Gráfico de barras
  const cityData = Object.values(
    events.reduce((acc, e) => {
      const city = e.city?.trim().toLowerCase();
      if (city) {
        if (!acc[city]) {
          acc[city] = { name: city.charAt(0).toUpperCase() + city.slice(1), eventos: 0 };
        }
        acc[city].eventos += 1;
      }
      return acc;
    }, {})
  );

  return (
    <Box sx={{ display: "flex" }}>
      {/* 🧭 Menú lateral */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#2C2C2C",
            color: "white",
          },
        }}
      >
        <Typography variant="h6" sx={{ p: 2, textAlign: "center", fontWeight: "bold" }}>
          Dashboard
        </Typography>
        <Divider sx={{ borderColor: "rgba(255,255,255,0.2)" }} />
        <List>
          <ListItem button onClick={() => setSelectedView("events")}>
            <ListItemText primary="📅 Eventos" />
          </ListItem>
          <ListItem button onClick={() => setSelectedView("addEvent")}>
            <ListItemText primary="➕ Crear Evento" />
          </ListItem>
          <ListItem button onClick={() => setSelectedView("profile")}>
            <ListItemText primary="👤 Perfil" />
          </ListItem>
        <ListItem button onClick={() => setSelectedView("predict")}>
          <ListItemText primary="🔮 Predicciones" />
        </ListItem>


          <ListItem button onClick={() => setSelectedView("stats")}>
            <ListItemText primary="📊 Estadísticas" />
          </ListItem>
          <ListItem
            button
            onClick={() => {
              setSelectedView("reports");
              loadAttendeesForReports();
            }}
          >
            <ListItemText primary="📑 Reportes" />
          </ListItem>
          <Divider sx={{ borderColor: "rgba(255,255,255,0.2)", my: 1 }} />
 <ListItem
   button
   onClick={() => setOpenLogoutDialog(true)}
   sx={{ mt: "auto", color: "red" }}
 >
   <ListItemText primary="🚪 Cerrar sesión" />
 </ListItem>

        </List>
      </Drawer>

      {/* Contenido principal */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {/* Vista de eventos */}
        {selectedView === "events" && (
          <>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
              Eventos
            </Typography>
            <Grid container spacing={3}>
              {events.map((event, index) => (
                <Grid item xs={12} sm={6} md={4} key={event.id || index}>
                  <Card
                    sx={{ borderRadius: "16px", boxShadow: 3, cursor: "pointer" }}
                    onClick={() => navigate("/ViewEvent", { state: { Event: event } })}
                  >
                    <CardContent>
                      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                        {event.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        📍 {event.city}, {event.country}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        📅 {format(event.date, "MMMM dd, yyyy")}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(event.id);
                        }}
                      >
                        Eliminar
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}

        {/* Crear evento */}
        {selectedView === "addEvent" && (
          <>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
              Crear Evento
            </Typography>
            <AddEvent onEventAdded={loadEvents} />
          </>
        )}

{/* Perfil */}
{selectedView === "profile" && (
  <Box
    sx={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundImage: "url('/fondo.png')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      padding: 3,
    }}
  >
    <Card
      sx={{
        p: 4,
        borderRadius: "20px",
        maxWidth: 450,
        width: "100%",
        background: "rgba(0, 0, 0, 0.4)", // Transparencia suave
        backdropFilter: "blur(6px)",
        border: "2px solid #FFD700",
        color: "#FFD700",
        textAlign: "center",
      }}
    >
      <CardContent>
        <Avatar
          sx={{
            bgcolor: "transparent",
            border: "2px solid #FFD700",
            color: "#FFD700",
            width: 90,
            height: 90,
            fontSize: "2.2rem",
            margin: "0 auto 20px auto",
          }}
        >
          {auth?.user?.username?.charAt(0).toUpperCase() || "U"}
        </Avatar>

        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3 }}>
          {auth?.user?.fullName || auth?.user?.username || "Usuario"}
        </Typography>

        <Box sx={{ textAlign: "left", px: 4 }}>
          <Typography sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
            <Email fontSize="small" /> {auth?.user?.email || "No registrado"}
          </Typography>

          <Typography sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
            <Person fontSize="small" /> Usuario: {auth?.user?.username || "N/A"}
          </Typography>

          <Typography sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
            <Public fontSize="small" /> País: {auth?.user?.country || "Desconocido"}
          </Typography>

          <Typography sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
            <CalendarToday fontSize="small" />
            Miembro desde:{" "}
            {auth?.user?.createdAt
              ? format(new Date(auth.user.createdAt), "MMMM dd, yyyy")
              : "N/A"}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  </Box>
)}



        {/* Estadísticas */}
        {selectedView === "stats" && (
          <>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
              Estadísticas
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ p: 2, textAlign: "center", background: "#E3F2FD" }}>
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                    {totalEventos}
                  </Typography>
                  <Typography variant="body2">Eventos creados</Typography>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ p: 2, textAlign: "center", background: "#FFF3E0" }}>
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                    {totalPaises}
                  </Typography>
                  <Typography variant="body2">Países alcanzados</Typography>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ p: 2, textAlign: "center", background: "#F3E5F5" }}>
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                    {totalCiudades}
                  </Typography>
                  <Typography variant="body2">Ciudades diferentes</Typography>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ p: 2, textAlign: "center", background: "#E8F5E9" }}>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    Último evento
                  </Typography>
                  <Typography variant="body2">
                    {ultimoEvento
                      ? `${ultimoEvento.name} (${format(ultimoEvento.date, "dd/MM/yyyy")})`
                      : "N/A"}
                  </Typography>
                </Card>
              </Grid>
            </Grid>

            <Box sx={{ mt: 4 }}>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
                Eventos por ciudad
              </Typography>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={cityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="eventos" fill="#1976d2" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </>
        )}
{selectedView === "predict" && (
  <>
    <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
      🔮 Módulo Predictivo
    </Typography>
    <PredictAttendance />
  </>
)}



        {/* 📑 Sección de Reportes */}
        {selectedView === "reports" && (
          <>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
              Reportes
            </Typography>

            <Typography variant="h6" sx={{ mb: 2 }}>
              📋 Reporte de Asistentes y Eventos
            </Typography>

            <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Evento</strong></TableCell>
                    <TableCell><strong>Ciudad</strong></TableCell>
                    <TableCell><strong>País</strong></TableCell>
                    <TableCell><strong>Fecha</strong></TableCell>
                    <TableCell><strong>Asistentes</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {events.length > 0 ? (
                    events.map((event, i) => (
                      <TableRow key={i}>
                        <TableCell>{event.name}</TableCell>
                        <TableCell>{event.city}</TableCell>
                        <TableCell>{event.country}</TableCell>
                        <TableCell>{format(event.date, "dd/MM/yyyy")}</TableCell>
                        <TableCell>
                          {attendeesData[event.id]?.length > 0 ? (
                            attendeesData[event.id].map((a, idx) => (
                              <Typography key={idx} variant="body2">
                                • {a.name} ({a.email})
                              </Typography>
                            ))
                          ) : (
                            "No hay asistentes"
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No hay datos disponibles.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>


          </>
        )}
     <Dialog
                  open={openLogoutDialog}
                  onClose={() => setOpenLogoutDialog(false)}
                  PaperProps={{
                    sx: {
                      background: "rgba(0,0,0,0.6)",
                      backdropFilter: "blur(10px)",
                      border: "2px solid #FFD700",
                      color: "#FFD700",
                      borderRadius: "16px",
                      p: 2,
                      textAlign: "center",
                    },
                  }}
                >
                  <DialogTitle sx={{ fontWeight: "bold" }}>
                    ¿Estás seguro que quieres cerrar sesión?
                  </DialogTitle>

                  <DialogActions sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}>
                    <Button
                      variant="contained"
                      sx={{
                        background: "red",
                        color: "white",
                        fontWeight: "bold",
                        px: 3,
                      }}
                      onClick={handleLogout}
                    >
                      Cerrar sesión
                    </Button>

                    <Button
                      variant="outlined"
                      sx={{
                        borderColor: "#FFD700",
                        color: "#FFD700",
                        fontWeight: "bold",
                        px: 3,
                      }}
                      onClick={() => setOpenLogoutDialog(false)}
                    >
                      Cancelar
                    </Button>
                  </DialogActions>
                </Dialog>
      </Box>
      <ChatAssistant />
      <RecommendationButton />
    </Box>
  );
};

export default Dashboard;
