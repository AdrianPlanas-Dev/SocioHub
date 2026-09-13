import fs from "fs";
import path from "path";

const root = process.cwd();

const distDir = path.join(root, "dist");
const indexPath = path.join(distDir, "index.html");

const outputDir = path.join(
  root,
  "..",
  "apps-script"
);

const indexOutputPath = path.join(
  outputDir,
  "Index.html"
);

const bundleOutputPath = path.join(
  outputDir,
  "Bundle.html"
);

// ========================================
// COMPROBAR DIST
// ========================================

if (!fs.existsSync(indexPath)) {
  throw new Error(
    `No existe ${indexPath}. Ejecuta primero "npm run build".`
  );
}

// ========================================
// LEER INDEX GENERADO POR VITE
// ========================================

const html = fs.readFileSync(
  indexPath,
  "utf8"
);

// ========================================
// BUSCAR EL JAVASCRIPT DE VITE
// ========================================

const scriptMatch = html.match(
  /<script[^>]+src="([^"]+)"[^>]*><\/script>/
);

if (!scriptMatch) {
  throw new Error(
    "No se ha encontrado el bundle JavaScript en dist/index.html"
  );
}

const scriptSrc = scriptMatch[1];

console.log(
  "Script encontrado:",
  scriptSrc
);

// ========================================
// OBTENER RUTA REAL
// ========================================

const relativeScriptPath =
  scriptSrc.replace(/^\/+/, "");

const scriptPath = path.join(
  distDir,
  relativeScriptPath
);

if (!fs.existsSync(scriptPath)) {
  throw new Error(
    `No se encuentra el bundle: ${scriptPath}`
  );
}

// ========================================
// LEER BUNDLE
// ========================================

const js = fs.readFileSync(
  scriptPath,
  "utf8"
);

console.log(
  "BUNDLE:",
  scriptPath
);

console.log(
  "Tamaño bundle:",
  js.length,
  "caracteres"
);

console.log(
  "Primeros caracteres:",
  js.substring(0, 100)
);

// ========================================
// CONVERTIR A BASE64
// ========================================

const base64 = Buffer
  .from(js, "utf8")
  .toString("base64");

console.log(
  "Tamaño Base64:",
  base64.length,
  "caracteres"
);

// ========================================
// CREAR CARPETA
// ========================================

fs.mkdirSync(
  outputDir,
  { recursive: true }
);

// ========================================
// ESCRIBIR BUNDLE.HTML
// ========================================

fs.writeFileSync(
  bundleOutputPath,
  base64,
  "utf8"
);

// ========================================
// GENERAR INDEX.HTML PARA APPS SCRIPT
// ========================================

const indexHtml = `<!doctype html>
<html lang="es">

<head>
  <meta charset="UTF-8">

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  >

  <title>SocioHub</title>
</head>

<body>

  <div id="root"></div>

  <script>
    const base64 = <?!= JSON.stringify(include("Bundle")) ?>;

    try {
      console.log("BASE64:", base64.substring(0, 100));
      console.log("BASE64 length:", base64.length);

      const binary = atob(base64);

      const bytes = new Uint8Array(binary.length);

      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }

      const js = new TextDecoder("utf-8").decode(bytes);

      console.log("JS decodificado:", js.substring(0, 100));
      console.log("JS length:", js.length);

      const script = document.createElement("script");

      script.textContent = js;

      document.body.appendChild(script);

    } catch (error) {

      console.error("Error cargando SocioHub:", error);

      document.body.innerHTML = \`
        <pre style="
          padding:30px;
          color:red;
          white-space:pre-wrap;
        ">\${error.stack || error.message}</pre>
      \`;
    }
  </script>

</body>

</html>
`;

fs.writeFileSync(
  indexOutputPath,
  indexHtml,
  "utf8"
);

// ========================================
// FIN
// ========================================

console.log("");

console.log(
  "========================================"
);

console.log(
  "SocioHub generado correctamente"
);

console.log(
  "========================================"
);

console.log(
  "Index:",
  indexOutputPath
);

console.log(
  "Bundle:",
  bundleOutputPath
);