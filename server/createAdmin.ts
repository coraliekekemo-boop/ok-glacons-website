import { createClient } from "@libsql/client";
import bcrypt from "bcryptjs";

async function createAdmin() {
  console.log("👤 Création du compte administrateur...");
  
  const client = createClient({
    url: process.env.DATABASE_URL || 'file:local.db',
  });

  try {
    const username = "admin";
    const password = "admin123"; // Mot de passe par défaut
    const email = "admin@coradis.ci";
    
    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insérer l'admin
    await client.execute({
      sql: `INSERT INTO admins (username, password, email, createdAt, updatedAt) 
            VALUES (?, ?, ?, datetime('now'), datetime('now'))`,
      args: [username, hashedPassword, email],
    });
    
    console.log("✅ Compte administrateur créé avec succès !");
    console.log("📧 Email:", email);
    console.log("👤 Nom d'utilisateur:", username);
    console.log("🔐 Mot de passe:", password);
    console.log("");
    console.log("⚠️  IMPORTANT : Changez ce mot de passe dès que possible !");
    
  } catch (error: any) {
    if (error.message && error.message.includes('UNIQUE')) {
      console.log("ℹ️  Un administrateur existe déjà.");
    } else {
      console.error("❌ Erreur lors de la création :", error);
      throw error;
    }
  } finally {
    client.close();
  }
}

createAdmin()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));

