Kopiko Brew — React SPA (Vite)

This is a small single-page application port of the provided HTML into React + Vite.
It demonstrates:

- React Router v6 with dynamic routes and nested routes
- Protected route using an AuthContext
- Programmatic navigation after login/register
- 404 page

Quick start (PowerShell on Windows):

```powershell
cd D:\Lab
npm install
npm run dev
```

Open the URL printed by Vite (usually http://localhost:5173).

Notes:
- Auth is an in-memory demo (no backend). Login accepts any non-empty email/password.
- Menu data is in `src/data/menu.js`.
- Styles are in `src/styles.css` and are intentionally minimal.

Next steps (optional):
- Wire up a real backend for auth and persistence
- Expand account nested routes
- Add tests and build pipeline
