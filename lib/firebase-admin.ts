import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

let _app: App | null = null;
let _db: Firestore | null = null;

export function getAdminApp(): App {
  if (_app) return _app;

  const existing = getApps().find((a) => a.name === "admin");
  if (existing) return (_app = existing);

  const projectId   = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey  = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      `Firebase Admin: credenciales faltantes — projectId:${!!projectId} clientEmail:${!!clientEmail} privateKey:${!!privateKey}`
    );
  }

  return (_app = initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) }, "admin"));
}

export function getAdminDb(): Firestore {
  if (!_db) _db = getFirestore(getAdminApp());
  return _db;
}
