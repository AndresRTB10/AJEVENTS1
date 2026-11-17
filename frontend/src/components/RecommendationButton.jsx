import React, { useState } from "react";
import {
    Button,
    Snackbar,
    Alert,
    CircularProgress,
    Box,
    Dialog,
    DialogContent,
    Typography
} from "@mui/material";
import { API_URL } from "../config";

function RecommendationButton() {

    const [loading, setLoading] = useState(false);

    const [successOpen, setSuccessOpen] = useState(false);

    const [errorOpen, setErrorOpen] = useState(false);

    const sendRecommendations = async () => {

        try {

            setLoading(true);

            const response = await fetch(
                `${API_URL}/recommendations/send`,
                {
                    method: "POST",
                }
            );

            if (!response.ok) {
                throw new Error("Error");
            }

            // 🔹 Simular pequeña espera visual
            setTimeout(() => {

                setLoading(false);

                setSuccessOpen(true);

            }, 1500);

        } catch (error) {

            console.error(error);

            setLoading(false);

            setErrorOpen(true);
        }
    };

    return (
        <>
            {/* 🔹 Botón */}
 <Box
     sx={{
         position: "fixed",
         top: 20,
         right: 20,
         zIndex: 999,
     }}
 >
                <Button
                    variant="contained"
                    onClick={sendRecommendations}
                    disabled={loading}
                    sx={{
                        background:
                            "linear-gradient(45deg, #1976d2, #42a5f5)",
                        borderRadius: "12px",
                        padding: "12px 20px",
                        fontWeight: "bold",
                        boxShadow: 4,
                    }}
                >
                    📩 Enviar recomendaciones
                </Button>
            </Box>

            {/* 🔹 Modal de carga */}
            <Dialog
                open={loading}
                PaperProps={{
                    sx: {
                        borderRadius: "20px",
                        padding: 3,
                        textAlign: "center",
                    },
                }}
            >
                <DialogContent>
                    <CircularProgress size={60} />

                    <Typography
                        variant="h6"
                        sx={{
                            mt: 3,
                            fontWeight: "bold",
                        }}
                    >
                        Enviando recomendaciones...
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                    >
                        Esto puede tardar unos segundos
                    </Typography>
                </DialogContent>
            </Dialog>

            {/* 🔹 Mensaje éxito */}
            <Snackbar
                open={successOpen}
                autoHideDuration={200}
                onClose={() => setSuccessOpen(false)}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
            >
                <Alert
                    severity="success"
                    variant="filled"
                    sx={{
                        borderRadius: "12px",
                        fontWeight: "bold",
                    }}
                >
                    ✅ Correos enviados exitosamente
                </Alert>
            </Snackbar>

            {/* 🔹 Mensaje error */}
            <Snackbar
                open={errorOpen}
                autoHideDuration={4000}
                onClose={() => setErrorOpen(false)}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
            >
                <Alert
                    severity="error"
                    variant="filled"
                    sx={{
                        borderRadius: "12px",
                        fontWeight: "bold",
                    }}
                >
                    ❌ Error enviando recomendaciones
                </Alert>
            </Snackbar>
        </>
    );
}

export default RecommendationButton;