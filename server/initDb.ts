import { createClient } from "@libsql/client";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function initDatabase() {
  console.log("🔧 Initialisation de la base de données SQLite...");
  
  const client = createClient({
    url: process.env.DATABASE_URL || 'file:local.db',
  });

  try {
    // Lire le fichier de migration
    const migrationPath = join(__dirname, "..", "drizzle", "0000_rapid_landau.sql");
    const migrationSQL = readFileSync(migrationPath, "utf-8");
    
    // Exécuter chaque instruction SQL
    const statements = migrationSQL
      .split(";")
      .map(s => s.trim())
      .filter(s => s.length > 0);
    
    for (const statement of statements) {
      await client.execute(statement);
    }
    
    console.log("✅ Base de données initialisée avec succès !");
    console.log("📊 Tables créées :");
    console.log("   - users");
    console.log("   - admins");
    console.log("   - orders");
    console.log("   - orderItems");
    console.log("   - products");
    console.log("   - contactMessages");
    
  } catch (error) {
    console.error("❌ Erreur lors de l'initialisation :", error);
    throw error;
  } finally {
    client.close();
  }
}

initDatabase()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));

