import "dotenv/config";
import bcrypt from "bcryptjs";
import { db } from "../db";
import { admins } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

async function createAdmin() {
  const username = process.argv[2] || "admin";
  const password = process.argv[3] || "admin123";
  const email = process.argv[4] || "admin@coradis.com";

  try {
    // Check if admin already exists
    const [existing] = await db
      .select()
      .from(admins)
      .where(eq(admins.username, username));

    if (existing) {
      console.log(`❌ Admin '${username}' existe déjà !`);
      process.exit(1);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    const [result] = await db.insert(admins).values({
      username,
      password: hashedPassword,
      email,
    });

    console.log(`✅ Admin créé avec succès !`);
    console.log(`   ID: ${result.insertId}`);
    console.log(`   Username: ${username}`);
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log(`\n🔒 Connectez-vous sur: http://localhost:3000/admin/login`);
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Erreur lors de la création de l'admin:", error);
    process.exit(1);
  }
}

createAdmin();

