import http from 'http';

// URL de la API donde se va a hacer el POST
const url = 'http://localhost:3000/users';

// Datos que vamos a enviar en la solicitud POST
const jsonData = {
  name: 'John', // Nombre aleatorio
  last_name: 'Doe', // Apellido aleatorio
  email: 'john.doe@example.com', // Correo electrónico aleatorio
  password: 'password123', // Contraseña aleatoria
  role: 'user' // Rol del usuario
};

// Opciones de configuración para la solicitud
const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/users',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json', // Indicamos que es un JSON
    'Content-Length': Buffer.byteLength(JSON.stringify(jsonData)), // Indicamos la longitud del contenido
  },
};

// Hacer la solicitud POST
const req = http.request(options, (response) => {
  let data = '';

  // Recibir la respuesta del servidor
  response.on('data', (chunk) => {
    data += chunk;
  });

  response.on('end', () => {
    console.log('Respuesta del servidor:', data);
  });
});

// Manejo de errores
req.on('error', (error) => {
  console.error('Error en la solicitud:', error);
});

// Enviar el JSON
req.write(JSON.stringify(jsonData));
req.end();
