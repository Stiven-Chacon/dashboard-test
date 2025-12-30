# Sistema de Gestión de Categorías

Sistema web completo para administrar categorías con operaciones CRUD, búsqueda, filtros y diseño responsive.

## 🌐 Demo en Vivo

**URL de Producción**: [https://be-king-network.netlify.app/](https://be-king-network.netlify.app/)

---

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js 18 o superior
- npm o yarn

### Instalación y Ejecución

```bash
# Clonar el repositorio
git clone https://github.com/Stiven-Chacon/dashboard-test
cd dashboard-test

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Abrir en el navegador
http://localhost:3000
```

## 🛠️ Decisiones Técnicas

### Stack Tecnológico
- **Next.js 14 (App Router)**: Framework React moderno con Server Components y routing optimizado
- **TypeScript**: Type safety para prevenir errores en tiempo de compilación
- **Tailwind CSS**: Utility-first CSS para desarrollo rápido y consistente
- **Lucide React**: Iconos ligeros y escalables

### Arquitectura
```
src/
├── api/              # Capa de servicios API
├── components/       # Componentes React reutilizables
├── hooks/           # Custom hooks para lógica de negocio
├── utils/           # Funciones de utilidad y validadores
```

### Decisiones Clave

**1. Separación de Responsabilidades**
- **API Layer** (`categories.api.ts`): Centraliza todas las llamadas HTTP
- **Custom Hooks**: Encapsulan lógica de estado y side effects
- **Validadores**: Funciones puras para validación de formularios

**2. Manejo de Estados**
- Estados locales con `useState` para UI
- `useMemo` para optimizar filtrado y búsqueda
- Loading/error states para mejor UX

**3. Comunicación con Backend**
- JWT Bearer token en header `Authorization`
- FormData para uploads de imágenes
- JSON para operaciones sin archivos
- Manejo unificado de errores

**4. Filtrado y Búsqueda**
- **Client-side filtering**: Mejor UX con respuesta instantánea
- Paginación calculada sobre datos filtrados
- Combina búsqueda + filtros con lógica AND

**5. Responsive Design**
- Mobile-first approach
- Tabla → Cards en móvil (<768px)
- Modales adaptables con scroll

## 📚 Librerías Utilizadas

| Librería | Versión | Propósito |
|----------|---------|-----------|
| `next` | 14.x | Framework React con SSR/SSG |
| `react` | 18.x | Librería UI core |
| `typescript` | 5.x | Tipado estático |
| `tailwindcss` | 3.x | Estilos utility-first |
| `lucide-react` | latest | Iconos SVG optimizados |

**¿Por qué estas librerías?**
- **Next.js**: SEO, performance, routing automático
- **TypeScript**: Reduce bugs, mejor DX con autocomplete
- **Tailwind**: Desarrollo rápido, bundle pequeño, fácil mantenimiento
- **Lucide**: Ligero (tree-shakeable), consistente, personalizable

## 🔧 Funcionalidades Implementadas

### Autenticación
- Login con credenciales
- Almacenamiento seguro de JWT en localStorage
- Validación de token en cada request

### Gestión de Categorías
- **Crear**: Formulario con validación, upload de imagen, toggle de estado
- **Editar**: Pre-carga de datos, actualización parcial o completa
- **Listar**: Tabla responsive con paginación
- **Buscar**: Filtrado en tiempo real por nombre/descripción
- **Filtrar**: Por estado (activo/inactivo) y rango de fechas

### Validaciones
- Campos obligatorios
- Formato HEX de color con auto-formato
- Tamaño máximo de imagen (5MB)
- Formatos válidos (JPG, PNG, GIF, WebP)
- Longitud máxima de descripción (200 caracteres)

### UX/UI
- Loading states con spinners
- Mensajes de éxito/error
- Estados vacíos informativos
- Preview de imágenes
- Confirmaciones visuales
- Modo debug con datos mock

### Limitaciones Conocidas
- Filtrado client-side (puede ser lento con >1000 registros)
- Sin infinite scroll (solo paginación tradicional)
- Sin drag & drop para upload de imágenes
- Sin edición en línea (solo mediante modal)

## 🧪 Testing

Ver `QA_CHECKLIST.md` para pruebas funcionales completas.

**Cobertura de pruebas**: 28 casos funcionales
- ✅ Autenticación (login)
- ✅ Crear categorías
- ✅ Editar categorías
- ✅ Listar con paginación
- ✅ Búsqueda en tiempo real
- ✅ Filtros avanzados
- ✅ Validaciones de formulario
- ✅ Responsive design
- ✅ Manejo de errores

---

**Versión**: 1.0.0  
**Autor**: Stiven Chacon 
**Última actualización**: 30 de Diciembre, 2024
