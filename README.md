# 🎨 GRIND Frontend - Next.js E-commerce

Frontend de la aplicación GRIND, construido con Next.js 15, React 19 y Tailwind CSS v4.

## 🚀 Inicio Rápido

### Instalación
```bash
# Windows, macOS, Linux
npm install
```

### Variables de Entorno
Crear archivo `.env.local`:

#### Windows
```cmd
copy .env.example .env.local
# Editar con notepad o tu editor preferido
notepad .env.local
```

#### macOS/Linux
```bash
cp .env.example .env.local
# Editar con tu editor preferido
nano .env.local
# o
code .env.local
```

Contenido del archivo:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Ejecutar en Desarrollo

#### Todos los SO
```bash
npm run dev
```

#### Verificar que funciona
- Abrir navegador en http://localhost:3000
- Verificar que no haya errores en consola
- Confirmar conexión con backend en puerto 5000

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## 🛠️ Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build de producción  
- `npm start` - Ejecutar build de producción
- `npm run lint` - Linter ESLint

## 🎨 Componentes UI Mejorados

### Dropdowns Minimalistas
El proyecto incluye componentes de dropdown personalizados con diseño minimalista:

- **Dropdown básico**: Selector simple con animaciones suaves
- **MultiSelect**: Selector múltiple con chips
- **Variantes**: `default`, `minimal`, `ghost`
- **Tamaños**: `sm`, `md`, `lg`
- **Estados**: error, disabled, loading

```tsx
import Dropdown from '@/components/ui/Dropdown';

<Dropdown
  options={[
    { value: 'option1', label: 'Opción 1' },
    { value: 'option2', label: 'Opción 2' }
  ]}
  value={selectedValue}
  onChange={setSelectedValue}
  variant="minimal"
  size="md"
/>
```

## 📁 Estructura

```
src/
├── app/                # App Router (Next.js 15)
├── components/
│   ├── ui/            # Componentes UI reutilizables
│   │   ├── Dropdown.tsx    # Nuevo componente dropdown
│   │   ├── Pagination.tsx
│   │   └── ToastContainer.tsx
│   ├── admin/         # Componentes del panel admin
│   ├── Navbar.tsx     # Navegación mejorada
│   ├── ProductCard.tsx
│   └── Footer.tsx
├── contexts/          # React Context
├── hooks/             # Hooks personalizados
├── services/          # API calls
├── types/             # TypeScript types
└── utils/             # Utilidades
```

## 🎨 Tecnologías Clave

- **Next.js 15** - Framework React con App Router
- **React 19** - Biblioteca UI con últimas características
- **TypeScript** - Tipado estático
- **Tailwind CSS v4** - Utilidades CSS modernas
- **Lucide React** - Iconos SVG optimizados
- **Chart.js** - Gráficos interactivos
- **React Hook Form** - Formularios performantes
- **Zod** - Validación de esquemas

## 🔧 Características Implementadas

### ✨ Dropdowns Mejorados
- Animaciones suaves con Tailwind
- Variantes de diseño (default, minimal, ghost)  
- Soporte para múltiple selección
- Estados de error y validación
- Keyboard navigation
- Click outside para cerrar

### 🎨 Diseño Minimalista
- Colores neutros y suaves
- Espaciado consistente
- Hover states elegantes
- Transiciones fluidas
- Responsive design

### 📱 Componentes UI
- Sistema de design coherente
- Componentes reutilizables
- Props tipadas con TypeScript
- Accesibilidad básica

## 🔗 Integración con Backend

El frontend se conecta al backend Express.js:
- Autenticación JWT
- API REST endpoints
- Manejo de estados globales
- Error handling robusto

Consulta el README principal del proyecto para más detalles sobre la configuración completa.
