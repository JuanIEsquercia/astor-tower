import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

function getAdminApp() {
  const existing = getApps().find((a) => a.name === "admin");
  if (existing) return existing;

  const projectId   = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey  = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      `Firebase Admin: credenciales faltantes — projectId:${!!projectId} clientEmail:${!!clientEmail} privateKey:${!!privateKey}`
    );
  }

  return initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) }, "admin");
}

let _db: Firestore | null = null;
let _auth: Auth | null = null;

export function getAdminDb(): Firestore {
  if (!_db) _db = getFirestore(getAdminApp());
  return _db;
}

export function getAdminAuth(): Auth {
  if (!_auth) _auth = getAuth(getAdminApp());
  return _auth;
}
