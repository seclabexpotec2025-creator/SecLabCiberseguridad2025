
  import { auth, db } from "./firebase-config.js";
  import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
  import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

  const infoEl = document.getElementById("info");
  const userEl = document.getElementById("user");
  const progEl = document.getElementById("progreso");

  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      infoEl.textContent = "No hay sesión activa.";
      return;
    }

    // 1) Lee lo que ya tengas en localStorage
    const ls = JSON.parse(localStorage.getItem("usuarioActivo")) || {};
    const base = {
      correo: ls.correo ?? user.email ?? "",
      nombre: ls.nombre ?? user.displayName ?? "",
      usuario: ls.usuario ?? "",
      progreso: (ls.progreso ?? null)
    };

    // 2) Completa/actualiza con Firestore
    try {
      const snap = await getDoc(doc(db, "perfiles", user.uid));
      if (snap.exists()) {
        const data = snap.data();
        base.nombre   = base.nombre   || data.nombre || "";
        base.usuario  = base.usuario  || data.usuario || "";
        // si Firestore tiene progreso, úsalo
        if (data.progreso !== undefined && data.progreso !== null) {
          base.progreso = data.progreso;
        }
      }
    } catch (e) {
      console.warn("No se pudo leer perfil de Firestore:", e);
    }

    // 3) Render
    infoEl.innerHTML = `
      <strong>Correo:</strong> ${base.correo}<br>
      <strong>Nombre:</strong> ${base.nombre}<br>
    `;
    userEl.innerHTML = `${base.usuario || "(sin usuario)"}`;

    // IMPORTANTE: no uses if (base.progreso) porque 0 es válido
    if (base.progreso !== undefined && base.progreso !== null) {
      progEl.innerHTML = `${base.progreso}%`;
    } else {
      progEl.textContent = "No hay progreso";
    }

    // 4) Guarda cacheado en localStorage (incluye progreso)
    localStorage.setItem("usuarioActivo", JSON.stringify({
      uid: user.uid,
      correo: base.correo,
      nombre: base.nombre,
      usuario: base.usuario,
      progreso: base.progreso
    }));
  });

  // Cerrar sesión (si ya lo usabas)
  window.cerrarSesion = function () {
    localStorage.removeItem("usuarioActivo");
    window.location.href = "login.html";
  };

