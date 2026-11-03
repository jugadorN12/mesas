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

async function setFirestoreUserRole(email, role, cliente = null) {
  try {
    const fields = {
      role: { stringValue: role }
    };
    if (cliente) {
      fields.cliente = { stringValue: cliente };
    }
    const url = `${FIRESTORE_EMULATOR_URL}/v1/projects/${PROJECT_ID}/databases/(default)/documents/users/${encodeURIComponent(email)}`;
    const res = await fetch(url, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer owner'
      },
      body: JSON.stringify({ fields })
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

async function setDoc(path, fields) {
  try {
    const url = `${FIRESTORE_EMULATOR_URL}/v1/projects/${PROJECT_ID}/databases/(default)/documents/${path}`;
    const res = await fetch(url, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer owner'
      },
      body: JSON.stringify({ fields })
    });
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Error en Firestore doc ${path} (${res.status}): ${txt}`);
    }
    console.log(`[FIRESTORE] Documento guardado: ${path}`);
  } catch (err) {
    console.error(`[FIRESTORE] Error guardando ${path}:`, err.message);
  }
}

async function main() {
  console.log("Inicializando datos locales de prueba en el emulador...");
  
  // 1. Usuarios principales Cubano
  await createAuthUser("gncesso@gmail.com", "123456");
  await setFirestoreUserRole("gncesso@gmail.com", "admin");
  await setFirestoreUserRole("moyanojl.1984@gmail.com", "admin");
  await setFirestoreUserRole("alinnebogado94@gmail.com", "assistant");
  await setFirestoreUserRole("boleteria.cubano@gmail.com", "boleteria");

  // 2. Usuarios de Joseo
  await createAuthUser("admin@joseo.com", "123456");
  await setFirestoreUserRole("admin@joseo.com", "admin_joseo", "joseo");

  await createAuthUser("asistente@joseo.com", "123456");
  await setFirestoreUserRole("asistente@joseo.com", "assistant_joseo", "joseo");

  await createAuthUser("boleteria@joseo.com", "123456");
  await setFirestoreUserRole("boleteria@joseo.com", "boleteria_joseo", "joseo");

  // 3. Config inicial para Joseo
  await setDoc("config/joseo", {
    eventName: { stringValue: "Joseo Terraza" },
    eventDate: { stringValue: "SÁBADO 15 NOV" },
    logoUrl: { stringValue: "" },
    bgUrl: { stringValue: "" }
  });

  // 4. Reserva de prueba para Joseo (Mesa 1 de terraza)
  await setDoc("reservas_joseo/T-1", {
    nombre: { stringValue: "Lucas Rodríguez" },
    contacto: { stringValue: "11 3456-7890" },
    status: { stringValue: "confirmada" },
    ts: { integerValue: String(Date.now()) },
    sector: { stringValue: "terrace_soul" },
    valorTotal: { integerValue: "100000" },
    montoSena: { integerValue: "40000" },
    saldoPuerta: { integerValue: "60000" },
    vouchersBebida: { integerValue: "4" }
  });

  console.log("\n========================================================");
  console.log("🚀 LISTO PARA PROBAR EN LOCAL:");
  console.log("--------------------------------------------------------");
  console.log("👑 ADMIN CUBANO (SUPERADMIN):");
  console.log("   URL: http://localhost:5000/admin.html");
  console.log("   User: gncesso@gmail.com | Pass: 123456");
  console.log("   (Aquí podés ver la nueva tarjeta 'EVENTO JOSEO')");
  console.log("--------------------------------------------------------");
  console.log("🍸 ADMIN JOSEO (CLIENTE):");
  console.log("   URL: http://localhost:5000/joseo-admin.html");
  console.log("   User: admin@joseo.com | Pass: 123456");
  console.log("--------------------------------------------------------");
  console.log("🎟️ BOLETERÍA JOSEO:");
  console.log("   URL: http://localhost:5000/joseo-boleteria.html");
  console.log("   User: boleteria@joseo.com | Pass: 123456");
  console.log("--------------------------------------------------------");
  console.log("📱 MAPA PÚBLICO JOSEO:");
  console.log("   URL: http://localhost:5000/joseo.html");
  console.log("========================================================\n");
}

main();
