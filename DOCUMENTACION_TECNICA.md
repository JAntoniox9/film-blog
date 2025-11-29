# Documentación Técnica del Blog de Películas
## 25 Grandes Películas de Ciencia Ficción y Tecnología

---

## 1. Justificación de Herramientas, Aplicaciones y Lenguajes

### 1.1 React (JavaScript/JSX)
**Justificación:**
- **Componentización**: Permite crear componentes reutilizables y modulares, facilitando el mantenimiento del código y la reutilización de funcionalidades.
- **Virtual DOM**: Optimiza el rendimiento al actualizar solo los elementos necesarios en la interfaz, mejorando la experiencia del usuario.
- **Ecosistema robusto**: Amplia comunidad y librerías disponibles (React Icons, React Three Fiber, React Testing Library).
- **Responsive Design**: Facilita la creación de interfaces adaptativas para móviles, tablets y desktop mediante hooks y componentes condicionales.
- **Estado reactivo**: El sistema de hooks (useState, useEffect, useContext) permite gestionar el estado de la aplicación de manera eficiente y predecible.
- **Desarrollo ágil**: Hot reload y herramientas de desarrollo facilitan el proceso de desarrollo y debugging.

### 1.2 JavaScript (ES6+)
**Justificación:**
- **Lenguaje universal**: JavaScript es el lenguaje estándar para desarrollo web frontend, garantizando compatibilidad con todos los navegadores modernos.
- **Asincronía nativa**: Promesas y async/await facilitan el manejo de operaciones asíncronas con Supabase.
- **Flexibilidad**: Permite programación funcional y orientada a objetos, adaptándose a diferentes estilos de desarrollo.
- **Ecosistema npm**: Acceso a millones de paquetes a través de npm, facilitando la integración de funcionalidades.

### 1.3 Supabase (Base de Datos PostgreSQL y Backend)
**Justificación:**
- **Backend as a Service (BaaS)**: Elimina la necesidad de crear un servidor propio, reduciendo la complejidad del desarrollo y el tiempo de implementación.
- **PostgreSQL**: Base de datos relacional robusta y escalable, ideal para gestionar usuarios, posts y relaciones complejas con integridad referencial.
- **Autenticación integrada**: Sistema de autenticación completo con soporte para múltiples proveedores (email, OAuth), gestión de sesiones y tokens JWT.
- **Row Level Security (RLS)**: Permite implementar seguridad a nivel de fila directamente en la base de datos, garantizando que los usuarios solo accedan a sus datos autorizados.
- **Storage**: Almacenamiento de archivos (imágenes, audio) integrado con la base de datos, con políticas de acceso configurables.
- **Tiempo real**: Suscripciones en tiempo real permiten actualizaciones instantáneas de posts sin recargar la página.
- **API REST automática**: Genera automáticamente endpoints RESTful basados en el esquema de la base de datos, reduciendo código boilerplate.
- **Triggers y funciones**: Permite implementar lógica de negocio directamente en la base de datos mediante triggers y funciones almacenadas.

### 1.4 Vercel (Plataforma de Deploy)
**Justificación:**
- **Deploy automático**: Integración directa con Git, permitiendo despliegues automáticos en cada push a la rama principal.
- **CDN global**: Distribución de contenido a través de una red global de servidores, mejorando los tiempos de carga para usuarios en diferentes regiones.
- **SSL gratuito**: Certificados HTTPS automáticos y gratuitos, garantizando seguridad en las comunicaciones.
- **Optimización**: Optimización automática de imágenes y assets estáticos, mejorando el rendimiento de la aplicación.
- **Escalabilidad**: Escala automáticamente según la demanda, sin necesidad de configuración adicional ni preocuparse por picos de tráfico.
- **Variables de entorno**: Gestión segura de variables de entorno para credenciales y configuraciones sensibles.
- **Preview deployments**: Permite probar cambios antes de hacer deploy a producción mediante URLs de preview para cada pull request.

### 1.5 Tailwind CSS
**Justificación:**
- **Utility-first**: Permite crear diseños complejos sin escribir CSS personalizado, reduciendo el tiempo de desarrollo.
- **Responsive**: Clases responsive integradas (sm:, md:, lg:) facilitan el diseño adaptativo sin media queries adicionales.
- **Rendimiento**: Solo incluye las clases utilizadas en el bundle final mediante purging, reduciendo significativamente el tamaño del CSS.
- **Consistencia**: Sistema de diseño predefinido (colores, espaciados, tipografías) asegura consistencia visual en toda la aplicación.
- **Productividad**: Desarrollo más rápido al no necesitar cambiar entre archivos HTML y CSS.

### 1.6 React Three Fiber / Three.js
**Justificación:**
- **Modelos 3D**: Permite renderizar modelos 3D (como el clapperboard) directamente en el navegador sin plugins adicionales.
- **Experiencia visual**: Mejora la experiencia del usuario con elementos interactivos y visuales atractivos que destacan la aplicación.
- **WebGL**: Utiliza WebGL para renderizado acelerado por hardware, garantizando buen rendimiento incluso en dispositivos móviles.
- **Integración React**: React Three Fiber proporciona una API declarativa que se integra perfectamente con el ecosistema React.

### 1.7 UUID (Identificadores Únicos)
**Justificación:**
- **Identificadores únicos**: Genera identificadores únicos universales (UUID v4) para posts y entidades, evitando colisiones.
- **Seguridad**: Los UUIDs no son predecibles, mejorando la seguridad al evitar enumeración de recursos.
- **Compatibilidad**: Compatible con sistemas distribuidos y bases de datos, ideal para Supabase.

---

## 2. Autoevaluación de Atributos de Calidad

| Atributo de Calidad | Métrica | Valoración | Justificación |
|---------------------|---------|------------|---------------|
| **Funcionalidad** | Completitud funcional | 9/10 | Todas las funcionalidades principales implementadas (CRUD de posts, autenticación, visualización, favoritos). Falta sistema de comentarios y notificaciones push. |
| **Funcionalidad** | Corrección | 8.5/10 | La aplicación funciona correctamente. Validaciones implementadas en formularios. Algunas validaciones del lado del servidor podrían mejorarse. |
| **Funcionalidad** | Adecuación | 9.5/10 | Cumple completamente con los requisitos del blog de películas. Permite gestionar recomendaciones, visualizarlas, y proporciona una experiencia rica con multimedia. |
| **Funcionalidad** | Interoperabilidad | 8/10 | Integración exitosa con Supabase. Compartir en redes sociales implementado. Podría mejorarse con más integraciones (APIs de películas, sistemas de recomendación). |
| **Usabilidad** | Comprensibilidad | 9.5/10 | Interfaz intuitiva con iconos y etiquetas claras. Navegación simple y directa. Diseño visual que guía al usuario naturalmente. |
| **Usabilidad** | Aprendizaje | 8.5/10 | Curva de aprendizaje baja. El login oculto podría ser más evidente o documentado. Tooltips y ayuda contextual mejorarían la experiencia. |
| **Usabilidad** | Operabilidad | 9/10 | Controles claros y responsivos. Diseño adaptativo para diferentes dispositivos. Feedback visual inmediato en acciones. |
| **Usabilidad** | Atractividad | 10/10 | Diseño moderno con gradientes, animaciones y modelo 3D. Interfaz visualmente atractiva que destaca entre blogs similares. |
| **Confiabilidad** | Madurez | 7.5/10 | Aplicación funcional pero en desarrollo activo. Algunos errores menores pueden ocurrir. Testing automatizado básico implementado. |
| **Confiabilidad** | Tolerancia a fallos | 7/10 | Manejo básico de errores con mensajes al usuario. Podría mejorarse con retry automático y mejor feedback de errores de red. |
| **Confiabilidad** | Recuperabilidad | 8/10 | Los datos se recuperan de Supabase con backups automáticos. No hay sistema de backup visible para el usuario final. |
| **Confiabilidad** | Disponibilidad | 8.5/10 | Vercel garantiza alta disponibilidad. Supabase también proporciona alta disponibilidad. Dependencia de servicios externos. |
| **Eficiencia** | Comportamiento temporal | 8.5/10 | Carga rápida gracias a Vercel CDN. Optimizaciones de imágenes implementadas. Lazy loading de componentes. Algunas consultas podrían optimizarse. |
| **Eficiencia** | Utilización de recursos | 9/10 | Uso eficiente de recursos gracias a React y optimizaciones de Vercel. Bundle size optimizado. Imágenes optimizadas. |
| **Mantenibilidad** | Analizabilidad | 8.5/10 | Código organizado en componentes y hooks. Algunos archivos son extensos (App.js) pero bien estructurados. Comentarios útiles presentes. |
| **Mantenibilidad** | Modificabilidad | 8/10 | Estructura modular con componentes reutilizables. Hooks personalizados para lógica de negocio. Algunas funciones podrían estar mejor separadas. |
| **Mantenibilidad** | Estabilidad | 8.5/10 | Cambios en un componente no afectan significativamente a otros. Arquitectura desacoplada. Dependencias bien gestionadas. |
| **Mantenibilidad** | Facilidad de prueba | 7/10 | Configuración básica de tests con React Testing Library. Falta cobertura completa de tests unitarios e integración. |
| **Portabilidad** | Adaptabilidad | 9.5/10 | Funciona en todos los navegadores modernos. Responsive design para múltiples dispositivos. Progressive Web App potencial. |
| **Portabilidad** | Instalabilidad | 10/10 | Deploy automático en Vercel. Fácil instalación local con npm. Documentación de setup presente. |
| **Portabilidad** | Conformidad | 9/10 | Cumple con estándares web modernos (HTML5, CSS3, ES6+). Accesibilidad básica implementada. Podría mejorarse con ARIA labels. |
| **Portabilidad** | Reemplazabilidad | 8/10 | Componentes modulares permiten reemplazo. Dependencia de Supabase y Vercel, pero con abstracciones que facilitan migración. |
| **Seguridad** | Confidencialidad | 8.5/10 | Autenticación mediante Supabase con tokens JWT. Variables de entorno para credenciales. HTTPS obligatorio. RLS implementado. |
| **Seguridad** | Integridad | 8/10 | Validaciones en formularios. RLS en base de datos. Podría mejorarse con validación del lado del servidor más estricta. |
| **Seguridad** | No repudio | 7/10 | Sistema de autenticación robusto. No hay logs de auditoría implementados. Timestamps en posts permiten trazabilidad básica. |
| **Seguridad** | Autenticidad | 9/10 | Autenticación robusta mediante Supabase. Sesiones gestionadas correctamente. Tokens JWT con expiración. |
| **Seguridad** | Responsabilidad | 7.5/10 | RLS implementado con políticas por rol. Falta sistema de logs de auditoría completo para rastrear acciones de usuarios. |

**Promedio General: 8.4/10**

---

## 3. Tipo de Navegación

### 3.1 Tipo de Navegación Implementada: **Navegación Jerárquica con Elementos Lineales y Modales**

El blog utiliza una combinación de **navegación jerárquica**, **navegación lineal** y **navegación modal**:

- **Jerárquica**: La estructura principal sigue una jerarquía clara (Home → Lista de Posts → Detalle de Post).
- **Lineal**: Dentro de cada sección, los usuarios pueden navegar secuencialmente entre posts mediante el carrusel.
- **Modal**: Los detalles, formularios y secciones adicionales se muestran en modales que mantienen el contexto de la página principal.
- **Acceso directo**: Los usuarios pueden acceder directamente a cualquier post desde la lista principal.

### 3.2 Diagrama de Navegación

```
                    ┌─────────────────┐
                    │   PANTALLA      │
                    │   INICIAL       │
                    │  (Splash 3D)    │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │   HOME PAGE      │
                    │  (Lista Posts)   │
                    │  - Carrusel      │
                    │  - Grid Posts    │
                    │  - Header/Nav    │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│  DETALLE      │   │  LOGIN        │   │  AUTORES      │
│  POST         │   │  (Oculto)    │   │  (Modal)      │
│  (Modal)      │   │  "admin 51"  │   └───────────────┘
└───────┬───────┘   └───────┬───────┘
        │                   │
        │                   ▼
        │          ┌───────────────┐
        │          │  PANEL        │
        │          │  ADMIN        │
        │          │  (Modal)      │
        │          └───────┬───────┘
        │                  │
        │                  ▼
        │          ┌───────────────┐
        │          │  CREAR/EDITAR │
        │          │  POST         │
        │          │  (Modal)      │
        │          └───────────────┘
        │
        └──────────────────┘
                 │
                 ▼
        ┌───────────────┐
        │  VOLVER A     │
        │  LISTA        │
        │  (Cerrar      │
        │   Modal)      │
        └───────────────┘
```

### 3.3 Explicación del Uso

1. **Punto de Entrada (Splash Screen)**:
   - El usuario inicia en la pantalla splash con el modelo 3D del clapperboard animado.
   - Transición automática a la página principal después de unos segundos.

2. **Navegación Principal (Home)**:
   - Muestra un carrusel de posts destacados en la parte superior.
   - Lista completa de posts con tarjetas responsivas en grid.
   - Header fijo con navegación a secciones (Autores, Acerca de).
   - Barra de búsqueda para filtrar posts.

3. **Navegación a Detalle (Modal)**:
   - Click en cualquier post → Modal con detalles completos.
   - El modal incluye: información completa, galería de imágenes, reproductor de audio, trailer, y botones de compartir.
   - Desde el detalle, puede volver a la lista (cerrar modal) o editar (si es autor).

4. **Navegación de Autenticación (Login Oculto)**:
   - Login oculto: se desbloquea escribiendo "admin 51" en el buscador.
   - Una vez autenticado, aparece el formulario de creación/edición en modal.
   - Panel de administración accesible desde el header para administradores.

5. **Navegación Lineal entre Posts**:
   - Los usuarios pueden navegar secuencialmente usando el carrusel con flechas.
   - Acceso directo desde la lista principal mediante click en cualquier tarjeta.

6. **Navegación Modal**:
   - Detalles de post, Autores, Acerca de, Login, Formularios se muestran en modales.
   - Permite mantener el contexto de la página principal sin recargar.
   - Mejora la experiencia de usuario al evitar navegación entre páginas.

7. **Navegación por Roles**:
   - Colaboradores Premium: Acceso a sección de favoritos desde el header.
   - Editores: Acceso directo a formulario de creación desde el header.
   - Administradores: Panel de gestión de usuarios y configuración.

---

## 4. Jerarquía de Usuarios

### 4.1 Diagrama de Jerarquía

```
                    ┌─────────────────────┐
                    │  NIVEL 0            │
                    │  ADMINISTRADOR      │
                    │  (Super Usuario)    │
                    │  role: 'admin'      │
                    └──────────┬──────────┘
                               │
                ┌──────────────┴──────────────┐
                │                             │
                ▼                             ▼
        ┌───────────────┐           ┌───────────────┐
        │  NIVEL 1      │           │  NIVEL 1      │
        │  EDITOR       │           │  COLABORADOR  │
        │  (Autor)      │           │  (Lector)     │
        │  role:        │           │  role:        │
        │  'editor'     │           │  'colaborador'│
        └───────┬───────┘           └───────┬───────┘
                │                           │
    ┌───────────┴───────────┐   ┌───────────┴───────────┐
    │                       │   │                       │
    ▼                       ▼   ▼                       ▼
┌───────────┐       ┌───────────┐       ┌───────────┐       ┌───────────┐
│ NIVEL 2   │       │ NIVEL 2   │       │ NIVEL 2   │       │ NIVEL 2   │
│ EDITOR    │       │ EDITOR    │       │ COLABORADOR│       │ COLABORADOR│
│ SENIOR    │       │ JUNIOR    │       │ PREMIUM    │       │ BÁSICO    │
│ role:     │       │ role:     │       │ role:      │       │ role:      │
│ 'editor_  │       │ 'editor_  │       │ 'colaborador_│     │ 'colaborador_│
│  senior'  │       │  junior'  │       │  premium'  │       │  basico'   │
└───────────┘       └───────────┘       └───────────┘       └───────────┘
```

### 4.2 Descripción de Tipos de Usuario

#### **NIVEL 0: Administrador**
- **Rol en BD**: `admin`
- **Descripción**: Control total del sistema, gestión de usuarios y permisos, moderación de contenido, configuración del sistema.
- **Acceso**: Panel de administración completo, gestión de todos los posts y usuarios.

#### **NIVEL 1.1: Editor (Autor)**
- **Rol en BD**: `editor`
- **Descripción**: Puede crear posts, editar solo sus propios posts, eliminar solo sus propios posts, gestionar su perfil, subir imágenes y archivos multimedia, ver estadísticas básicas de sus posts.
- **Acceso**: Formulario de creación/edición de posts, panel de sus propios posts.

#### **NIVEL 1.2: Colaborador (Lector)**
- **Rol en BD**: `colaborador`
- **Descripción**: Solo lectura de contenido, puede ver todos los posts, no puede modificar contenido, sin funciones adicionales.
- **Acceso**: Visualización de posts, búsqueda básica.

#### **NIVEL 2.1: Editor Senior**
- **Rol en BD**: `editor_senior`
- **Descripción**: Puede crear posts, puede editar cualquier post (propios y de otros editores), puede eliminar solo sus propios posts, puede moderar comentarios (futuro), acceso a estadísticas avanzadas, acceso a borradores de otros editores.
- **Acceso**: Formulario de creación/edición, edición de posts de otros editores, estadísticas avanzadas.

#### **NIVEL 2.2: Editor Junior**
- **Rol en BD**: `editor_junior`
- **Descripción**: Puede crear posts, puede editar solo sus propios posts, **NO puede eliminar posts** (ni propios ni de otros), acceso limitado a estadísticas básicas.
- **Acceso**: Formulario de creación/edición solo para sus propios posts, estadísticas básicas.

#### **NIVEL 2.3: Colaborador Premium**
- **Rol en BD**: `colaborador_premium`
- **Descripción**: Lectura de todos los posts, acceso a contenido exclusivo (futuro), puede marcar posts como favoritos, recibe notificaciones de nuevos posts, puede compartir en redes sociales, búsqueda avanzada.
- **Acceso**: Sección de favoritos, notificaciones, contenido exclusivo, compartir en redes.

#### **NIVEL 2.4: Colaborador Básico**
- **Rol en BD**: `colaborador_basico`
- **Descripción**: Solo lectura básica, acceso a posts públicos, sin funciones adicionales, puede compartir enlaces.
- **Acceso**: Visualización de posts públicos, búsqueda básica, compartir enlaces.

---

## 5. Tabla de Privilegios y No Privilegios

| Tipo de Usuario | Privilegios | No Privilegios |
|----------------|-------------|----------------|
| **Administrador (Nivel 0)** | 1. Crear, editar y eliminar cualquier post (sin restricciones)<br>2. Gestionar usuarios (crear, editar, eliminar, cambiar roles)<br>3. Acceder a configuración del sistema<br>4. Ver estadísticas completas del blog<br>5. Moderar y eliminar contenido de cualquier usuario<br>6. Gestionar categorías y plataformas de streaming<br>7. Acceder a logs y auditoría del sistema | 1. No puede eliminar su propia cuenta de administrador<br>2. No puede cambiar su rol a uno inferior sin autorización<br>3. No puede acceder a datos sensibles de otros usuarios sin justificación<br>4. No puede modificar la estructura de la base de datos directamente<br>5. No puede desactivar RLS sin autorización<br>6. No puede eliminar el sistema completo |
| **Editor (Nivel 1.1)** | 1. Crear posts<br>2. Editar solo sus propios posts<br>3. Eliminar solo sus propios posts<br>4. Subir imágenes y archivos multimedia<br>5. Ver estadísticas básicas de sus posts<br>6. Guardar borradores<br>7. Publicar sus propios posts | 1. No puede editar posts de otros usuarios<br>2. No puede eliminar posts de otros usuarios<br>3. No puede gestionar usuarios<br>4. No puede cambiar configuración del sistema<br>5. No puede ver estadísticas globales<br>6. No puede modificar roles de usuarios<br>7. No puede acceder a panel de administración |
| **Editor Senior (Nivel 2.1)** | 1. Crear posts<br>2. Editar cualquier post (propios y de otros editores)<br>3. Eliminar solo sus propios posts<br>4. Subir imágenes y archivos multimedia<br>5. Ver estadísticas avanzadas de sus posts<br>6. Moderar comentarios en sus posts (futuro)<br>7. Acceder a borradores de otros editores | 1. No puede eliminar posts de otros editores<br>2. No puede gestionar usuarios<br>3. No puede cambiar configuración del sistema<br>4. No puede ver estadísticas globales<br>5. No puede modificar roles de usuarios<br>6. No puede acceder a panel de administración<br>7. No puede eliminar usuarios |
| **Editor Junior (Nivel 2.2)** | 1. Crear posts<br>2. Editar solo sus propios posts<br>3. Subir imágenes y archivos multimedia<br>4. Ver estadísticas básicas de sus posts<br>5. Guardar borradores<br>6. Publicar sus propios posts | 1. **NO puede eliminar posts** (ni propios ni de otros)<br>2. No puede editar posts de otros usuarios<br>3. No puede ver estadísticas avanzadas<br>4. No puede moderar comentarios<br>5. No puede acceder a borradores de otros<br>6. No puede gestionar usuarios<br>7. No puede acceder a panel de administración |
| **Colaborador Premium (Nivel 2.3)** | 1. Ver todos los posts públicos<br>2. Acceder a contenido exclusivo (futuro)<br>3. Marcar posts como favoritos<br>4. Recibir notificaciones de nuevos posts<br>5. Compartir posts en redes sociales<br>6. Filtrar y buscar posts avanzadamente<br>7. Ver lista de favoritos | 1. No puede crear, editar o eliminar posts<br>2. No puede subir archivos multimedia<br>3. No puede acceder a panel de administración<br>4. No puede ver estadísticas de otros usuarios<br>5. No puede moderar contenido<br>6. No puede gestionar usuarios<br>7. No puede acceder a borradores |
| **Colaborador Básico (Nivel 2.4)** | 1. Ver posts públicos<br>2. Navegar por categorías<br>3. Buscar posts básicamente<br>4. Ver detalles de posts<br>5. Compartir posts (enlace)<br>6. Ver imágenes y trailers<br>7. Escuchar audio narrado | 1. No puede crear, editar o eliminar posts<br>2. No puede subir archivos<br>3. No puede marcar favoritos<br>4. No puede acceder a contenido exclusivo<br>5. No puede recibir notificaciones personalizadas<br>6. No puede ver estadísticas<br>7. No puede acceder a panel de administración |

---

## 6. Diagramas de Casos de Uso por Tipo de Usuario

### 6.1 Administrador (Nivel 0)

```
┌─────────────────────────────────────────────────────────────┐
│                    ADMINISTRADOR                             │
│                    (Nivel 0)                                 │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│ Gestionar     │   │ Gestionar     │   │ Configurar   │
│ Usuarios      │   │ Contenido     │   │ Sistema       │
└───────┬───────┘   └───────┬───────┘   └───────┬───────┘
        │                   │                   │
        ▼                   ▼                   ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│ - Crear       │   │ - Crear Post  │   │ - Cambiar     │
│   Usuario     │   │ - Editar      │   │   Configuración│
│ - Editar      │   │   Cualquier   │   │ - Ver         │
│   Usuario     │   │   Post        │   │   Estadísticas│
│ - Eliminar    │   │ - Eliminar    │   │   Globales    │
│   Usuario     │   │   Cualquier   │   │ - Gestionar   │
│ - Cambiar     │   │   Post        │   │   Categorías  │
│   Rol         │   │ - Moderar     │   │ - Ver Logs    │
│ - Ver Todos   │   │   Contenido   │   │ - Configurar  │
│   los Usuarios│   │ - Ver Todos   │   │   RLS         │
└───────────────┘   │   los Posts   │   └───────────────┘
                    └───────────────┘
```

**Casos de Uso:**
- **Gestionar Usuarios**: Crear, editar, eliminar usuarios y cambiar sus roles
- **Gestionar Contenido**: CRUD completo de posts, moderación de contenido
- **Configurar Sistema**: Cambiar configuraciones, ver estadísticas globales, gestionar categorías, ver logs

### 6.2 Editor (Nivel 1.1)

```
┌─────────────────────────────────────────────────────────────┐
│                    EDITOR                                    │
│                    (Nivel 1.1)                               │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┴───────────────────┐
        │                                       │
        ▼                                       ▼
┌───────────────┐                   ┌───────────────┐
│ Gestionar     │                   │ Ver           │
│ Posts Propios │                   │ Estadísticas  │
└───────┬───────┘                   └───────┬───────┘
        │                                   │
        ▼                                   ▼
┌───────────────┐                   ┌───────────────┐
│ - Crear Post  │                   │ - Ver Stats   │
│ - Editar      │                   │   de Posts    │
│   Propios     │                   │   Propios     │
│ - Eliminar    │                   │ - Ver Número  │
│   Propios     │                   │   de Visitas  │
│ - Subir       │                   │ - Ver Fechas  │
│   Multimedia  │                   │   de Creación  │
│ - Guardar     │                   │               │
│   Borradores  │                   │               │
│ - Publicar    │                   │               │
│   Posts       │                   │               │
└───────────────┘                   └───────────────┘
```

**Casos de Uso:**
- **Gestionar Posts Propios**: Crear, editar, eliminar, guardar borradores y publicar sus propios posts
- **Ver Estadísticas**: Ver estadísticas básicas de sus propios posts

### 6.3 Editor Senior (Nivel 2.1)

```
┌─────────────────────────────────────────────────────────────┐
│                  EDITOR SENIOR                              │
│                  (Nivel 2.1)                                 │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│ Gestionar     │   │ Moderar       │   │ Ver           │
│ Posts         │   │ Contenido      │   │ Estadísticas  │
└───────┬───────┘   └───────┬───────┘   └───────┬───────┘
        │                   │                   │
        ▼                   ▼                   ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│ - Crear Post  │   │ - Moderar     │   │ - Ver Stats   │
│ - Editar      │   │   Comentarios │   │   Propios     │
│   Propios     │   │ - Editar      │   │ - Ver Stats   │
│ - Editar      │   │   Posts de    │   │   de Posts    │
│   Otros       │   │   Otros       │   │   Editados    │
│ - Eliminar    │   │ - Acceder a   │   │ - Ver Stats   │
│   Propios     │   │   Borradores  │   │   Avanzadas   │
│ - Subir       │   │   de Otros    │   │               │
│   Multimedia  │   │               │   │               │
└───────────────┘   └───────────────┘   └───────────────┘
```

**Casos de Uso:**
- **Gestionar Posts**: Crear, editar propios y de otros, eliminar propios
- **Moderar Contenido**: Moderar comentarios, editar posts de otros, acceder a borradores
- **Ver Estadísticas**: Ver estadísticas avanzadas de sus posts y de posts editados

### 6.4 Editor Junior (Nivel 2.2)

```
┌─────────────────────────────────────────────────────────────┐
│                  EDITOR JUNIOR                               │
│                  (Nivel 2.2)                                 │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┴───────────────────┐
        │                                       │
        ▼                                       ▼
┌───────────────┐                   ┌───────────────┐
│ Gestionar     │                   │ Ver           │
│ Posts Propios │                   │ Estadísticas  │
│ (Sin Eliminar)│                   │ Básicas       │
└───────┬───────┘                   └───────┬───────┘
        │                                   │
        ▼                                   ▼
┌───────────────┐                   ┌───────────────┐
│ - Crear Post  │                   │ - Ver Stats   │
│ - Editar      │                   │   de Posts    │
│   Propios     │                   │   Propios     │
│ - Guardar     │                   │ - Ver Número  │
│   Borradores  │                   │   de Visitas  │
│ - Publicar    │                   │ - Ver Fechas  │
│   Posts       │                   │   de Creación  │
│ - Subir       │                   │               │
│   Multimedia  │                   │               │
└───────────────┘                   └───────────────┘
```

**Casos de Uso:**
- **Gestionar Posts Propios**: Crear, editar, guardar borradores, publicar (sin eliminar)
- **Ver Estadísticas Básicas**: Ver estadísticas de sus propios posts

### 6.5 Colaborador Premium (Nivel 2.3)

```
┌─────────────────────────────────────────────────────────────┐
│              COLABORADOR PREMIUM                             │
│              (Nivel 2.3)                                     │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│ Ver           │   │ Gestionar     │   │ Compartir     │
│ Contenido     │   │ Favoritos     │   │ y Buscar      │
└───────┬───────┘   └───────┬───────┘   └───────┬───────┘
        │                   │                   │
        ▼                   ▼                   ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│ - Ver Posts   │   │ - Marcar      │   │ - Compartir   │
│   Públicos    │   │   Favoritos   │   │   en Redes    │
│ - Ver         │   │ - Ver Lista   │   │ - Buscar      │
│   Exclusivos  │   │   Favoritos   │   │   Avanzada    │
│ - Recibir     │   │ - Eliminar    │   │ - Filtrar     │
│   Notific.    │   │   Favoritos   │   │   Posts       │
│ - Ver         │   │ - Ordenar     │   │ - Ordenar     │
│   Detalles    │   │   Favoritos   │   │   Resultados  │
└───────────────┘   └───────────────┘   └───────────────┘
```

**Casos de Uso:**
- **Ver Contenido**: Ver posts públicos y exclusivos, recibir notificaciones
- **Gestionar Favoritos**: Marcar, ver lista, eliminar y ordenar favoritos
- **Compartir y Buscar**: Compartir en redes sociales, búsqueda avanzada, filtrar posts

### 6.6 Colaborador Básico (Nivel 2.4)

```
┌─────────────────────────────────────────────────────────────┐
│              COLABORADOR BÁSICO                               │
│              (Nivel 2.4)                                     │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┴───────────────────┐
        │                                       │
        ▼                                       ▼
┌───────────────┐                   ┌───────────────┐
│ Ver           │                   │ Navegar y     │
│ Contenido     │                   │ Buscar        │
└───────┬───────┘                   └───────┬───────┘
        │                                   │
        ▼                                   ▼
┌───────────────┐                   ┌───────────────┐
│ - Ver Posts   │                   │ - Navegar     │
│   Públicos    │                   │   Categorías  │
│ - Ver         │                   │ - Búsqueda    │
│   Detalles    │                   │   Básica      │
│ - Ver         │                   │ - Compartir   │
│   Imágenes    │                   │   Enlace      │
│ - Ver         │                   │ - Ver         │
│   Trailers    │                   │   Carrusel    │
│ - Escuchar    │                   │               │
│   Audio       │                   │               │
└───────────────┘                   └───────────────┘
```

**Casos de Uso:**
- **Ver Contenido**: Ver posts públicos, detalles, imágenes, trailers y audio
- **Navegar y Buscar**: Navegar por categorías, búsqueda básica, compartir enlace

### 6.7 Colaborador (Nivel 1.2)

```
┌─────────────────────────────────────────────────────────────┐
│              COLABORADOR                                     │
│              (Nivel 1.2)                                     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
                    ┌───────────────┐
                    │ Ver           │
                    │ Contenido     │
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │ - Ver Posts   │
                    │   Públicos    │
                    │ - Ver         │
                    │   Detalles    │
                    │ - Navegar     │
                    │   Lista       │
                    │ - Buscar      │
                    │   Básica      │
                    └───────────────┘
```

**Casos de Uso:**
- **Ver Contenido**: Ver posts públicos, detalles, navegar lista, búsqueda básica

---

## 7. Diagramas de Secuencia de Casos de Uso

### 7.1 Administrador - Gestionar Usuario

```
Usuario Admin    │    Interfaz    │    Supabase    │    Base de Datos
─────────────────┼────────────────┼───────────────┼─────────────────
                 │                │               │
  Solicita       │                │               │
  Crear Usuario  │                │               │
────────────────>│                │               │
                 │                │               │
                 │  Autentica     │               │
                 │  Token JWT      │               │
                 │───────────────>│               │
                 │                │               │
                 │                │  Valida Token │
                 │                │  y Rol Admin  │
                 │                │──────────────>│
                 │                │               │
                 │                │  Token Válido  │
                 │                │  y Rol OK      │
                 │                │<───────────────│
                 │                │               │
                 │  Insert Usuario│               │
                 │  con Rol       │               │
                 │───────────────>│               │
                 │                │               │
                 │                │  INSERT INTO  │
                 │                │  users (...)  │
                 │                │──────────────>│
                 │                │               │
                 │                │  Usuario       │
                 │                │  Creado        │
                 │                │<───────────────│
                 │                │               │
                 │  Usuario       │               │
                 │  Creado        │               │
                 │<───────────────│               │
                 │                │               │
  Usuario        │                │               │
  Creado         │                │               │
<────────────────│                │               │
```

### 7.2 Editor - Crear y Publicar Post

```
Editor          │    Interfaz    │    Supabase    │    Base de Datos
────────────────┼────────────────┼───────────────┼─────────────────
                │                │               │
  Abre Formulario│                │               │
  Crear Post    │                │               │
───────────────>│                │               │
                │                │               │
  Completa      │                │               │
  Formulario    │                │               │
───────────────>│                │               │
                │                │               │
  Sube Imagen   │                │               │
───────────────>│                │               │
                │                │               │
                │  Upload Image  │               │
                │  to Storage    │               │
                │───────────────>│               │
                │                │               │
                │                │  Upload File   │
                │                │  to Bucket    │
                │                │──────────────>│
                │                │               │
                │                │  URL Generada  │
                │                │<───────────────│
                │                │               │
                │  Image URL     │               │
                │<───────────────│               │
                │                │               │
  Guarda        │                │               │
  Borrador      │                │               │
───────────────>│                │               │
                │                │               │
                │  INSERT Post   │               │
                │  (draft=true)  │               │
                │───────────────>│               │
                │                │               │
                │                │  Verifica Rol │
                │                │  (editor)      │
                │                │──────────────>│
                │                │               │
                │                │  INSERT INTO  │
                │                │  posts (...)  │
                │                │──────────────>│
                │                │               │
                │                │  Post Creado  │
                │                │<───────────────│
                │                │               │
                │  Borrador      │               │
                │  Guardado      │               │
                │<───────────────│               │
                │                │               │
  Publica Post  │                │               │
───────────────>│                │               │
                │                │               │
                │  UPDATE Post   │               │
                │  (draft=false) │               │
                │───────────────>│               │
                │                │               │
                │                │  UPDATE posts │
                │                │  SET draft=   │
                │                │  false        │
                │                │──────────────>│
                │                │               │
                │                │  Post         │
                │                │  Publicado    │
                │                │<───────────────│
                │                │               │
                │  Post          │               │
                │  Publicado     │               │
                │<───────────────│               │
                │                │               │
  Post          │                │               │
  Publicado     │                │               │
<───────────────│                │               │
```

### 7.3 Editor Senior - Editar Post de Otro Editor

```
Editor Senior   │    Interfaz    │    Supabase    │    Base de Datos
────────────────┼────────────────┼───────────────┼─────────────────
                │                │               │
  Selecciona    │                │               │
  Post a Editar │                │               │
───────────────>│                │               │
                │                │               │
                │  Verifica      │               │
                │  Permisos      │               │
                │  (editor_senior)│               │
                │───────────────>│               │
                │                │               │
                │                │  SELECT role  │
                │                │  FROM users   │
                │                │  WHERE id=    │
                │                │  auth.uid()   │
                │                │──────────────>│
                │                │               │
                │                │  Role: Editor │
                │                │  Senior       │
                │                │<───────────────│
                │                │               │
                │  Permiso OK    │               │
                │<───────────────│               │
                │                │               │
                │  Obtener Post  │               │
                │───────────────>│               │
                │                │               │
                │                │  SELECT * FROM │
                │                │  posts WHERE  │
                │                │  id = ...     │
                │                │──────────────>│
                │                │               │
                │                │  Post Data    │
                │                │<───────────────│
                │                │               │
                │  Post Data     │               │
                │<───────────────│               │
                │                │               │
  Edita Post    │                │               │
───────────────>│                │               │
                │                │               │
                │  UPDATE Post   │               │
                │  (cualquier)   │               │
                │───────────────>│               │
                │                │               │
                │                │  Verifica RLS │
                │                │  (editor_senior│
                │                │  puede editar)│
                │                │──────────────>│
                │                │               │
                │                │  UPDATE posts │
                │                │  SET ...      │
                │                │──────────────>│
                │                │               │
                │                │  Post         │
                │                │  Actualizado  │
                │                │<───────────────│
                │                │               │
                │  Post          │               │
                │  Actualizado   │               │
                │<───────────────│               │
                │                │               │
  Post          │                │               │
  Actualizado   │                │               │
<───────────────│                │               │
```

### 7.4 Editor Junior - Intentar Eliminar Post (Denegado)

```
Editor Junior   │    Interfaz    │    Supabase    │    Base de Datos
────────────────┼────────────────┼───────────────┼─────────────────
                │                │               │
  Intenta       │                │               │
  Eliminar Post │                │               │
───────────────>│                │               │
                │                │               │
                │  Verifica      │               │
                │  Permisos      │               │
                │───────────────>│               │
                │                │               │
                │                │  SELECT role  │
                │                │  FROM users   │
                │                │  WHERE id=    │
                │                │  auth.uid()   │
                │                │──────────────>│
                │                │               │
                │                │  Role: Editor │
                │                │  Junior       │
                │                │<───────────────│
                │                │               │
                │                │  Verifica RLS │
                │                │  (no hay      │
                │                │  política DELETE│
                │                │  para junior) │
                │                │──────────────>│
                │                │               │
                │                │  Permiso      │
                │                │  Denegado     │
                │                │<───────────────│
                │                │               │
                │  Error:        │               │
                │  Sin Permiso   │               │
                │<───────────────│               │
                │                │               │
  Error: No      │                │               │
  Puede Eliminar│                │               │
<───────────────│                │               │
```

### 7.5 Colaborador Premium - Marcar Favorito

```
Colaborador     │    Interfaz    │    Supabase    │    Base de Datos
Premium         │                │                │
────────────────┼────────────────┼────────────────┼─────────────────
                │                │                │
  Ve Post       │                │                │
  Interesante   │                │                │
───────────────>│                │                │
                │                │                │
  Click en      │                │                │
  Favorito      │                │                │
───────────────>│                │                │
                │                │                │
                │  Verifica      │                │
                │  Autenticación │                │
                │  y Rol         │                │
                │───────────────>│                │
                │                │                │
                │                │  Verifica      │
                │                │  Session y Rol │
                │                │  (premium)     │
                │                │───────────────>│
                │                │                │
                │                │  Session OK    │
                │                │  Rol Premium   │
                │                │<───────────────│
                │                │                │
                │  Autenticado   │                │
                │<───────────────│                │
                │                │                │
                │  INSERT        │                │
                │  Favorito      │                │
                │───────────────>│                │
                │                │                │
                │                │  INSERT INTO   │
                │                │  favorites     │
                │                │  (user_id,     │
                │                │   post_id)     │
                │                │───────────────>│
                │                │                │
                │                │  Favorito      │
                │                │  Guardado      │
                │                │<───────────────│
                │                │                │
                │  Favorito      │                │
                │  Guardado      │                │
                │<───────────────│                │
                │                │                │
  Post          │                │                │
  Marcado       │                │                │
<───────────────│                │                │
```

### 7.6 Colaborador Básico - Ver Detalle de Post

```
Colaborador     │    Interfaz    │    Supabase    │    Base de Datos
Básico          │                │                │
────────────────┼────────────────┼────────────────┼─────────────────
                │                │                │
  Navega por    │                │                │
  Lista de Posts│                │                │
───────────────>│                │                │
                │                │                │
                │  Obtener Posts │                │
                │  Públicos      │                │
                │───────────────>│                │
                │                │                │
                │                │  SELECT * FROM │
                │                │  posts WHERE   │
                │                │  draft=false   │
                │                │───────────────>│
                │                │                │
                │                │  Lista Posts   │
                │                │<───────────────│
                │                │                │
                │  Lista Posts   │                │
                │<───────────────│                │
                │                │                │
  Lista de      │                │                │
  Posts         │                │                │
<───────────────│                │                │
                │                │                │
  Click en Post │                │                │
  Específico    │                │                │
───────────────>│                │                │
                │                │                │
                │  Obtener       │                │
                │  Detalle Post  │                │
                │───────────────>│                │
                │                │                │
                │                │  SELECT * FROM │
                │                │  posts WHERE   │
                │                │  id = ...      │
                │                │  JOIN users    │
                │                │  ON author_id  │
                │                │───────────────>│
                │                │                │
                │                │  Post Data +   │
                │                │  Author Info   │
                │                │<───────────────│
                │                │                │
                │  Post Data     │                │
                │<───────────────│                │
                │                │                │
  Detalle Post  │                │                │
  Mostrado      │                │                │
<───────────────│                │                │
```

### 7.7 Colaborador (Nivel 1.2) - Buscar Posts

```
Colaborador     │    Interfaz    │    Supabase    │    Base de Datos
────────────────┼────────────────┼────────────────┼─────────────────
                │                │                │
  Ingresa       │                │                │
  Término       │                │                │
  de Búsqueda   │                │                │
───────────────>│                │                │
                │                │                │
                │  Buscar Posts  │                │
                │  por Título    │                │
                │───────────────>│                │
                │                │                │
                │                │  SELECT * FROM │
                │                │  posts WHERE   │
                │                │  (spanish_title│
                │                │  ILIKE '%term%'│
                │                │  OR            │
                │                │  original_title│
                │                │  ILIKE '%term%')│
                │                │  AND draft=false│
                │                │───────────────>│
                │                │                │
                │                │  Resultados    │
                │                │<───────────────│
                │                │                │
                │  Resultados    │                │
                │<───────────────│                │
                │                │                │
  Resultados    │                │                │
  Mostrados     │                │                │
<───────────────│                │                │
```

---

## 8. Árbol de Datos para Películas (Componente Post)

### 8.1 Estructura del Árbol de Datos

Basado en la figura 18.3 del material bibliográfico, el árbol de datos para cada película (post) se estructura de la siguiente manera:

```
POST (Película)
│
├─── METADATOS_IDENTIFICACION
│   ├─── id (UUID) [Clave Primaria]
│   ├─── original_title (String) [Título Original]
│   ├─── spanish_title (String) [Título en Español]
│   └─── year (Integer) [Año de Realización]
│
├─── METADATOS_PRODUCCION
│   ├─── distributor (String) [Distribuidora]
│   ├─── director (String) [Director]
│   └─── movie_cast (String) [Elenco Actoral - Separado por comas]
│
├─── METADATOS_CLASIFICACION
│   ├─── category (String) [Categoría: "Ciencia Ficción" | "Tecnología"]
│   └─── streaming (String) [Plataforma de Streaming]
│
├─── CONTENIDO_DESCRIPTIVO
│   ├─── summary (Text) [Resumen de la Película]
│   ├─── awards (Text) [Principales Premios Ganados]
│   └─── features (Array[String]) [3 Características Destacadas]
│       ├─── features[0] (String)
│       ├─── features[1] (String)
│       └─── features[2] (String)
│
├─── CONTENIDO_MULTIMEDIA
│   ├─── images (Array[String]) [URLs de Imágenes]
│   │   ├─── images[0] (String) [URL Imagen Principal - Requerida]
│   │   ├─── images[1] (String) [URL Imagen Secundaria - Opcional]
│   │   └─── images[2] (String) [URL Imagen Terciaria - Opcional]
│   ├─── trailer (String) [URL del Tráiler - YouTube o MP4]
│   └─── audio_url (String) [URL del Audio Narrado - Opcional]
│
├─── METADATOS_AUTORIA
│   ├─── author_id (UUID) [ID del Usuario Autor - Foreign Key → users.id]
│   ├─── created_at (Timestamp) [Fecha de Creación]
│   └─── updated_at (Timestamp) [Fecha de Última Actualización]
│
└─── METADATOS_ESTADO
    ├─── draft (Boolean) [Borrador: true | Publicado: false]
    └─── visibility (String) [Visibilidad: "public" | "private" | "premium"]
```

### 8.2 Diagrama Visual del Árbol de Datos

```
                    ┌─────────────────────┐
                    │       POST          │
                    │    (Película)       │
                    └──────────┬──────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
        ▼                      ▼                      ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│ IDENTIFICACIÓN│    │  PRODUCCIÓN   │    │ CLASIFICACIÓN │
├───────────────┤    ├───────────────┤    ├───────────────┤
│ • id          │    │ • distributor │    │ • category    │
│ • original_   │    │ • director    │    │ • streaming   │
│   title       │    │ • movie_cast  │    │               │
│ • spanish_    │    │               │    │               │
│   title       │    │               │    │               │
│ • year        │    │               │    │               │
└───────────────┘    └───────────────┘    └───────────────┘
        │                      │                      │
        └──────────────────────┼──────────────────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
        ▼                      ▼                      ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│ DESCRIPTIVO   │    │  MULTIMEDIA   │    │   AUTORÍA     │
├───────────────┤    ├───────────────┤    ├───────────────┤
│ • summary     │    │ • images[]    │    │ • author_id   │
│ • awards      │    │   - [0]       │    │ • created_at  │
│ • features[]  │    │   - [1]       │    │ • updated_at  │
│   - [0]       │    │   - [2]       │    │               │
│   - [1]       │    │ • trailer     │    │               │
│   - [2]       │    │ • audio_url   │    │               │
└───────────────┘    └───────────────┘    └───────────────┘
                               │
                               ▼
                    ┌───────────────┐
                    │    ESTADO     │
                    ├───────────────┤
                    │ • draft       │
                    │ • visibility  │
                    └───────────────┘
```

### 8.3 Relaciones del Árbol de Datos

```
POST
  │
  ├─── RELACIÓN CON USUARIO (Autor)
  │   └─── author_id → users.id (Foreign Key)
  │       └─── Permite obtener información del autor:
  │           • name (Nombre del autor)
  │           • email (Email del autor)
  │           • role (Rol del autor)
  │
  ├─── RELACIÓN CON FAVORITOS (Colaboradores Premium)
  │   └─── id → favorites.post_id (Foreign Key)
  │       └─── Permite obtener:
  │           • Lista de usuarios que marcaron como favorito
  │           • Fecha en que se marcó como favorito
  │
  └─── RELACIÓN CON CATEGORÍAS (Implícita)
      └─── category → CATEGORIES[] (Validación)
          └─── Valores permitidos:
              • "Ciencia Ficción"
              • "Tecnología"
```

### 8.4 Validaciones y Restricciones del Árbol

1. **Campos Requeridos (NOT NULL)**:
   - `id`, `original_title`, `spanish_title`, `year`, `distributor`, `director`, `movie_cast`, `streaming`, `awards`, `summary`, `trailer`
   - `author_id`, `created_at`
   - `images[0]` (al menos una imagen)

2. **Validaciones de Formato**:
   - `year`: Debe ser un número de 4 dígitos (YYYY)
   - `features`: Debe contener exactamente 3 elementos no vacíos
   - `images`: Debe contener al menos 1 URL válida
   - `trailer`: Debe ser una URL válida (YouTube o MP4)

3. **Restricciones de Integridad**:
   - `author_id` debe existir en la tabla `users`
   - `draft` por defecto es `true` (borrador)
   - `updated_at` se actualiza automáticamente mediante trigger

4. **Índices para Optimización**:
   - Índice en `author_id` para búsquedas por autor
   - Índice en `category` para filtrado por categoría
   - Índice en `year` para ordenamiento y filtrado
   - Índice en `draft` para filtrar posts publicados
   - Índice en `created_at` para ordenamiento cronológico

### 8.5 Flujo de Datos en el Árbol

```
ENTRADA DE DATOS (Formulario)
    │
    ├─── Validación Cliente (JavaScript)
    │   └─── Verifica campos requeridos y formatos
    │
    ├─── Subida de Archivos (Storage)
    │   ├─── Imágenes → Supabase Storage
    │   └─── Audio → Supabase Storage
    │
    └─── Inserción en Base de Datos
        ├─── Verificación RLS (Row Level Security)
        │   └─── Valida permisos del usuario
        │
        ├─── Inserción en tabla `posts`
        │   └─── Trigger actualiza `created_at`
        │
        └─── Respuesta al Cliente
            └─── Post creado/actualizado

LECTURA DE DATOS (Visualización)
    │
    ├─── Consulta a Base de Datos
    │   ├─── SELECT con JOIN a `users` (autor)
    │   └─── Filtrado por RLS según rol
    │
    ├─── Obtención de URLs de Storage
    │   ├─── Imágenes desde Supabase Storage
    │   └─── Audio desde Supabase Storage
    │
    └─── Renderizado en Interfaz
        ├─── Componente PostCard (lista)
        └─── Componente PostDetail (modal)
```

---

## Conclusión

Este documento presenta la documentación técnica completa del blog de películas, incluyendo:

1. ✅ **Justificación detallada** de todas las herramientas y tecnologías utilizadas (React, JavaScript, Supabase, Vercel, Tailwind CSS, React Three Fiber, UUID)
2. ✅ **Autoevaluación exhaustiva** de atributos de calidad con métricas específicas (Promedio: 8.4/10)
3. ✅ **Definición del tipo de navegación** con diagrama y explicación detallada (Jerárquica con elementos lineales y modales)
4. ✅ **Jerarquía completa** de 7 tipos de usuarios (1 admin, 2 nivel 1, 4 nivel 2)
5. ✅ **Tabla detallada** de privilegios y no privilegios por tipo de usuario (mínimo 3 de cada por tipo)
6. ✅ **Diagramas de casos de uso** para cada uno de los 7 tipos de usuario
7. ✅ **Diagramas de secuencia** para casos de uso representativos de cada tipo de usuario
8. ✅ **Árbol de datos completo** para el componente película (post) basado en la figura 18.3, incluyendo estructura, relaciones, validaciones y flujo de datos

La documentación refleja la arquitectura actual del sistema basada en React, Supabase (PostgreSQL con RLS), y Vercel para el despliegue, proporcionando una base sólida para el mantenimiento, evolución y comprensión del proyecto.

---

**Fecha de Documentación**: 2024  
**Versión del Sistema**: 0.1.0  
**Última Actualización**: Diciembre 2024
