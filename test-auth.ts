import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

async function testAuth() {
  const configPath = path.join(process.cwd(), "firebase-applet-config.json");
  const firebaseConfig = JSON.parse(fs.readFileSync(configPath, "utf8"));

  process.env.GOOGLE_CLOUD_PROJECT = firebaseConfig.projectId;

  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: firebaseConfig.projectId,
  });

  console.log("Testing Auth with project:", firebaseConfig.projectId);
  try {
    const listUsers = await admin.auth().listUsers(1);
    console.log("AUTH_SUCCESS: Found users", listUsers.users.length);
  } catch (e) {
    console.error("AUTH_ERROR:", e.message);
  }
}

testAuth();
