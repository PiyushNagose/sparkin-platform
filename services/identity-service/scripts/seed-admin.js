import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { connectDatabase, disconnectDatabase } from "../src/config/database.js";
import { UserModel } from "../src/modules/auth/user.model.js";

const adminEmail = "admin@sparkin.local";
const adminPassword = "Admin@12345";

async function seedAdmin() {
  await connectDatabase();

  const passwordHash = await bcrypt.hash(adminPassword, 12);
  const existingAdmin = await UserModel.findOne({ email: adminEmail });

  if (existingAdmin) {
    existingAdmin.set({
      fullName: "Admin User",
      passwordHash,
      role: "admin",
      phoneNumber: "+910000000000",
    });
    await existingAdmin.save();
  } else {
    await UserModel.create({
      _id: crypto.randomUUID(),
      fullName: "Admin User",
      email: adminEmail,
      passwordHash,
      role: "admin",
      phoneNumber: "+910000000000",
    });
  }

  console.log("Admin user is ready.");
  console.log(`Email: ${adminEmail}`);
  console.log(`Password: ${adminPassword}`);
}

seedAdmin()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectDatabase();
  });
