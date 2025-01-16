# Cross-Origin Resource Sharing (CORS)

**CORS (Cross-Origin Resource Sharing)** es un mecanismo de seguridad implementado por los navegadores web que permite controlar cómo los recursos en un servidor pueden ser solicitados desde diferentes dominios o "orígenes". CORS es una extensión de la **política del mismo origen (Same-Origin Policy)**, que restringe el acceso a recursos en páginas web a solo aquellas provenientes del mismo dominio, protocolo y puerto.

La principal función de CORS es permitir o restringir las solicitudes de recursos entre diferentes orígenes en aplicaciones web, manteniendo la seguridad de los usuarios.

## Política del Mismo Origen (Same-Origin Policy)

Por defecto, los navegadores web implementan la **Política del Mismo Origen**, que establece que solo los recursos solicitados desde el mismo origen (dominio, protocolo y puerto) son accesibles. Por ejemplo, una página web cargada desde `https://example.com` no puede realizar solicitudes a `https://api.anotherdomain.com` sin restricciones.

Esto es útil para evitar ataques como el **Cross-Site Request Forgery (CSRF)** y el **Cross-Site Scripting (XSS)**. Sin embargo, esta política también limita la interoperabilidad entre recursos de diferentes dominios.

## ¿Cómo Funciona CORS?

CORS funciona al permitir que los servidores especificen qué orígenes tienen permitido acceder a sus recursos. Para hacer esto, se incluyen cabeceras específicas en las respuestas HTTP que autorizan o deniegan el acceso a los recursos solicitados.

Cuando un navegador realiza una solicitud a un origen diferente, se genera un **encabezado de origen** (`Origin`) que indica el dominio desde el cual se realiza la solicitud. El servidor, al recibir la solicitud, debe verificar si ese origen está permitido y devolver los encabezados correspondientes.

Si el servidor permite el acceso, se incluyen los encabezados CORS en la respuesta, y el navegador permite que la aplicación cliente procese la respuesta.

### Solicitudes Simples vs Solicitudes Preflighted

1. **Solicitudes Simples**:
   Son aquellas que cumplen con ciertas restricciones, como usar los métodos HTTP `GET`, `POST` o `HEAD` y no incluyen cabeceras especiales o personalizadas. Las solicitudes simples no requieren una verificación previa del servidor (preflight).

   **Ejemplo**: Una solicitud GET sencilla que accede a un recurso sin necesidad de validaciones adicionales.

2. **Solicitudes Preflighted**:
   Si la solicitud incluye métodos HTTP no simples (como `PUT`, `DELETE`, etc.) o cabeceras personalizadas, el navegador realiza una **solicitud de pre-vuelo (preflight)** utilizando el método `OPTIONS` antes de realizar la solicitud principal.

   En este caso, el navegador envía una solicitud `OPTIONS` al servidor para consultar si el servidor permite la solicitud entre orígenes. El servidor responde con los encabezados CORS que indican si está permitido.

   **Ejemplo**: Una solicitud `POST` con cabeceras personalizadas.

## Encabezados de CORS

Los encabezados que se utilizan en CORS son esenciales para autorizar y controlar el acceso entre orígenes. A continuación, se describen los principales encabezados CORS:

### 1. **Access-Control-Allow-Origin**
   Especifica qué orígenes (dominios) pueden acceder a los recursos del servidor. El valor puede ser un dominio específico (por ejemplo, `https://miapp.com`) o el valor especial `*` para permitir el acceso desde cualquier origen.

   - **Ejemplo**: `Access-Control-Allow-Origin: https://miapp.com`
   - **Ejemplo con todos los orígenes**: `Access-Control-Allow-Origin: *`

   **Advertencia**: Si un servidor incluye `Access-Control-Allow-Origin: *`, no se puede permitir el envío de credenciales (cookies, cabeceras de autenticación), ya que esto podría exponer datos sensibles.

### 2. **Access-Control-Allow-Methods**
   Especifica los métodos HTTP que están permitidos cuando se realiza una solicitud entre orígenes. Estos pueden incluir `GET`, `POST`, `PUT`, `DELETE`, entre otros.

   - **Ejemplo**: `Access-Control-Allow-Methods: GET, POST, PUT`

### 3. **Access-Control-Allow-Headers**
   Indica qué cabeceras personalizadas pueden ser incluidas en la solicitud.

   - **Ejemplo**: `Access-Control-Allow-Headers: Content-Type, X-Custom-Header`

### 4. **Access-Control-Allow-Credentials**
   Controla si las solicitudes entre orígenes pueden incluir credenciales (como cookies o cabeceras de autenticación). Si es `true`, permite el envío de cookies.

   - **Ejemplo**: `Access-Control-Allow-Credentials: true`

### 5. **Access-Control-Expose-Headers**
   Indica qué cabeceras pueden ser accesibles a través de JavaScript en el lado del cliente.

   - **Ejemplo**: `Access-Control-Expose-Headers: X-Custom-Header`

### 6. **Access-Control-Max-Age**
   Especifica durante cuánto tiempo los resultados de una solicitud de pre-vuelo pueden ser almacenados en caché por el navegador, evitando así solicitudes repetidas.

   - **Ejemplo**: `Access-Control-Max-Age: 86400` (24 horas)

## Ejemplo de Solicitud y Respuesta CORS

### Solicitud de Cliente:
```http
GET /api/datos HTTP/1.1
Host: api.ejemplo.com
Origin: https://miapp.com
```
## Ejemplo de Cómo Evitar CORS con JavaScript Vanilla

Cuando no puedes modificar la configuración CORS de un servidor y necesitas hacer una solicitud desde el navegador, una forma de evitar los problemas de CORS es utilizando un servidor intermedio o un **proxy**. Este servidor intermedio realiza la solicitud al servidor de destino y luego retransmite la respuesta, asegurando que los encabezados CORS sean manejados correctamente.

### Ejemplo con un servidor proxy público

En este ejemplo, utilizamos un servicio de proxy público como `https://cors-anywhere.herokuapp.com/`, que agrega los encabezados CORS necesarios en la respuesta.

#### Código en JavaScript Vanilla:

```javascript
// URL del recurso al que deseas acceder
const url = 'https://api.ejemplo.com/data'; // URL de la API de destino

// Usamos un proxy público para evitar problemas de CORS
const proxyUrl = 'https://cors-anywhere.herokuapp.com/';

fetch(proxyUrl + url)
  .then(response => response.json())
  .then(data => {
    console.log('Datos recibidos:', data);
  })
  .catch(error => {
    console.error('Error al obtener los datos:', error);
  });
  
```
