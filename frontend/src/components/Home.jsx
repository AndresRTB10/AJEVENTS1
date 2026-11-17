import React, { useState } from "react";
import ChatAI from "./ChatAI";
import { Link } from "react-router-dom";

export const Home = () => {
    const [openChat, setOpenChat] = useState(false);
  return (
    <div
      className="full-page"
      style={{
        minHeight: "100vh",
        width: "100vw",
        margin: 0,
        padding: 0,
        color: "white",
        backgroundImage: "url('/fondo.png')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        backgroundPosition: "center",
      }}
    >
      {/* Barra de navegación */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "18px 45px",
          background: "#111",
          borderRadius: "50px",
          position: "fixed",
          top: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "95%",
          maxWidth: "1350px",
          zIndex: 1000,
          boxShadow: "0 6px 20px rgba(0,0,0,0.5)",
        }}
      >
        {/* Logo */}
        <div style={{ fontWeight: "bold", fontSize: "1.7rem", color: "#ffcc00" }}>
          AJ EVENTS
        </div>

        {/* Links */}
        <ul
          style={{
            display: "flex",
            gap: "30px",
            listStyle: "none",
            alignItems: "center",
            margin: 0,
            padding: 0,
            fontSize: "1.1rem",
          }}
        >
          {/* Secciones dentro de la misma página */}
{[
  { name: "Inicio", href: "#home" },
  { name: "Qué nos diferencia", href: "#diferencia" },
  { name: "Sobre Nosotros", href: "#sobre" },

  // DASHBOARD
  { name: "Dashboard", href: "/powerbi", route: true },

  { name: "Contacto", href: "#contacto" },
].map((item, i) => (
  <li key={i}>

    {item.route ? (

      <Link
        to={item.href}
        style={{
          color: "white",
          textDecoration: "none",
          fontWeight: "500",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.target.style.color = "#ffcc00";
          e.target.style.transform = "scale(1.1)";
        }}
        onMouseLeave={(e) => {
          e.target.style.color = "white";
          e.target.style.transform = "scale(1)";
        }}
      >
        {item.name}
      </Link>

    ) : (

      <a
        href={item.href}
        style={{
          color: "white",
          textDecoration: "none",
          fontWeight: "500",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.target.style.color = "#ffcc00";
          e.target.style.transform = "scale(1.1)";
        }}
        onMouseLeave={(e) => {
          e.target.style.color = "white";
          e.target.style.transform = "scale(1)";
        }}
      >
        {item.name}
      </a>

    )}

  </li>
))}

          {/* Botón Acceso */}
          <li>
            <Link
              to="/login"
              style={{
                background: "#1a73e8",
                color: "white",
                borderRadius: "30px",
                padding: "10px 25px",
                fontWeight: "600",
                cursor: "pointer",
                border: "none",
                textDecoration: "none",
                transition: "all 0.3s ease",
                display: "inline-block",
                fontSize: "1.1rem",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "#1669c1";
                e.target.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "#1a73e8";
                e.target.style.transform = "scale(1)";
              }}
            >
              Acceso
            </Link>
          </li>

          {/* Botón Inscribirse */}
          <li>
            <Link
              to="/signup"
              style={{
                background: "#34a853",
                color: "white",
                borderRadius: "30px",
                padding: "10px 25px",
                fontWeight: "600",
                cursor: "pointer",
                border: "none",
                textDecoration: "none",
                transition: "all 0.3s ease",
                display: "inline-block",
                fontSize: "1.1rem",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "#2c8c46";
                e.target.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "#34a853";
                e.target.style.transform = "scale(1)";
              }}
            >
              Inscribirse
            </Link>
          </li>
        </ul>
      </nav>

      {/* Sección Hero */}
      <section
        id="home"
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "3rem", marginBottom: "20px", color: "#ffcc00" }}>
          SU SOLUCIÓN DE GESTIÓN DE EVENTOS
        </h1>
        <Link
          to="/allEvents"
          style={{
            background: "#ffcc00",
            color: "black",
            borderRadius: "20px",
            width: "220px",
            height: "55px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontWeight: "bold",
            fontSize: "1.2rem",
            textDecoration: "none",
          }}
        >
          Ver todos los eventos
        </Link>
      </section>

      {/* Sección Qué nos diferencia */}
      <section
        id="diferencia"
        style={{
          minHeight: "100vh",
          background: "rgba(0,0,0,0.6)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          padding: "60px",
          textAlign: "center",
        }}
      >
        <h2 style={{ fontSize: "2.5rem", marginBottom: "20px", color: "#ffcc00" }}>
          Qué nos diferencia de los demás
        </h2>
        <p style={{ maxWidth: "800px", fontSize: "1.3rem", lineHeight: "1.8" }}>
          Ofrecemos una experiencia única en organización de eventos, con
          herramientas fáciles de usar, personalización total y un equipo siempre
          listo para ayudarte a hacer que tu evento sea inolvidable.
        </p>
      </section>

      {/* Sección Sobre mí */}
      <section
        id="sobre"
        style={{
          minHeight: "100vh",
          background: "rgba(0,0,0,0.7)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          padding: "60px",
          textAlign: "center",
        }}
      >
        <h2 style={{ fontSize: "2.5rem", marginBottom: "20px", color: "#ffcc00" }}>
          Sobre Nosotros
        </h2>
        <p style={{ maxWidth: "800px", fontSize: "1.3rem", lineHeight: "1.8" }}>
          Somos cuatro apasionados por la organización de eventos que buscamos innovar y
          crear experiencias memorables. Con años de experiencia, nuestra misión es
          facilitarte el proceso de planificación.
        </p>
      </section>

      {/* Sección Contacto */}
      <section
        id="contacto"
        style={{
          minHeight: "140vh", // más grande
          background: "rgba(255,255,255,0.15)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          padding: "100px 50px",
          textAlign: "center",
        }}
      >
        <h2 style={{ fontSize: "3.2rem", marginBottom: "30px", color: "#ffcc00" }}>
          Contáctanos
        </h2>
        <p style={{ maxWidth: "700px", marginBottom: "50px", fontSize: "1.3rem" }}>
          Déjanos tu mensaje y nos pondremos en contacto contigo lo antes posible.
        </p>

        <form
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "25px",
            width: "100%",
            maxWidth: "600px", // más ancho
            background: "rgba(0,0,0,0.75)",
            padding: "50px",
            borderRadius: "15px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
          }}
        >
          <input
            type="text"
            placeholder="Tu nombre"
            required
            style={{
              padding: "16px",
              borderRadius: "10px",
              border: "none",
              fontSize: "1.2rem",
            }}
          />
          <input
            type="email"
            placeholder="Tu correo"
            required
            style={{
              padding: "16px",
              borderRadius: "10px",
              border: "none",
              fontSize: "1.2rem",
            }}
          />
          <textarea
            rows="8"
            placeholder="Escribe tu mensaje..."
            required
            style={{
              padding: "16px",
              borderRadius: "10px",
              border: "none",
              fontSize: "1.2rem",
            }}
          ></textarea>
          <button
            type="submit"
            style={{
              padding: "18px",
              background: "#ffcc00",
              color: "#000",
              fontWeight: "bold",
              border: "none",
              borderRadius: "12px",
              fontSize: "1.3rem",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          >
            Enviar mensaje
          </button>
        </form>
      </section>
      {/* BOTÓN CHAT */}
      <div
        onClick={() => setOpenChat(!openChat)}
        style={{
          position: "fixed",
          bottom: "30px",
          right: "30px",
          width: "65px",
          height: "65px",
          borderRadius: "50%",
          background: "#1a73e8",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          fontSize: "28px",
          zIndex: 2000,
          boxShadow: "0 5px 15px rgba(0,0,0,0.4)",
        }}
      >
        💬
      </div>

{/* VENTANA AJ */}
{openChat && (
  <div
    style={{
      position: "fixed",
      bottom: "110px",
      right: "30px",
      width: "380px",
      height: "520px",
      background: "#0b0b0b",
      borderRadius: "18px",
      boxShadow: "0 20px 50px rgba(0,0,0,0.9)",
      overflow: "hidden",
      zIndex: 2000,
      display: "flex",
      flexDirection: "column",
      border: "1px solid rgba(212,175,55,0.6)",
      backdropFilter: "blur(10px)",
    }}
  >
    {/* HEADER AJ */}
    <div
      style={{
        background: "linear-gradient(90deg, #000, #1a1a1a)",
        color: "#d4af37",
        padding: "14px 16px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontWeight: "600",
        letterSpacing: "1px",
        fontSize: "14px",
        borderBottom: "1px solid rgba(212,175,55,0.4)",
      }}
    >
      <span>AJ Assistant</span>

      <button
        onClick={() => setOpenChat(false)}
        style={{
          background: "transparent",
          border: "1px solid #d4af37",
          color: "#d4af37",
          borderRadius: "50%",
          width: "30px",
          height: "30px",
          cursor: "pointer",
          fontSize: "14px",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.target.style.background = "#d4af37";
          e.target.style.color = "#000";
        }}
        onMouseLeave={(e) => {
          e.target.style.background = "transparent";
          e.target.style.color = "#d4af37";
        }}
      >
        ✖
      </button>
    </div>
{/* CONTENIDO AJ */}
<div
  style={{
    flex: 1,
    padding: "12px",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  }}
>
  {/* MENSAJE SUPERIOR */}
  <div
    style={{
      marginBottom: "10px",
      padding: "10px",
      borderRadius: "10px",
      background: "rgba(212,175,55,0.05)",
      border: "1px solid rgba(212,175,55,0.2)",
      color: "#ddd",
      fontSize: "13px",
    }}
  >
    Bienvenido al sistema AJ.
    Consulta, analiza y automatiza procesos con IA.
  </div>

  {/* CONTENEDOR CHAT */}
  <div
    style={{
      flex: 1,
      borderRadius: "12px",
      background: "#050505",
      border: "1px solid rgba(212,175,55,0.15)",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden", // 🔥 importante
    }}
  >
    <ChatAI />
  </div>
</div>

{/* FOOTER AJ */}
<div
  style={{
    padding: "10px",
    borderTop: "1px solid rgba(212,175,55,0.3)",
    textAlign: "center",
    fontSize: "11px",
    color: "#888",
    letterSpacing: "1px",
  }}
>
  AJ Intelligence • Premium UI
</div>
  </div>
)}
    </div>
  );
};

export default Home;
