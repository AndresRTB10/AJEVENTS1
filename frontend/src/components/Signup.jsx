import React, { useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import CustomizedInput from "./shared/CustomizedInput";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import NavigationLink from "./shared/NavigationLink";

const Signup = () => {
  const navigate = useNavigate();
  const auth = useAuth();

  // 📌 Manejo del envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    const email = data.get("email");
    const password = data.get("password");
    const name = data.get("name");
    const username = data.get("username");

    try {
      toast.loading("Creando cuenta...", { id: "signup" });
      await auth?.signup(name, username, email, password);
      toast.success("Registro exitoso ✅", { id: "signup" });
      setTimeout(() => {
        toast.dismiss();
      }, 3000);
    } catch (error) {
      console.log(error);
      toast.error("Error en el registro ❌", { id: "signup" });
      setTimeout(() => {
        toast.dismiss();
      }, 3000);
    }
  };

  // 📌 Si ya existe usuario autenticado → redirigir al dashboard
  useEffect(() => {
    if (auth?.user) {
      toast.success("Bienvenido al Dashboard 🎉");
      return navigate("/dashboard");
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
      {/* 📌 Tarjeta centrada */}
      <Card
        sx={{
          maxWidth: 450,
          width: "80%",
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
            Crear Cuenta
          </Typography>
          <Typography
            variant="body2"
            textAlign="center"
            sx={{ color: "rgba(255,215,0,0.7)" }}
            mb={3}
          >
            Regístrate para unirte al sistema
          </Typography>

          {/* 📌 Formulario */}
          <form onSubmit={handleSubmit}>
            <CustomizedInput
              type="text"
              name="name"
              label="Nombre completo"
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
              type="text"
              name="username"
              label="Usuario"
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
              type="email"
              name="email"
              label="Correo electrónico"
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

            {/* 📌 Botón principal */}
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
                  bgcolor: "#d4af37", // dorado más oscuro
                },
              }}
            >
              Registrarse
            </Button>
          </form>

          {/* 📌 Enlace de regreso */}
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

export default Signup;
