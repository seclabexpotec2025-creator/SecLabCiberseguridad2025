// === JS/Registro.js (limpio) ===
import { auth, db } from "./firebase-config.js";
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification }
  from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { doc, setDoc, serverTimestamp }
  from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

/** Valida/normaliza teléfono en formato internacional muy básico */
function normalizarYValidarTelefono(raw) {
  if (!raw) return null;
  const t = raw.trim();
  const ok = /^\+?[0-9]{7,15}$/.test(t); // 7–15 dígitos, "+" opcional
  return ok ? (t.startsWith("+") ? t : `+${t}`) : null;
}

// Llama a esta función desde el <form onsubmit="formulario(event)">
export async function formulario(event) {
  event.preventDefault();

  const usuario  = document.getElementById("Usuario").value.trim();
  const clave    = document.getElementById("Contra").value.trim();
  const nombre   = document.getElementById("nombre").value.trim();
  const correo   = document.getElementById("Correo").value.trim();
  const telRaw   = (document.getElementById("Telefono")?.value || "").trim();

  const telefono = normalizarYValidarTelefono(telRaw);
  if (!telefono) {
    alert("⚠️ Teléfono inválido. Usa el formato con código de país, p. ej. +50688887777.");
    return;
  }

  try {
    // 1) Crear cuenta y set displayName
    const cred = await createUserWithEmailAndPassword(auth, correo, clave);
    await updateProfile(cred.user, { displayName: nombre });

    // 2) Enviar verificación (con URL pública válida de tu sitio)
    const actionCodeSettings = {
      url: "https://seclabexpotec2025-creator.github.io/SecLab-/login.html",
      handleCodeInApp: false,
    };
  await sendEmailVerification(cred.user, {
  url: "http://127.0.0.1:5500/login.html",
  handleCodeInApp: false,
});

    alert("📧 Te enviamos un correo de verificación. Revisa tu bandeja y SPAM.");

    // 3) Guardar perfil
    await setDoc(doc(db, "perfiles", cred.user.uid), {
      uid: cred.user.uid,
      usuario, nombre, correo, telefono,
      progreso: 0,
      creado: serverTimestamp()
    });

    // 4) Redirigir a login
    window.location.href = "login.html";
  } catch (err) {
    alert("⚠️ Error al registrar: " + (err.message || err.code));
  }
}

window.formulario = formulario;
