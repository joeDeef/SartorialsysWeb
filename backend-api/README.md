# Documentación para SartorialSys API v2.0.0

**Proyecto:** SartorialSys Web

**Creador del Documento:** Defaz Joel

**Versión:** 1.0

---

## Requisitos

- MongoDB Community Server v8.0.4
- Node.js v22.12.0
- Express v4.21.2
- IDE -> (Opcional) Visual Studio Code v1.96.4
---

## Base de Datos
Para la ejecución correcta del proyecto se debe tener instalado MongoDB Community Server: `https://www.mongodb.com/try/download/community`

Una vez instalado se puede usar MongoDB Compas para crear la base de datos con ayuda de la conexión por defecto (default)
Crear la base llamada sartorialsys y 2 colecciones (users y products)

   ![DB MongoDB](./imgReadme/DB.png)

## Configuración
### Dependencias
Para levantar el proyecto se debe instalar las dependecias necesarias utilizando *node.js*. Para ello abrir la consola en la raiz del proyecto o donde se encuentre el archivo *package.json*

Ya en la consola ejecutamos el siguiente comando

```
npm install
```

### Ejecución
Finalmente para levantar la API, ejecutar el comando
```
npm run dev
```

En la consola deberá aparecer el mensaje

```
Server running at port -> 3000
Documentation available at -> localhost:3000/api-docs/
Database Connect
```

Con todo esto el proyecto se debe estar ejecutando correctamente el el puerto 3000 en el localhost
Para confirmarlo abrir en el navegador en la url: `http://localhost:3000/` y debe salir el siguiente mensaje

```
{
  "message": "Not Found - Ruta: /"
}
```

Para la documentación de la API visitar la ruta `http://localhost:3000/api-docs/` en la que se detallan todas las acciones que se puede hacer a la API levantada