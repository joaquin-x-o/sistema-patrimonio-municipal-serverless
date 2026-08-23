# Sistema de Control de Patrimonio a Escala Municipal

## Identificación
* **Proyecto:** Sistema de Control de Patrimonio.

## Descripción técnica
El presente proyecto consiste en el desarrollo del frontend para una aplicación web destinada a gestionar el patrimonio de un gobierno de escala municipal. El sistema se define como una plataforma de uso estrictamente interno. Se trata de un back office diseñado de manera exclusiva para operar dentro del entorno institucional de la municipalidad. 

Esta herramienta busca reemplazar la gestión manual mediante planillas de cálculo, brindando a los empleados un entorno digital unificado para el registro, control de acceso y seguimiento del ciclo de vida de los bienes patrimoniales.

## Arquitectura y Estructura del Proyecto
El proyecto sigue una arquitectura modular orientada a componentes, dividiendo las responsabilidades lógicas y visuales para garantizar una alta escalabilidad. Todo el código fuente se encuentra dentro del directorio `src`, organizado de la siguiente manera:

* **`app/`**: Componentes de nivel aplicación que configuran e instancian elementos estructurales globales
* **`components/`**: Aloja todos los bloques de construcción de la interfaz, subdivididos según su propósito:
  * **`ui/`**: Sistema de diseño estático. Contiene componentes visuales puros y reutilizables creados desde cero con Tailwind CSS, como botones, tarjetas, etiquetas de estado e inputs.
  * **`layout/`**: Componentes estructurales de la aplicación, como la barra lateral de navegación y la barra superior.
  * **`features/`**: Componentes específicos del dominio del negocio, agrupados por entidad, como los módulos lógicos para productos y áreas departamentales.
* **`pages/`**: Vistas principales de la aplicación asociadas a rutas específicas, como el panel de control principal o la sección de visualización del sistema de diseño.
* **`Hooks/`**: Custom hooks reutilizables que encapsulan lógica compartida y comportamiento de la aplicación
* **`Routes/`**: Archivos de configuración de navegación y ruteo centralizado de la aplicación.
* **`interfaces/` y `types/`**: Definiciones de tipado estricto para TypeScript, asegurando la consistencia de los modelos de datos en todo el código.
* **`Schemas/`**: Esquemas creados para la validacion de datos, principalmente utilizado en formularios.
* **`services/`**: Módulos encargados de la comunicación con servicios externos o la futura integración con una base de datos.
* **`utils/`**: Funciones auxiliares y herramientas de formato general, como conversores de fechas y diccionarios de productos.
* **`lib/`**: Configuración e inicialización de librerías externas

## Objetivos y Tecnologías

**Metas alcanzadas**
* Implementación del sistema final y completo basado en el producto mínimo viable.
* Establecimiento de la arquitectura de archivos, configuración del tipado estricto y abstracción de lógica mediante hooks genéricos.
* Integración de un entorno serverless y sistema de autenticación por roles, con una arquitectura desacoplada que facilita la migración a un backend propio.

**Stack Tecnológico Utilizado:**
* **React + Vite:** Entorno base para el desarrollo rápido y optimizado del frontend.
* **TypeScript:** Para el tipado estático seguro y escalabilidad del código.
* **Tailwind CSS:** Framework de estilos de utilidad para la maquetación y diseño de la interfaz.
* **Supabase:** Entorno serverless para la gestión de la base de datos, persistencia y autenticación.

## Guía de Instalación
Sigue estos pasos para clonar y ejecutar el proyecto en tu entorno local:

1. **Clonar el repositorio:**
```bash
   git clone https://github.com/joaquin-x-o/sistema-patrimonio-serverless-prod.git
```

2. **Navegar al directorio del proyecto e instalar dependencias:**
```bash
   cd patrimonio-front
   npm install
```

3. **Variables de entorno:**
   Duplica el archivo `.env.template`, renómbralo a `.env` y completa las variables necesarias.

4. **Ejecutar el servidor de desarrollo:**
```bash
   npm run dev
```