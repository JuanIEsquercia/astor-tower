import { getAuth, type Auth } from "firebase-admin/auth";
import { getAdminApp } from "./firebase-admin";

let _auth: Auth | null = null;

export function getAdminAuth(): Auth {
  if (!_auth) _auth = getAuth(getAdminApp());
  return _auth;
}
