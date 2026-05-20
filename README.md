# TechStore E-Commerce

Sistema de comercio electrónico desarrollado con arquitectura híbrida utilizando Astro, Cloudflare y Supabase. El proyecto integra renderizado dinámico y contenido estático para ofrecer una experiencia moderna, rápida, segura y escalable enfocada en la comercialización de productos tecnológicos.

---

# Integrantes

- María Alexandra Jiménez Suárez
- Juan José Álvarez Restrepo
- Juan Sebastián Jaramillo

---

# Descripción General

TechStore es una plataforma e-commerce full stack orientada a la gestión y visualización de productos tecnológicos. El sistema fue diseñado utilizando una arquitectura híbrida que combina:

- SSR (Server Side Rendering) para el catálogo público.
- SSG (Static Site Generation) para el portal administrativo.

La aplicación permite visualizar productos, buscar y filtrar información en tiempo real, así como administrar el inventario mediante operaciones CRUD protegidas por autenticación y políticas de seguridad.

---

# Objetivos del Proyecto

- Implementar un e-commerce moderno utilizando Astro.
- Aplicar arquitectura híbrida SSR + SSG.
- Integrar Supabase como backend completo.
- Implementar autenticación y autorización segura.
- Desplegar la aplicación en Cloudflare.
- Aplicar principios de seguridad mediante RLS.
- Construir una interfaz responsiva y escalable.

---

# Arquitectura del Proyecto

## E-Commerce Público (SSR)

La parte pública del sistema utiliza Server Side Rendering (SSR), permitiendo consultar la base de datos en cada solicitud y renderizar contenido actualizado dinámicamente.

### Funcionalidades

- Catálogo dinámico de productos
- Búsqueda de productos
- Filtrado por categorías
- Paginación
- Detalle individual de productos
- Consulta en tiempo real desde Supabase

### Tecnologías Utilizadas

- Astro SSR
- Cloudflare Workers
- Supabase Database

---

## Portal Administrativo (SSG)

El panel administrativo utiliza Static Site Generation (SSG), donde las páginas se pre-renderizan durante el build y la lógica dinámica se ejecuta desde el cliente.

### Funcionalidades

- Inicio de sesión
- Cierre de sesión
- CRUD completo de productos
- Protección de rutas
- Validación de formularios
- Gestión de imágenes

### Tecnologías Utilizadas

- Astro SSG
- Supabase Auth
- Supabase Storage

---

# Stack Tecnológico

| Tecnología | Descripción |
|---|---|
| Astro | Framework híbrido para SSR y SSG |
| Cloudflare Workers | Renderizado dinámico en edge |
| Cloudflare Pages | Despliegue de la aplicación |
| Supabase | Backend as a Service |
| Supabase Auth | Sistema de autenticación |
| Supabase Storage | Gestión de imágenes |
| PostgreSQL | Base de datos relacional |
| TypeScript | Tipado estático |
| CSS3 | Diseño y animaciones |

---

# Estructura del Proyecto

```bash
src/
├── components/
│   ├── ProductCard.astro
│   └── LoadingSpinner.astro
│
├── layouts/
│   ├── PublicLayout.astro
│   └── AdminLayout.astro
│
├── lib/
│   ├── supabase.ts
│   ├── supabase-server.ts
│   └── validation.ts
│
├── pages/
│   ├── index.astro
│   ├── products/
│   │   └── [id].astro
│   │
│   ├── api/
│   │   ├── products.ts
│   │   ├── products/[id].ts
│   │   └── auth/
│   │       ├── login.ts
│   │       ├── logout.ts
│   │       └── register.ts
│   │
│   └── admin/
│       ├── index.astro
│       ├── auth/
│       │   ├── login.astro
│       │   └── register.astro
│       │
│       └── products/
│           ├── index.astro
│           ├── new.astro
│           └── [id].astro
│
├── styles/
│   └── global.css
│
└── middleware.ts
