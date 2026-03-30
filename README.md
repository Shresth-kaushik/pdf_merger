# Study Stack — PDF Merger

A minimalist, fully client-side PDF merger built with React + Vite. No files are ever uploaded — all processing happens in the browser using [pdf-lib](https://pdf-lib.js.org/).

## Features

- Drag & drop multiple PDFs
- Reorder files before merging (drag rows)
- Live page count & file size summary
- Custom output filename
- Handles encrypted/password-protected PDFs
- Fully responsive
- Zero backend — deploy anywhere static

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run dev server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### 3. Build for production

```bash
npm run build
```

Output goes to the `dist/` folder.

### 4. Preview production build locally

```bash
npm run preview
```

---

## Deployment

### Vercel (recommended)
```bash
npm i -g vercel
vercel
```
Follow the prompts. Framework preset: **Vite**.

### Netlify
```bash
npm run build
# Drag the dist/ folder to netlify.com/drop
```
Or connect your GitHub repo — set build command to `npm run build` and publish directory to `dist`.

### GitHub Pages
```bash
npm install --save-dev gh-pages
```
Add to `package.json` scripts:
```json
"deploy": "gh-pages -d dist"
```
Add to `vite.config.js`:
```js
base: '/your-repo-name/',
```
Then:
```bash
npm run build && npm run deploy
```

---

## Project Structure

```
pdf-merger/
├── index.html
├── vite.config.js
├── package.json
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── App.module.css
    ├── styles/
    │   └── globals.css
    ├── hooks/
    │   └── usePdfMerger.js       # Core merge logic
    └── components/
        ├── Header.jsx
        ├── Header.module.css
        ├── DropZone.jsx
        ├── DropZone.module.css
        ├── FileList.jsx
        ├── FileList.module.css
        ├── Sidebar.jsx
        └── Sidebar.module.css
```

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 | UI framework |
| Vite 5 | Build tool |
| pdf-lib | PDF merging (client-side) |
| CSS Modules | Scoped styling |

---

## License

MIT
