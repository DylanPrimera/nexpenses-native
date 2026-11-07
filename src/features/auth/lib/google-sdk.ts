import { env } from "@/core/config/env";
import {
  GoogleOneTapSignIn,
  isCancelledResponse,
  isNoSavedCredentialFoundResponse,
  isSuccessResponse,
} from "react-native-nitro-google-signin";
import { classifyGoogleError, GoogleSignInFailure } from "./google-errors";

let configured = false;

function configureGoogle() {
  if (configured) return;
  const { googleWebClientId, googleIosClientId } = env;
  if (!googleWebClientId) throw new GoogleSignInFailure("config");
  GoogleOneTapSignIn.configure({
    webClientId: googleWebClientId,
    iosClientId: googleIosClientId ?? null,
    autoSelectOnSignIn: false,
  });
  configured = true;
}

async function runSignInFlow() {
  await GoogleOneTapSignIn.checkPlayServices();
  const response = await GoogleOneTapSignIn.createAccount();
  if (isNoSavedCredentialFoundResponse(response)) {
    return GoogleOneTapSignIn.presentExplicitSignIn();
  }
  return response;
}

export async function requestGoogleIdToken(): Promise<string | null> {
  try {
    configureGoogle();
    const response = await runSignInFlow();
    if (isCancelledResponse(response)) return null;
    if (!isSuccessResponse(response)) throw new GoogleSignInFailure("no_token");
    const idToken = response.data.idToken?.trim();
    if (!idToken) throw new GoogleSignInFailure("no_token");
    return idToken;
  } catch (error) {
    const reason = classifyGoogleError(error);
    if (reason === "cancelled") return null;
    throw error instanceof GoogleSignInFailure ? error : new GoogleSignInFailure(reason);
  }
}

export async function signOutGoogle(): Promise<void> {
  try {
    configureGoogle();
    await GoogleOneTapSignIn.signOut();
  } catch {
    return;
  }
}
