#!/usr/bin/env node
/**
 * Escanea la carpeta images/ y genera images.json con todas las imágenes
 * agrupadas por proyecto (carpeta de primer nivel) como URLs públicas de
 * Firebase Hosting.
 *
 * Uso: node scripts/generate-images-json.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const IMAGES_DIR = path.join(ROOT, 'images');
const OUTPUT = path.join(ROOT, 'images.json');
const BASE_URL = 'https://cloud-images-mdtv.web.app';

const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp']);

/** Devuelve todas las rutas de imágenes (relativas a images/) recursivamente. */
function collectImages(dir, relBase = '') {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const files = [];

    for (const entry of entries) {
        const relPath = path.join(relBase, entry.name);
        const absPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            files.push(...collectImages(absPath, relPath));
        } else if (IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
            files.push(relPath);
        }
    }

    return files;
}

function build() {
    if (!fs.existsSync(IMAGES_DIR)) {
        console.error(`No se encontró la carpeta: ${IMAGES_DIR}`);
        process.exit(1);
    }

    const relPaths = collectImages(IMAGES_DIR).sort();
    const byProject = {};

    for (const rel of relPaths) {
        // El proyecto es la carpeta de primer nivel. Imágenes sueltas en la
        // raíz de images/ se agrupan bajo "_root".
        const parts = rel.split(path.sep);
        const project = parts.length > 1 ? parts[0] : '_root';
        // URL siempre con "/" (no separador de Windows).
        const url = `${BASE_URL}/images/${parts.join('/')}`;

        if (!byProject[project]) byProject[project] = [];
        byProject[project].push(url);
    }

    fs.writeFileSync(OUTPUT, JSON.stringify(byProject, null, 2) + '\n');

    const total = relPaths.length;
    const projects = Object.keys(byProject).length;
    console.log(`Generado ${path.relative(ROOT, OUTPUT)}: ${total} imágenes en ${projects} proyectos.`);
}

build();
