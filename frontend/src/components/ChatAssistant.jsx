import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const ChatAssistant = () => {
  const [open, setOpen] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  const [chat, setChat] = useState([
    {
      tipo: "ia",
      texto: "Hola 👋 Soy AJ Assistant",
    },
  ]);

  const chatRef = useRef(null);

  // Auto Scroll
  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [chat, loading]);

  // Enviar mensaje
  const enviarMensaje = async () => {
    if (!mensaje.trim()) return;

    const textoUsuario = mensaje;

    setChat((prev) => [
      ...prev,
      {
        tipo: "usuario",
        texto: textoUsuario,
      },
    ]);

    setMensaje("");
    setLoading(true);

    try {
      const response = await axios.get(
        "http://localhost:8080/mcp/chat",
        {
          params: {
            message: textoUsuario,
          },
        }
      );

      setChat((prev) => [
        ...prev,
        {
          tipo: "ia",
          texto: response.data,
        },
      ]);
    } catch (error) {
      setChat((prev) => [
        ...prev,
        {
          tipo: "ia",
          texto: "❌ Error conectando con Spring Boot",
        },
      ]);
    }

    setLoading(false);
  };

  return (
    <>
      {/* BOTÓN FLOTANTE */}
      <button
        onClick={() => setOpen(!open)}
        style={styles.floatingButton}
      >
        💬
      </button>

      {/* CHAT */}
      {open && (
        <div style={styles.chatContainer}>

          {/* HEADER */}
          <div style={styles.header}>
            <div style={styles.logo}>
              AJ
            </div>

            <div>
              <h3 style={styles.title}>
                AJ Assistant
              </h3>

              <p style={styles.subtitle}>
                Gestión de Eventos
              </p>
            </div>

            <button
              onClick={() => setOpen(false)}
              style={styles.closeButton}
            >
              ✕
            </button>
          </div>

          {/* MENSAJES */}
          <div style={styles.chatBox} ref={chatRef}>

            {chat.map((msg, index) => (
              <div
                key={index}
                style={{
                  ...styles.messageWrapper,
                  justifyContent:
                    msg.tipo === "usuario"
                      ? "flex-end"
                      : "flex-start",
                }}
              >
                <div
                  style={{
                    ...styles.message,
                    background:
                      msg.tipo === "usuario"
                        ? "#d4af37"
                        : "#1c1c1c",

                    color:
                      msg.tipo === "usuario"
                        ? "#000"
                        : "#fff",
                  }}
                >
                  {msg.texto}
                </div>
              </div>
            ))}

            {loading && (
              <div style={styles.messageWrapper}>
                <div
                  style={{
                    ...styles.message,
                    background: "#1c1c1c",
                    color: "#fff",
                  }}
                >
                  IA está escribiendo...
                </div>
              </div>
            )}
          </div>

          {/* INPUT */}
          <div style={styles.inputContainer}>
            <input
              type="text"
              value={mensaje}
              placeholder="Escribe un mensaje..."
              onChange={(e) =>
                setMensaje(e.target.value)
              }
              onKeyDown={(e) =>
                e.key === "Enter" &&
                enviarMensaje()
              }
              style={styles.input}
            />

            <button
              onClick={enviarMensaje}
              style={styles.sendButton}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
};

const styles = {
  floatingButton: {
    position: "fixed",
    bottom: "25px",
    right: "25px",
    width: "65px",
    height: "65px",
    borderRadius: "50%",
    border: "none",
    background: "#d4af37",
    color: "#000",
    fontSize: "28px",
    cursor: "pointer",
    boxShadow: "0 5px 20px rgba(0,0,0,0.4)",
    zIndex: 9999,
  },

  chatContainer: {
    position: "fixed",
    bottom: "100px",
    right: "25px",
    width: "380px",
    height: "500px",
    background: "#000",
    borderRadius: "20px",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
    zIndex: 9999,
    border: "1px solid #d4af37",
  },

  header: {
    height: "70px",
    background: "#111",
    borderBottom: "1px solid #d4af37",
    display: "flex",
    alignItems: "center",
    padding: "0 15px",
    gap: "10px",
  },

  logo: {
    width: "45px",
    height: "45px",
    borderRadius: "50%",
    background: "#d4af37",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
    color: "#000",
  },

  title: {
    margin: 0,
    color: "#fff",
    fontSize: "16px",
  },

  subtitle: {
    margin: 0,
    color: "#aaa",
    fontSize: "12px",
  },

  closeButton: {
    marginLeft: "auto",
    background: "transparent",
    border: "none",
    color: "#fff",
    cursor: "pointer",
    fontSize: "18px",
  },

  chatBox: {
    flex: 1,
    overflowY: "auto",
    padding: "15px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  messageWrapper: {
    display: "flex",
    width: "100%",
  },

  message: {
    maxWidth: "75%",
    padding: "12px",
    borderRadius: "14px",
    fontSize: "14px",
    lineHeight: "1.4",
    wordBreak: "break-word",
  },

  inputContainer: {
    display: "flex",
    padding: "12px",
    borderTop: "1px solid #d4af37",
    background: "#111",
    gap: "10px",
  },

  input: {
    flex: 1,
    background: "#1c1c1c",
    border: "1px solid #333",
    color: "#fff",
    borderRadius: "10px",
    padding: "10px",
    outline: "none",
  },

  sendButton: {
    width: "50px",
    border: "none",
    borderRadius: "10px",
    background: "#d4af37",
    color: "#000",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "18px",
  },
};

export default ChatAssistant;