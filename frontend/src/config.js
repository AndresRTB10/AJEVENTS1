// URL base del backend.
// En desarrollo usa localhost; en AWS Amplify se define con la variable de entorno VITE_API_URL
// (por ejemplo https://dxxxxxxxx.cloudfront.net) y se aplica al hacer el build.
export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(/\/$/, '');
