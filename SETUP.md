# 🚀 TechStore E-Commerce — Arquitectura Completa con Astro + Cloudflare + Supabase

## 📋 Estado del Proyecto

✅ **COMPLETADO:**
- Arquitectura híbrida: SSR para catálogo público, gestión de admin
- Sistema de autenticación con Supabase Auth
- API REST completa para CRUD de productos
- Diseño 3D impactante (inspirado en quadangles.com)
- Middleware de protección de rutas
- Componentes reutilizables
- Validación completa de formularios
- Estilos globales con transiciones CSS 3D y animaciones

## 🛠 Setup Local

### 1. Variables de Entorno

```bash
cp .env.example .env.local
```

Completa el archivo `.env.local` con tus credenciales de Supabase:

```env
PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima
SUPABASE_SERVICE_ROLE_KEY=tu_clave_service_role
```

### 2. Base de Datos Supabase

Ejecuta las siguientes migraciones SQL en la consola de Supabase:

```sql
-- Crear tabla de productos
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  image_url VARCHAR,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de usuarios admin
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Habilitar Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Política: Todos pueden leer productos
CREATE POLICY "allow_read_products" ON products
  FOR SELECT USING (true);

-- Política: Solo admin puede insertar
CREATE POLICY "allow_admin_insert" ON products
  FOR INSERT WITH CHECK (
    auth.uid() IN (SELECT user_id FROM admin_users)
  );

-- Política: Solo admin puede actualizar
CREATE POLICY "allow_admin_update" ON products
  FOR UPDATE USING (
    auth.uid() IN (SELECT user_id FROM admin_users)
  );

-- Política: Solo admin puede eliminar
CREATE POLICY "allow_admin_delete" ON products
  FOR DELETE USING (
    auth.uid() IN (SELECT user_id FROM admin_users)
  );

-- Políticas para admin_users (solo service role)
CREATE POLICY "allow_service_role_admin" ON admin_users
  USING (auth.jwt() ->> 'role' = 'service_role');
```

### 3. Crear un Usuario Admin

En la consola de Supabase, después de crear un usuario en Auth:

```sql
INSERT INTO admin_users (user_id) 
VALUES ('uuid-del-usuario-creado');
```

### 4. Instalar Dependencias

```bash
npm install
```

### 5. Ejecutar en Desarrollo

```bash
npm run dev
```

Abre `http://localhost:3000` en tu navegador.

---

## 📁 Estructura del Proyecto

```
src/
├── components/           # Componentes reutilizables
│   ├── ProductCard.astro
│   └── LoadingSpinner.astro
├── layouts/             # Layouts principales
│   ├── PublicLayout.astro
│   └── AdminLayout.astro
├── lib/                 # Utilidades y clientes
│   ├── supabase.ts      # Cliente público (anónimo)
│   ├── supabase-server.ts  # Cliente servidor (service role)
│   └── validation.ts    # Validación de formularios
├── pages/
│   ├── index.astro      # SSR: Catálogo (búsqueda, filtros, paginación)
│   ├── products/
│   │   └── [id].astro   # SSR: Detalle de producto
│   ├── api/
│   │   ├── products.ts  # GET/POST productos
│   │   ├── products/[id].ts  # PUT/DELETE producto
│   │   └── auth/
│   │       ├── login.ts
│   │       ├── logout.ts
│   │       └── register.ts
│   └── admin/
│       ├── index.astro  # Dashboard admin
│       ├── auth/
│       │   ├── login.astro
│       │   └── register.astro
│       └── products/
│           ├── index.astro  # Lista de productos
│           ├── new.astro    # Crear producto
│           └── [id].astro   # Editar producto
├── styles/
│   └── global.css       # Estilos 3D, animaciones, tema dark
└── middleware.ts        # Protección de rutas admin
```

---

## 🎯 Flujos Principales

### Catálogo Público (SSR)

```
GET / → index.astro
  ├── Parámetros: ?search=...&category=...&page=...
  ├── Consulta Supabase (server-side)
  └── Renderiza grid de ProductCard con paginación

GET /products/:id → [id].astro
  ├── Consulta Supabase por ID
  └── Renderiza detalle con especificaciones
```

### Portal Admin (Cliente-Side)

```
GET /admin/auth/login → form de login (client-side)
  └── POST /api/auth/login → Supabase Auth
      └── Guarda auth_token en cookie httpOnly

GET /admin → dashboard (requiere auth_token)
  └── Middleware verifica cookie
  └── Carga stats desde /api/products (GET)

GET /admin/products → lista admin
  └── Carga productos desde /api/products (GET)
  └── Botones: editar, eliminar

POST /admin/products/new → formulario
  └── POST /api/products + validación
  └── Redirige a /admin/products

PUT /admin/products/:id → formulario
  └── PUT /api/products/:id + validación
  └── Redirige a /admin/products

DELETE /admin/products/:id
  └── DELETE /api/products/:id + confirmación
```

---

## 🎨 Diseño 3D & Animaciones

### Características:
- **Tema:** Black & White (fondo `#0a0a0a`, acentos `#00d4ff`)
- **Transiciones:** Cubic-bezier suave, 0.3-0.4s
- **3D Hovers:** `perspective(1000px)`, `rotateX`, `rotateY`, `translateZ`
- **Animaciones:** Fade-in-up, scale, slide, glow
- **Sombras:** Glow effects con color cyan/magenta

Ver `src/styles/global.css` para todas las utilidades.

---

## 🔒 Seguridad

### Mínimo Privilegio:
- **Cliente público** → Usa `ANON_KEY`, solo lectura
- **Servidor** → Usa `SERVICE_ROLE_KEY`, acceso completo
- **RLS** → Políticas SQL protegen inserciones/actualizaciones
- **Middleware** → Protege rutas admin, verifica cookies
- **API** → Valida tokens JWT, rechaza no-autenticados (403)

### Variables de Entorno:
- `PUBLIC_*` → Seguras para cliente (prefijo PUBLIC)
- `SUPABASE_SERVICE_ROLE_KEY` → **NUNCA** expondrá al cliente
- `.env.local` → Ignorado en git, no commitear

---

## 📦 Build & Deploy

### Build Local:
```bash
npm run build
```

Genera carpeta `dist/` con HTML estático y funciones Cloudflare Workers.

### Deploy a Cloudflare:

```bash
# Instalar Wrangler (ya incluido)
npm install -D wrangler

# Deploy
wrangler deploy
```

Cloudflare ejecutará:
- ✅ HTML estático (SSG) desde `dist/`
- ✅ Funciones dinámicas (SSR) desde workers

---

## 🧪 Testing

### Flujo Completo:
1. Abre `http://localhost:3000` → Catálogo
2. Busca/filtra productos
3. Haz click en un producto → Detalle
4. Vuelve atrás
5. Navega a `/admin/auth/login`
6. Crea una cuenta o inicia sesión
7. Dashboard muestra stats
8. Crea un producto
9. Edita el producto
10. Elimina el producto
11. Vuelve al catálogo → Se actualiza automáticamente

### Requisitos:
- Variables de entorno configuradas
- Tabla `products` y `admin_users` en Supabase
- RLS habilitado
- Usuario admin creado

---

## 📚 Tecnologías

- **Astro 6.3** - Framework híbrido
- **TailwindCSS 4** - Utilidades CSS
- **GSAP** - Animaciones (preparado)
- **Cloudflare Workers** - Edge computing
- **Supabase** - Auth + DB + Storage
- **TypeScript** - Type safety

---

## 🚨 Próximos Pasos (Opcionales)

1. **Carrito de compras:** Agregar state management (Zustand/Context)
2. **Checkout:** Integrar Stripe/PayPal
3. **Imágenes:** Upload a Supabase Storage
4. **Notificaciones:** Emails con Supabase Functions
5. **Analytics:** Integrar Plausible/Mixpanel
6. **CDN:** Optimizar imágenes con Cloudflare Images

---

## 💡 Notas

- El proyecto usa `output: 'static'` (Astro v6), que automáticamente hace SSR cuando `prerender = false`
- Las rutas dinámicas admin requieren `getStaticPaths()` para SSG
- Las env vars se cargan en runtime (no en build time)
- Las cookies httpOnly protegen el auth_token
- GSAP está instalado pero no usado aún (puedes implementar scroll-triggered animations)

---

¡Listo para deployar! 🎉
