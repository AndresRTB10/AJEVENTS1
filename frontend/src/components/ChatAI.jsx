import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../config";

const ChatAI = () => {
  const [mensaje, setMensaje] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const chatRef = useRef(null);

  const enviarMensaje = async () => {
    if (!mensaje.trim()) return;

    const nuevoMensaje = { tipo: "usuario", texto: mensaje };
    setChat((prev) => [...prev, nuevoMensaje]);

    setMensaje("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/ai/preguntar`,
        { mensaje }
      );

      setChat((prev) => [
        ...prev,
        { tipo: "ia", texto: response.data },
      ]);
    } catch (error) {
      setChat((prev) => [
        ...prev,
        {
          tipo: "ia",
          texto: "Error: " + (error.response?.data || error.message),
        },
      ]);
    }

    setLoading(false);
  };

  // 🔥 Auto-scroll
  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [chat, loading]);

  return (
    <div style={styles.container}>

      {/* MENSAJES */}
      <div style={styles.chatBox} ref={chatRef}>
        {chat.map((msg, index) => (
          <div
            key={index}
            style={{
              ...styles.mensaje,
              alignSelf:
                msg.tipo === "usuario" ? "flex-end" : "flex-start",
              background:
                msg.tipo === "usuario" ? "#d4af37" : "#1c1c1c",
              color: msg.tipo === "usuario" ? "#000" : "#f5f5f5",
            }}
          >
            {msg.texto}
          </div>
        ))}

        {loading && (
          <div style={{ ...styles.mensaje, background: "#1c1c1c", color: "#f5f5f5" }}>
            IA está escribiendo...
          </div>
        )}
      </div>

      {/* INPUT */}
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          placeholder="Escribe tu mensaje..."
          style={styles.input}
          onKeyDown={(e) => e.key === "Enter" && enviarMensaje()}
        />
        <button onClick={enviarMensaje} style={styles.boton}>
          ➤
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%", // 🔥 CLAVE
    width: "100%",
    background: "#000",
  },

  chatBox: {
    flex: 1, // 🔥 ocupa todo el espacio disponible
    overflowY: "auto",
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  mensaje: {
    padding: "10px",
    borderRadius: "10px",
    maxWidth: "75%",
    fontSize: "14px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
  },

  inputContainer: {
    display: "flex",
    borderTop: "1px solid #d4af37",
    background: "#111",
  },

  input: {
    flex: 1,
    padding: "10px",
    border: "none",
    outline: "none",
    background: "#111",
    color: "#fff",
  },

  boton: {
    padding: "10px 15px",
    border: "none",
    background: "#d4af37",
    color: "#000",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default ChatAI;