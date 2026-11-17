# Despliegue de AJEVENTS en AWS

Arquitectura (la más sencilla para empezar):

```
Navegador ──► AWS Amplify (React)
     │
     └──────► CloudFront (HTTPS) ──► Elastic Beanstalk (Spring Boot) ──► RDS MySQL
```

| Parte | Servicio | Para qué |
|---|---|---|
| Frontend (React + Vite) | **AWS Amplify Hosting** | Se reconstruye solo con cada `git push` |
| Backend (Spring Boot, Java 17) | **Elastic Beanstalk** | Ejecuta el `.jar` |
| Base de datos (MySQL) | **RDS** | MySQL administrado |
| HTTPS para el backend | **CloudFront** | Amplify usa HTTPS; el navegador bloquea llamadas a un backend en HTTP |

> Usa la misma **región** (por ejemplo `us-east-1`) en todos los servicios.

---

## 0. Seguridad primero (hazlo ya)

El archivo `application.properties` tenía la **contraseña de aplicación de Gmail** escrita en un repositorio público. Aunque ya se quitó del archivo, **sigue en el historial de Git**, así que hay que darla por comprometida:

1. Entra en <https://myaccount.google.com/apppasswords> con la cuenta `ajeventsctg@gmail.com`.
2. **Elimina** la contraseña de aplicación anterior y crea una nueva.
3. La nueva contraseña **nunca** va en el código: solo en las variables de entorno de AWS (paso 3).
4. Genera también un secreto largo para JWT (por ejemplo, ejecuta `openssl rand -base64 48`).

---

## 1. Cuenta de AWS y presupuesto

1. Crea la cuenta en <https://aws.amazon.com> y activa **MFA** en el usuario root.
2. En **Billing → Budgets** crea un presupuesto mensual (por ejemplo, 10 USD) con alerta por correo.

---

## 2. Base de datos (RDS)

1. Consola → **RDS → Create database → Standard create → MySQL**.
2. Plantilla: **Free tier** (o la más económica disponible). Instancia: `db.t3.micro` o `db.t4g.micro`.
3. Identificador: `ajevents-db`. Usuario: `admin`. Contraseña: una segura (guárdala).
4. **Public access: No**.
5. En *Additional configuration* → **Initial database name**: `ajevents`.
6. Crea la base de datos. Cuando esté disponible, copia el **Endpoint** (algo como `ajevents-db.xxxx.us-east-1.rds.amazonaws.com`).

Las tablas se crean solas la primera vez que arranque el backend (`ddl-auto=update`).

---

## 3. Backend (Elastic Beanstalk)

### 3.1 Generar el `.jar`

```bash
cd backend
./mvnw clean package -DskipTests      # en Windows: mvnw.cmd clean package -DskipTests
```

El archivo queda en `backend/target/event_management_system_backend-0.0.1-SNAPSHOT.jar`.

### 3.2 Roles de IAM (solo la primera vez)

Elastic Beanstalk necesita un rol para las instancias EC2. En **IAM → Roles → Create role**:
- Entidad de confianza: **AWS service → EC2**
- Políticas: `AWSElasticBeanstalkWebTier`, `AWSElasticBeanstalkWorkerTier`, `AWSElasticBeanstalkMulticontainerDocker`
- Nombre: `aws-elasticbeanstalk-ec2-role`

### 3.3 Crear el entorno

1. **Elastic Beanstalk → Create application**. Nombre: `ajevents`. Entorno: **Web server environment**.
2. **Platform**: `Java` → rama **Corretto 17 running on 64bit Amazon Linux 2023**.
3. **Application code**: *Upload your code* → sube el `.jar`.
4. **Presets**: **Single instance** (más barato; no crea balanceador).
5. Service role: *Create and use new service role*. EC2 instance profile: `aws-elasticbeanstalk-ec2-role`.
6. En **Instance**: tipo `t3.small` (con `t3.micro`, 1 GB de RAM, Spring AI + Weka pueden quedarse cortos).
7. En **Environment properties** agrega:

| Variable | Valor |
|---|---|
| `SPRING_PROFILES_ACTIVE` | `prod` |
| `DB_HOST` | el endpoint de RDS (paso 2) |
| `DB_USER` | `admin` |
| `DB_PASS` | la contraseña de RDS |
| `DB_NAME` | `ajevents` |
| `JWT_SECRET` | el secreto del paso 0 |
| `MAIL_PASSWORD` | la **nueva** contraseña de aplicación de Gmail |
| `OPENAI_API_KEY` | tu clave de OpenAI (ver nota abajo) |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:5173` por ahora (se cambia en el paso 6) |
| `FRONTEND_URL` | `http://localhost:5173` por ahora (se cambia en el paso 6) |

> **OpenAI:** Spring AI exige una clave al arrancar. Si no tienes una, pon cualquier texto (por ejemplo `sk-placeholder`): la app arrancará, pero los chats con IA devolverán error.

8. Crea el entorno (tarda unos minutos). La URL queda como `ajevents-env.xxxx.elasticbeanstalk.com`.

### 3.4 Permitir que el backend llegue a la base de datos

1. En **EC2 → Instances** abre la instancia de Beanstalk y anota su **Security group**.
2. En **RDS → ajevents-db → Security group** → *Edit inbound rules* → agrega: Tipo **MYSQL/Aurora (3306)**, origen = el security group de la instancia de Beanstalk.
3. En Beanstalk, **Restart app server(s)** (o *Actions → Restart*).

### 3.5 Probar

- `http://<tu-url>.elasticbeanstalk.com/` → debe responder `AJEVENTS API OK`
- `http://<tu-url>.elasticbeanstalk.com/getallevents` → debe responder `[]` (lista vacía)

Si falla: **Beanstalk → Logs → Request logs → Last 100 lines** y busca el error (casi siempre es una variable faltante o el security group de RDS).

---

## 4. HTTPS para el backend (CloudFront)

1. **CloudFront → Create distribution**.
2. **Origin domain**: la URL de Beanstalk (`ajevents-env.xxxx.elasticbeanstalk.com`).
3. **Protocol**: *HTTP only*. En el origen, sube **Response timeout** a `60` segundos (el chat con IA puede tardar).
4. **Viewer protocol policy**: *Redirect HTTP to HTTPS*.
5. **Allowed HTTP methods**: *GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE*.
6. **Cache policy**: `CachingDisabled`. **Origin request policy**: `AllViewerExceptHostHeader`.
7. No actives WAF. Crea la distribución y espera a que termine de desplegar.
8. Copia el dominio: `https://dxxxxxxxxxxxx.cloudfront.net` → esta es la **URL de tu API**.

Prueba: `https://dxxxxxxxxxxxx.cloudfront.net/getallevents` → `[]`.

---

## 5. Frontend (Amplify)

1. **AWS Amplify → Create new app → GitHub** → autoriza y elige el repo `AJEVENTS1`, rama `main`.
2. Marca **My app is a monorepo** y escribe como carpeta raíz: `frontend`.
3. Amplify usará el archivo `amplify.yml` de la raíz del repositorio.
4. En **Advanced settings → Environment variables** agrega:

| Variable | Valor |
|---|---|
| `VITE_API_URL` | `https://dxxxxxxxxxxxx.cloudfront.net` (sin `/` al final) |

5. **Save and deploy**. Al terminar tendrás una URL como `https://main.dxxxxxxxxxx.amplifyapp.com`.
6. **Rewrites and redirects → Manage redirects → Add rewrite** (necesario para que `react-router` funcione al recargar una página):
   - **Source address:** `</^[^.]+$|\.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|woff2|ttf|map|json|webp|avif)$)([^.]+$)/>`
   - **Target address:** `/index.html`
   - **Type:** `200 (Rewrite)`

> `VITE_API_URL` se aplica **al compilar**. Si la cambias, hay que volver a desplegar el frontend (*Redeploy this version*).

---

## 6. Conectar frontend y backend

En Elastic Beanstalk → **Configuration → Updates, monitoring, and logging → Environment properties**, cambia:

| Variable | Valor |
|---|---|
| `CORS_ALLOWED_ORIGINS` | `https://main.dxxxxxxxxxx.amplifyapp.com` (sin `/` al final) |
| `FRONTEND_URL` | `https://main.dxxxxxxxxxx.amplifyapp.com` |

Aplica los cambios (el entorno se reinicia). Abre la URL de Amplify, regístrate y prueba.

---

## Limitaciones conocidas

- **Chat con IA local (`/ai/preguntar`):** `AiService` llama a **Ollama en `localhost:11434`**, que no existe en AWS. Ese chat dará error en producción hasta que cambies de proveedor (por ejemplo OpenAI) o montes Ollama en otra máquina.
- **Chat con acceso a la base de datos (`/mcp/chat`):** usa un contenedor Docker (`dbhub`) vía MCP. En Beanstalk está **desactivado** (`spring.ai.mcp.client.enabled=false`), por lo que el chat responde pero **sin consultar la base de datos**.
- **Datos locales:** la base de RDS empieza vacía. Para llevar tus datos: `mysqldump` local y luego importar en RDS (requiere conectarte a RDS desde una instancia EC2 o un túnel).
- **Costos:** una instancia `t3.small` + RDS fuera de la capa gratuita cuestan dinero cada mes. Revisa la capa gratuita vigente y tu presupuesto.

## Limpiar (para no pagar de más)

Elimina en este orden: Amplify app → CloudFront distribution (primero *Disable*) → entorno de Elastic Beanstalk → base de datos RDS (sin snapshot final si no la necesitas).
