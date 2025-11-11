// JS/login.js
import { auth, db } from "./firebase-config.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { collection, getDocs, query, where, limit, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

const form = document.getElementById('loginForm');
const msg  = document.getElementById('mensaje');
let inFlight = false; // evita envíos dobles

async function resolverCorreo(entrada){
  // Si el usuario escribió un correo, úsalo directo
  if (entrada.includes("@")) return entrada;

  // Si escribió "usuario", busco su correo en Firestore (colección perfiles)
  const q = query(
    collection(db, "perfiles"),
    where("usuario", "==", entrada),
    limit(1)
  );
  const snap = await getDocs(q);
  if (snap.empty) throw new Error("USUARIO_NO_ENCONTRADO");
  return snap.docs[0].data().correo;
}

form.addEventListener('submit', async (e)=>{
  e.preventDefault();
  if (inFlight) return;
  inFlight = true;
  msg.style.display = "none";

  const entrada = document.getElementById('usuario').value.trim();
  const clave   = document.getElementById('clave').value.trim();

  try {
    const correo = await resolverCorreo(entrada);

    // 👇 GUARDA AQUÍ las credenciales para mfa.html
    sessionStorage.setItem("pendingEmail", correo);
    sessionStorage.setItem("pendingPass",  clave);

    const cred   = await signInWithEmailAndPassword(auth, correo, clave);
    const user   = cred.user;

    // trae perfil y cachea
    const perfilSnap = await getDoc(doc(db, "perfiles", user.uid));
    const perfil = perfilSnap.exists() ? perfilSnap.data() : {};
    localStorage.setItem("usuarioActivo", JSON.stringify({
      uid: user.uid,
      correo: user.email,
      nombre: perfil.nombre ?? user.displayName ?? "",
      usuario: perfil.usuario ?? entrada
    }));

    // Después de signInWithEmailAndPassword y guardar perfil...
localStorage.setItem("usuarioActivo", JSON.stringify({
  uid: user.uid,
  correo: user.email,
  nombre: perfil.nombre ?? user.displayName ?? "",
  usuario: perfil.usuario ?? entrada
}));
localStorage.setItem('logged_in', 'true');  // <-- Agrega esta línea
window.location.href = "mfa.html";

    // 👇 SIEMPRE manda a mfa.html
    window.location.href = "mfa.html";
  } catch (err) {
    if (err.message === "USUARIO_NO_ENCONTRADO") {
      msg.textContent = "⚠️ Usuario no encontrado. Prueba con tu correo.";
    } else if (err.code === "auth/multi-factor-auth-required") {
      // también guarda por si falló antes
      const correo = await resolverCorreo(entrada).catch(()=>null);
      if (correo) {
        sessionStorage.setItem("pendingEmail", correo);
        sessionStorage.setItem("pendingPass",  clave);
      }
      window.location.href = "mfa.html";
      return;
    } else {
      msg.textContent = "⚠️ Usuario o contraseña incorrectos.";
    }
    msg.className = "mensaje error";
    msg.style.display = "block";
  } finally {
    inFlight = false;
  }
});

