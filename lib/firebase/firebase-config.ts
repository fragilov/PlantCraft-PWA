/**
 * Firebase Configuration — Lazy & Safe
 * App builds fine even if firebase package is NOT installed.
 * Firebase only activates when NEXT_PUBLIC_FIREBASE_API_KEY is set AND firebase package exists.
 */

export async function getFirebaseDB() {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY
  if (!apiKey) return null

  try {
    const [{ initializeApp, getApps }, { getDatabase }] = await Promise.all([
      import('firebase/app' as string) as Promise<typeof import('firebase/app')>,
      import('firebase/database' as string) as Promise<typeof import('firebase/database')>,
    ])

    const config = {
      apiKey,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    }

    const app = getApps().length ? getApps()[0] : initializeApp(config)
    return getDatabase(app)
  } catch {
    // firebase package not installed yet
    return null
  }
}
