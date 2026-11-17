import React from "react";

const PowerBIDashboard = () => {

  // PEGA AQUÍ TU LINK EMBED DE POWER BI
  const powerBiUrl =
    "https://app.powerbi.com/view?r=eyJrIjoiMmYyYWYxZmUtNTEzOC00OTg1LTliOWUtNDAzYmNjNDMzOWI5IiwidCI6IjlkMTJiZjNmLWU0ZjYtNDdhYi05MTJmLTFhMmYwZmM0OGFhNCIsImMiOjR9";

  return (
    <div style={styles.container}>

      {/* HEADER */}
      <div style={styles.header}>
        <div style={styles.logo}>
          AJ
        </div>

        <div>
          <h1 style={styles.title}>
            Dashboard Power BI
          </h1>

          <p style={styles.subtitle}>
            Analítica y Gestión de Datos
          </p>
        </div>
      </div>

      {/* CONTENEDOR DASHBOARD */}
      <div style={styles.dashboardContainer}>
        <iframe
          title="Power BI Dashboard"
          src={powerBiUrl}
          frameBorder="0"
          allowFullScreen
          style={styles.iframe}
        />
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: "100%",
    minHeight: "100vh",
    background: "#000",
    padding: "20px",
    boxSizing: "border-box",
    fontFamily: "Arial",
  },

  header: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "20px",
    padding: "15px",
    background: "#111",
    borderRadius: "15px",
    border: "1px solid #d4af37",
  },

  logo: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    background: "#d4af37",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
    fontSize: "22px",
    color: "#000",
  },

  title: {
    margin: 0,
    color: "#fff",
    fontSize: "24px",
  },

  subtitle: {
    margin: 0,
    color: "#aaa",
    fontSize: "14px",
  },

  dashboardContainer: {
    width: "100%",
    height: "85vh",
    borderRadius: "20px",
    overflow: "hidden",
    border: "2px solid #d4af37",
    boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
    background: "#111",
  },

  iframe: {
    width: "100%",
    height: "100%",
  },
};

export default PowerBIDashboard;