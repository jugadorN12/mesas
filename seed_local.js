// Script para inicializar usuarios en Auth y Firestore en el emulador local
const AUTH_EMULATOR_URL = "http://127.0.0.1:9099";
const FIRESTORE_EMULATOR_URL = "http://127.0.0.1:8085";
const PROJECT_ID = "mesas-cubano-bar";

async function createAuthUser(email, password) {
  try {
    const res = await fetch(`${AUTH_EMULATOR_URL}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=fake-api-key`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true
      })
    });
    const data = await res.json();
    if (!res.ok) {
      if (data?.error?.message === 'EMAIL_EXISTS') {
        console.log(`[AUTH] El usuario ${email} ya existe en el emulador.`);
        return;
      }
      throw new Error(`Error en Auth: ${JSON.stringify(data)}`);
    }
    console.log(`[AUTH] Creado con éxito: ${email}`);
  } catch (err) {
    console.error(`[AUTH] Error con ${email}:`, err.message);
  }
}

async function setFirestoreUserRole(email, role) {
  try {
    const url = `${FIRESTORE_EMULATOR_URL}/v1/projects/${PROJECT_ID}/databases/(default)/documents/users/${encodeURIComponent(email)}`;
    const res = await fetch(url, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer owner'
      },
      body: JSON.stringify({
        fields: {
          role: { stringValue: role }
        }
      })
    });
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Error en Firestore (${res.status}): ${txt}`);
    }
    console.log(`[FIRESTORE] Rol '${role}' asignado a: ${email}`);
  } catch (err) {
    console.error(`[FIRESTORE] Error con ${email}:`, err.message);
  }
}

async function main() {
  console.log("Inicializando datos locales de prueba en el emulador...");
  
  // 1. Crear usuario admin principal en Auth
  await createAuthUser("gncesso@gmail.com", "123456");

  // 2. Asignar roles en Firestore
  await setFirestoreUserRole("gncesso@gmail.com", "admin");
  await setFirestoreUserRole("moyanojl.1984@gmail.com", "admin");
  await setFirestoreUserRole("alinnebogado94@gmail.com", "assistant");
  await setFirestoreUserRole("boleteria.cubano@gmail.com", "boleteria");

  console.log("\n Listo! Ya podés ingresar en http://localhost:5000/admin.html con:");
  console.log(" Email: gncesso@gmail.com");
  console.log(" Contraseña: 123456\n");
}

main();
