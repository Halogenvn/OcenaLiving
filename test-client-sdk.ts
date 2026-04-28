import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import fs from 'fs';
import path from 'path';

async function testClientSdk() {
  const configPath = path.join(process.cwd(), "firebase-applet-config.json");
  const firebaseConfig = JSON.parse(fs.readFileSync(configPath, "utf8"));

  console.log("Testing Client SDK with config:", firebaseConfig.projectId);

  const app = initializeApp(firebaseConfig);
  // Pass the databaseId explicitly
  const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

  try {
    const docRef = await addDoc(collection(db, "_client_test"), {
      timestamp: serverTimestamp(),
      source: "server_client_sdk"
    });
    console.log("CLIENT_SDK_SUCCESS: Doc ID", docRef.id);
  } catch (e) {
    console.error("CLIENT_SDK_ERROR:", e.message);
  }
}

testClientSdk();
