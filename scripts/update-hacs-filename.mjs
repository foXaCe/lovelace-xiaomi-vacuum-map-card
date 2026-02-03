#!/usr/bin/env node
/**
 * Script pour mettre à jour le nom de fichier dans hacs.json
 * avec le fichier généré par Rollup (avec hash pour cache-busting)
 */

import { readFileSync, writeFileSync, readdirSync, unlinkSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = dirname(__dirname);

try {
    // Lire le répertoire dist pour trouver le fichier généré
    const distDir = join(rootDir, "dist");
    const files = readdirSync(distDir);

    // Trouver le fichier avec le pattern dreame-vacuum-card-[hash].js
    const hashedFile = files.find((f) => /^dreame-vacuum-card-[a-zA-Z0-9_-]+\.js$/.test(f));

    if (!hashedFile) {
        console.error("❌ Fichier avec hash non trouvé dans dist/");
        process.exit(1);
    }

    // Supprimer les anciens fichiers sans hash
    files.forEach((f) => {
        if (f.startsWith("dreame-vacuum-card") && f.endsWith(".js") && f !== hashedFile) {
            unlinkSync(join(distDir, f));
            console.log(`🗑️  Removed old file: ${f}`);
        }
    });

    // Lire et mettre à jour hacs.json
    const hacsPath = join(rootDir, "hacs.json");
    const hacsContent = JSON.parse(readFileSync(hacsPath, "utf-8"));

    const oldFilename = hacsContent.filename;
    hacsContent.filename = hashedFile;

    writeFileSync(hacsPath, JSON.stringify(hacsContent, null, 4) + "\n");

    console.log(`✅ HACS filename updated: ${oldFilename} → ${hashedFile}`);
} catch (error) {
    console.error("❌ Erreur:", error.message);
    process.exit(1);
}
