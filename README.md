# SmartDesk - Frontend

Este es el frontend de la plataforma SaaS **SmartDesk**, un sistema multi-tenant de ticketing. Está construido con [Angular 19](https://angular.dev/) y estilizado con [Tailwind CSS](https://tailwindcss.com/).

## Requisitos Previos

Asegúrate de tener instalados los siguientes componentes:

- [Node.js](https://nodejs.org/) (versión 18 o superior recomendada)
- [npm](https://www.npmjs.com/) (viene incluido con Node.js) o yarn/pnpm
- Angular CLI global (Opcional pero recomendado): `npm install -g @angular/cli`

## Desarrollo Local

Para correr el servidor de desarrollo localmente:

1. Instala las dependencias del proyecto:
   ```bash
   npm install
   ```
2. Inicia el servidor de desarrollo:
   ```bash
   ng serve
   ```
   *Alternativa sin Angular CLI global:* `npm run start`

3. Abre tu navegador y navega a `http://localhost:4200/`. La aplicación se recargará automáticamente si modificas algún archivo fuente.

## Construcción (Build)

Para compilar el proyecto y prepararlo para producción:

```bash
ng build
```

Esto compilará tu proyecto y guardará los archivos estáticos optimizados en el directorio `dist/` (por lo general `dist/smartdesk-frontend/browser/`).

## Despliegue (Deployment)

Una vez que hayas construido el proyecto con `ng build`, la carpeta generada contendrá únicamente archivos estáticos (HTML, CSS, JS). Puedes desplegar estos archivos en cualquier servidor web o servicio de hosting para sitios estáticos.

### Opción 1: Hosting en la Nube (Vercel, Netlify, Firebase) - *Recomendado*

Esta es la forma más sencilla y moderna de alojar Single Page Applications (SPAs) en Angular:

- **Vercel / Netlify**: Conecta este repositorio de GitHub directamente a Vercel o Netlify. El servicio detectará que es una aplicación Angular, instalará las dependencias y ejecutará el comando de construcción automáticamente. Además, ya están configurados para redireccionar todas las rutas a `index.html` (necesario para el enrutamiento de Angular).
- **Firebase Hosting**: 
  1. Inicializa el proyecto ejecutando `firebase init`.
  2. Selecciona la carpeta de salida (ej. `dist/smartdesk-frontend/browser`).
  3. Responde **"Sí" (Yes)** cuando pregunte si deseas configurarlo como una Single Page App (esto redirige todo a `/index.html`).
  4. Ejecuta `firebase deploy`.

### Opción 2: Servidor Web Tradicional (Nginx / Apache)

Si despliegas en tu propio servidor o VPS, puedes usar **Nginx**. Es crucial configurar Nginx para que todas las rutas que no existan como archivos físicos devuelvan `index.html`.

**Ejemplo de configuración básica para Nginx:**

```nginx
server {
    listen 80;
    server_name tudominio.com;
    
    # Asegúrate de apuntar al directorio correcto donde copiaste los archivos de /dist
    root /var/www/smartdesk-frontend;
    index index.html;

    location / {
        # Esta línea asegura que Angular maneje las rutas correctamente
        try_files $uri $uri/ /index.html;
    }
}
```

### Opción 3: Despliegue con Docker y Nginx

Puedes crear un contenedor Docker para el frontend. Un enfoque típico es usar un "multi-stage build" con Nginx:

Crea un archivo `Dockerfile` en la raíz del proyecto:

```dockerfile
# Etapa 1: Construcción
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa 2: Servidor Web
FROM nginx:alpine
# Copia los archivos estáticos construidos en la etapa anterior (ajusta la ruta según tu angular.json)
COPY --from=build /app/dist/smartdesk-frontend/browser /usr/share/nginx/html
# (Opcional) Copia un archivo de configuración de nginx personalizado
# COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

Construye la imagen y córrela:
```bash
docker build -t smartdesk-frontend .
docker run -d -p 80:80 smartdesk-frontend
```

## Configuración y Variables de Entorno

Si necesitas apuntar a un backend diferente (ej. tu API en producción) u otras configuraciones que cambian según el entorno, asegúrate de gestionar esto a través del sistema de variables de entorno de Angular (`src/environments/`).

Al ejecutar `ng build`, Angular aplicará la configuración de producción.
