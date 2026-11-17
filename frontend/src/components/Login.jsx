import React, { useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Avatar,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import CustomizedInput from "./shared/CustomizedInput";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import NavigationLink from "./shared/NavigationLink";

const Login = () => {
  const navigate = useNavigate();
  const auth = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const username = data.get("username");
    const password = data.get("password");

    try {
      toast.loading("Iniciando sesión...", { id: "login" });
      await auth?.login(username, password);
      toast.success("Inicio de sesión exitoso ✅", { id: "login" });
      setTimeout(() => toast.dismiss(), 2000);
    } catch (error) {
      console.error(error);
      toast.error("Error al iniciar sesión ❌", { id: "login" });
    }
  };

  useEffect(() => {
    if (auth?.user) {
      return navigate("/dashboard/");
    }
  }, [auth]);

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
      {/* Tarjeta centrada */}
      <Card
        sx={{
          maxWidth: 450,
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
          {/* Icono superior */}
          <Box display="flex" justifyContent="center" mb={2}>
            <Avatar
              sx={{
                bgcolor: "gold",
                width: 70,
                height: 70,
              }}
            >
              <LockIcon sx={{ fontSize: 36, color: "black" }} />
            </Avatar>
          </Box>

          {/* Título */}
          <Typography
            variant="h5"
            textAlign="center"
            fontWeight="bold"
            sx={{ color: "gold" }}
            gutterBottom
          >
            Iniciar Sesión
          </Typography>
          <Typography
            variant="body2"
            textAlign="center"
            sx={{ color: "rgba(255,215,0,0.7)" }}
            mb={3}
          >
            Bienvenido de nuevo, ingresa tus credenciales
          </Typography>

          {/* Formulario */}
          <form onSubmit={handleSubmit}>
            <CustomizedInput
              type="text"
              name="username"
              label="Usuario"
              InputLabelProps={{ style: { color: "gold" } }} // <-- etiqueta dorada
              sx={{
                "& .MuiInputLabel-root": { color: "gold" },
                "& .MuiInputLabel-root.Mui-focused": { color: "gold" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "gold" },
                  "&:hover fieldset": { borderColor: "#d4af37" },
                  "&.Mui-focused fieldset": { borderColor: "gold" },
                  "& input": { color: "gold", caretColor: "gold" },
                },
              }}
            />
            <CustomizedInput
              type="password"
              name="password"
              label="Contraseña"
              InputLabelProps={{ style: { color: "gold" } }} // <-- etiqueta dorada
              sx={{
                "& .MuiInputLabel-root": { color: "gold" },
                "& .MuiInputLabel-root.Mui-focused": { color: "gold" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "gold" },
                  "&:hover fieldset": { borderColor: "#d4af37" },
                  "&.Mui-focused fieldset": { borderColor: "gold" },
                  "& input": { color: "gold", caretColor: "gold" },
                },
              }}
            />

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
                ":hover": {
                  bgcolor: "#d4af37",
                },
              }}
            >
              Entrar
            </Button>
          </form>

          {/* Link regresar */}
          <Box mt={3} textAlign="center">
            <NavigationLink
              bg="rgba(255, 215, 0, 0.1)"
              to="/"
              text="⬅ Volver al inicio"
              textColor="gold"
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
