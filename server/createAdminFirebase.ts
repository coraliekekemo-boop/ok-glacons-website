import { db } from "./firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import bcrypt from "bcryptjs";

async function createAdminUser() {
  console.log("👤 Création du compte administrateur sur Firestore...");
  const username = "admin";
  const password = "admin123"; // Default password
  const email = "admin@coradis.ci";

  try {
    // Check if admin already exists
    const adminsRef = collection(db, "admins");
    const q = query(adminsRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      console.log("⚠️  Le compte administrateur existe déjà. Ignoré.");
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    await addDoc(adminsRef, {
      username,
      password: hashedPassword,
      email,
    });

    console.log("✅ Compte administrateur créé avec succès !");
    console.log(`📧 Email: ${email}`);
    console.log(`👤 Nom d'utilisateur: ${username}`);
    console.log(`🔐 Mot de passe: ${password}`);
    console.log("\n⚠️  IMPORTANT : Changez ce mot de passe dès que possible !");

  } catch (error) {
    console.error("❌ Erreur lors de la création de l'administrateur :", error);
  }
}

createAdminUser();

