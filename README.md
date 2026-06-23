# nexabook-module

Módulo micro-frontend para la plataforma **Nexabook Hub**. Empaquetado como un bundle IIFE inyectable vía `manifest.json` y desplegado automáticamente en GitHub Pages con GitHub Actions.

---

## 🌐 URLs de Producción

| Recurso    | URL                                                    |
| ---------- | ------------------------------------------------------ |
| Manifiesto | `https://user.github.io/nexabook-module/manifest.json` |
| Bundle     | `https://user.github.io/nexabook-module/bundle.js`     |

---

## 🗂️ Estructura del Proyecto

```
nexabook-module/
├── public/
│   └── manifest.json          # Manifiesto del módulo (copiado a dist/ en cada build)
├── src/
│   ├── components/
│   │   ├── MonitorScreen.tsx  # Componente de pantalla completa
│   │   └── MonitorWidget.tsx  # Componente de widget compacto
│   ├── main.tsx               # Punto de entrada: expone componentes al Hub
│   └── index.css              # Estilos globales
├── .github/
│   └── workflows/
│       └── deploy.yml         # CI/CD: build → gh-pages automático
└── vite.config.ts             # Configuración de empaquetado IIFE
```

---

## ⚙️ Arquitectura del Módulo

Este módulo **no se ejecuta de forma independiente**. El Hub de Nexabook carga el `bundle.js` dinámicamente, lee el namespace global y renderiza los componentes en el contexto de la aplicación principal.

### 1. Exposición de Componentes (`src/main.tsx`)

El bundle registra los componentes en el objeto `globalThis` bajo el ID del módulo:

```typescript
import { MonitorScreen } from "./components/MonitorScreen";
import { MonitorWidget } from "./components/MonitorWidget";

(globalThis as any)["com.nexabook.modulo-pro"] = {
  screen: MonitorScreen, // Vista de pantalla completa
  widget: MonitorWidget, // Vista de widget compacto
};
```

- **`screen`**: Se renderiza cuando el usuario navega a la ruta del módulo.
- **`widget`**: Se muestra como componente compacto en el dashboard del Hub.

### 2. Manifiesto del Módulo (`public/manifest.json`)

El Hub descarga este archivo para descubrir el módulo y saber dónde cargar el bundle:

```json
{
  "id": "com.nexabook.modulo-pro",
  "name": "Módulo Profesional",
  "version": "1.0.0",
  "entryPoint": "https://user.github.io/nexabook-module/bundle.js",
  "exports": {
    "screen": {
      "component": "MonitorScreen",
      "label": "Dashboard Principal",
      "icon": "LayoutDashboard"
    },
    "widget": {
      "component": "MonitorWidget",
      "label": "Resumen Rápido",
      "size": "small"
    }
  },
  "permissions": ["storage.local", "network.api"]
}
```

### 3. Configuración de Vite (`vite.config.ts`)

React y React DOM se declaran como **externos** porque el Hub ya los provee en tiempo de ejecución. El bundle resultante es un IIFE liviano que únicamente contiene el código del módulo:

```typescript
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ["react", "react-dom", "react-dom/client"],
      output: {
        format: "iife",
        entryFileNames: "bundle.js",
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react-dom/client": "ReactDOM",
        },
      },
    },
  },
});
```

---

## 🚀 Registro en el Hub

Para activar el módulo en Nexabook Hub, ve a **Settings** e ingresa la URL del manifiesto:

```
https://eriickchavez.github.io/hub-boards/manifest.json
```

El Hub cargará el manifiesto, descargará el `bundle.js` y registrará los componentes `screen` y `widget` automáticamente.

---

## 🛠️ Desarrollo Local

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo con HMR
npm run dev

# Compilar el bundle de producción
npm run build
```

> **Nota:** Para pruebas locales del bundle inyectable, el Host (Hub) debe proveer `window.React` y `window.ReactDOM` antes de cargar el script, ya que están declarados como externos.

---

## 📦 CI/CD — Despliegue Automático

Cada push a la rama `main` dispara el siguiente pipeline:

```
Push a main
    └─▶ GitHub Actions (deploy.yml)
            ├─▶ npm install
            ├─▶ npm run build
            └─▶ peaceiris/actions-gh-pages@v4
                    └─▶ Publica ./dist → rama gh-pages
```

GitHub Pages sirve el contenido de la rama `gh-pages` en:
`https://eriickchavez.github.io/hub-boards/`

> ⚠️ **No hagas commits directamente a la rama `gh-pages`**. Es una rama administrada por el workflow y se sobrescribe en cada despliegue.

---

## 🔌 Comunicación con el Hub

Este módulo está desacoplado del Hub por diseño. Si necesitas interactuar con la infraestructura principal (base de datos, APIs, estado global), utiliza eventos del DOM para mantener la independencia:

```typescript
// Emitir un evento hacia el Hub
window.dispatchEvent(new CustomEvent("nexabook:action", {
  detail: { type: "MY_ACTION", payload: { ... } }
}));

// Escuchar eventos del Hub
window.addEventListener("nexabook:event", (e: any) => {
  console.log(e.detail);
});
```
