# 📚 Índice de Documentación - Tallify

**Versión del proyecto:** 0.1.0-beta
**Última actualización:** 7 de Enero, 2026

---

## 🚀 Getting Started

Empieza aquí si es tu primera vez con el proyecto.

- **[README.md](../README.md)** - **START HERE** ⭐
  Visión general del proyecto, características, roadmap y links a documentación.

- **[QUICK_START.md](./QUICK_START.md)** - **5-Minute Setup** ⭐ NUEVO
  Setup rápido: instalación, configuración, migraciones y primer gasto en 5 minutos.

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - **System Architecture** ⭐ NUEVO
  Arquitectura server-first, data layer, database schema, patrones de componentes.

- **[setup/SUPABASE.md](./setup/SUPABASE.md)**
  Guía paso a paso para configurar Supabase (base de datos PostgreSQL).

- **[AUTHENTICATION.md](./AUTHENTICATION.md)** - **Sistema de Autenticación**
  Magic Links, roles de usuario (plan ENUM), onboarding y protección de rutas.

- **[deployment/DEPLOYMENT.md](./deployment/DEPLOYMENT.md)** - **Deploy a Producción**
  Guía de deployment con migraciones automáticas (Vercel, Railway, Fly.io).

- **[deployment/MIGRATION-GUIDE.md](./deployment/MIGRATION-GUIDE.md)** - **Database Migrations** ⭐ NUEVO
  Guía completa para aplicar migraciones Drizzle en dev y producción.

- **[setup/GITHUB_OAUTH.md](./setup/GITHUB_OAUTH.md)**
  Instrucciones para configurar GitHub OAuth (opcional).

- **[.env.example](../.env.example)**
  Template de variables de entorno. Copia a `.env.local` para desarrollo.

---

## 🎨 Design & UI

Sistema de diseño, componentes y cumplimiento de accesibilidad.

- **[design/design-system.md](./design/design-system.md)** - **Sistema de Diseño Tallify** ⭐
  Paleta de colores (#9FFF66), tipografía, espaciado, animaciones y design tokens.

- **[ACCESSIBILITY-COMPLIANCE.md](./ACCESSIBILITY-COMPLIANCE.md)** - **WCAG 2.1 AA Compliance** ✅ ACTUALIZADO
  Reporte de cumplimiento (89.2%), violaciones pendientes, y plan para 95%+.

- **[COMPONENT_GUIDE.md](./COMPONENT_GUIDE.md)** - **Guía de Componentes**
  Catálogo completo de componentes custom (TransactionItem, FilterBar, SearchBar, etc.).

---

## 📋 Product & Strategy

Visión del producto, objetivos y roadmap.

- **[product/PRD.md](./product/PRD.md)** - **Product Requirements Document**
  Research-backed design con enfoque en mercado hispano (Li & Forlizzi models, Epstein studies).

- **[product/BRD.md](./product/BRD.md)** - **Business Requirements Document**
  Requerimientos de negocio, propuesta de valor, features y diferenciadores competitivos.

---

## 👥 Para Desarrolladores

Guías para contribuir y trabajar con el código.

- **[CONTRIBUTING.md](../CONTRIBUTING.md)** - **Guía de Contribución**
  Cómo contribuir: setup, convenciones, PR process, bug reports.

- **[CLAUDE.md](../CLAUDE.md)** - **Guía para Claude Code** ✅ ACTUALIZADO
  Patterns y conventions para desarrollo. Trimmed a ~483 líneas (reducido desde 787).

- **[TESTING.md](./TESTING.md)** - **Testing Guide** ⭐ NUEVO
  Estrategias de testing, Playwright E2E, comandos, y manual testing checklist.

- **[IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md)** - **Estado de Implementación**
  Tracking de features completadas, en progreso y planeadas.

---

## 📄 Legal

- **[LICENSE.md](../LICENSE.md)**
  Licencia MIT del proyecto.

---

## 🗺️ Navegación Rápida

### Por Rol

**Nuevo Colaborador:**
1. [README.md](../README.md) - Empieza aquí
2. [QUICK_START.md](./QUICK_START.md) - Setup en 5 minutos ⭐
3. [setup/SUPABASE.md](./setup/SUPABASE.md) - Setup de DB
4. [ARCHITECTURE.md](./ARCHITECTURE.md) - Arquitectura del sistema
5. [CONTRIBUTING.md](../CONTRIBUTING.md) - Guía de contribución

**Diseñador/UI Developer:**
1. [design/design-system.md](./design/design-system.md) - Sistema de diseño Tallify
2. [COMPONENT_GUIDE.md](./COMPONENT_GUIDE.md) - Catálogo de componentes
3. [ACCESSIBILITY-COMPLIANCE.md](./ACCESSIBILITY-COMPLIANCE.md) - WCAG compliance (89.2%)

**Developer Experimentado:**
1. [CLAUDE.md](../CLAUDE.md) - Patterns & conventions (trimmed)
2. [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture
3. [TESTING.md](./TESTING.md) - Testing strategies
4. [IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md) - Feature tracking

**Product Manager:**
1. [README.md](../README.md) - Visión general y roadmap
2. [product/PRD.md](./product/PRD.md) - Product Requirements Document
3. [product/BRD.md](./product/BRD.md) - Business Requirements
4. [IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md) - Features y progreso

### Por Tarea

**Setup Inicial (5 minutos):**
- [README.md](../README.md) → [QUICK_START.md](./QUICK_START.md) → [setup/SUPABASE.md](./setup/SUPABASE.md) → [.env.example](../.env.example)

**Entender Arquitectura:**
- [ARCHITECTURE.md](./ARCHITECTURE.md) → [CLAUDE.md](../CLAUDE.md) → [deployment/MIGRATION-GUIDE.md](./deployment/MIGRATION-GUIDE.md)

**Crear Componente Nuevo:**
- [design/design-system.md](./design/design-system.md) → [COMPONENT_GUIDE.md](./COMPONENT_GUIDE.md) → [ACCESSIBILITY-COMPLIANCE.md](./ACCESSIBILITY-COMPLIANCE.md)

**Contribuir Feature:**
- [CONTRIBUTING.md](../CONTRIBUTING.md) → [IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md) → [CLAUDE.md](../CLAUDE.md)

**Deploy a Producción:**
- [deployment/MIGRATION-GUIDE.md](./deployment/MIGRATION-GUIDE.md) → [deployment/DEPLOYMENT.md](./deployment/DEPLOYMENT.md)

---

## 📊 Estado de la Documentación

| Documento | Estado | Versión | Última Actualización |
|-----------|--------|---------|---------------------|
| **Core Documentation** |
| README.md | ✅ Actualizado | 0.1.0-beta | Enero 2026 |
| CLAUDE.md | ✅ Trimmed (787→483 líneas) | 0.1.0-beta | Enero 2026 |
| CONTRIBUTING.md | ✅ Actualizado | 0.1.0-beta | Diciembre 2025 |
| LICENSE.md | ✅ Actualizado | - | Diciembre 2024 |
| **Getting Started** |
| QUICK_START.md | ⭐ Nuevo | 0.1.0-beta | Enero 2026 |
| ARCHITECTURE.md | ⭐ Nuevo | 0.1.0-beta | Enero 2026 |
| TESTING.md | ⭐ Nuevo | 0.1.0-beta | Enero 2026 |
| AUTHENTICATION.md | ✅ Actualizado | 0.1.0-beta | Diciembre 2025 |
| setup/SUPABASE.md | ✅ Actualizado | 0.1.0-beta | Diciembre 2024 |
| setup/GITHUB_OAUTH.md | ✅ Actualizado | 0.1.0-beta | Diciembre 2024 |
| **Design & UI** |
| design/design-system.md | ✅ Reorganizado | 0.1.0-beta | Diciembre 2024 |
| ACCESSIBILITY-COMPLIANCE.md | ✅ Consolidado | 0.1.0-beta | Enero 2026 |
| COMPONENT_GUIDE.md | ✅ Actualizado | 0.1.0-beta | Diciembre 2025 |
| **Product & Strategy** |
| product/PRD.md | ✅ Reorganizado | 0.1.0-beta | Diciembre 2025 |
| product/BRD.md | ✅ Reorganizado | 0.1.0-beta | Diciembre 2025 |
| **Deployment** |
| deployment/DEPLOYMENT.md | ✅ Reorganizado | 0.1.0-beta | Diciembre 2025 |
| deployment/MIGRATION-GUIDE.md | ✅ Reorganizado | 0.1.0-beta | Diciembre 2025 |
| **Implementation** |
| IMPLEMENTATION_STATUS.md | ✅ Actualizado | 0.1.0-beta | Diciembre 2025 |
| **Archived** |
| archive/planning/* | 🗄️ 3 archivos archivados | - | - |
| archive/audits/* | 🗄️ 3 archivos archivados | - | - |

---

## 💡 Tips de Navegación

- **⭐ NUEVO** - Documentación recién creada (Enero 2026)
- **✅ Actualizado** - Revisado y actualizado (Enero 2026)
- **✅ Reorganizado** - Movido a nueva estructura de carpetas
- **✅ Consolidado** - Múltiples archivos fusionados en uno
- **✅ Trimmed** - Reducido y optimizado para mejor lectura
- **🗄️ Archivado** - Movido a `/docs/archive/` (documentación histórica)

**Nueva Estructura:**
```
docs/
├── design/         # Design system y UI
├── product/        # PRD, BRD
├── deployment/     # Deployment y migrations
├── setup/          # Setup guides
└── archive/        # Docs históricos
    ├── audits/
    └── planning/
```

**Usa "Navegación Rápida" arriba para encontrar el camino según tu rol o tarea.**

---

## 📈 Mejoras en Esta Reorganización (Enero 2026)

- ✅ **2 archivos eliminados** (obsoletos/duplicados)
- ✅ **6 archivos archivados** (completados/históricos)
- ✅ **4 nuevos documentos** (QUICK_START, ARCHITECTURE, TESTING, versión consolidada de ACCESSIBILITY)
- ✅ **CLAUDE.md reducido** de 787 → 483 líneas
- ✅ **Estructura organizada** en 3 subdirectorios temáticos
- ✅ **README.md actualizado** con roadmap v0.1.0-beta correcto
- ✅ **Database schema actualizado** con user_profiles correcto

**Resultado:** Documentación más clara, navegable y mantenible.

---

**¿Falta algo?** Abre un issue en GitHub o consulta [CONTRIBUTING.md](../CONTRIBUTING.md) para proponer mejoras.

**Proyecto:** Tallify - Personal Expense Tracker
**Versión:** 0.1.0-beta
**Licencia:** MIT
**Mantenido por:** [luishron](https://github.com/luishron)
