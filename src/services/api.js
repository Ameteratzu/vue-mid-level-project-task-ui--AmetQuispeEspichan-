import axios from 'axios'

// Pon el slash final para concatenar rutas sin doble barra
export const api = axios.create({
  baseURL: 'https://681507e7225ff1af162aeb7e.mockapi.io/api/v1/',
  timeout: 5000
})





// Interceptor para manejar errores
api.interceptors.request.use(config => {
    return config;
}, error => Promise.reject(error));

// Interceptores de respuesta
api.interceptors.response.use(response => {
    return response;
}, error => {
    return Promise.reject(error);
}
);
