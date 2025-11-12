import { auth, db } from "./firebase-config.js";
import { doc, updateDoc } 
  from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

const quiz = document.getElementById('quiz');
const gradeBtn = document.getElementById('gradeBtn');     // ← ahora existe en el HTML
const showKeyBtn = document.getElementById('showKeyBtn');  // puede no existir; se valida abajo
const scoreEl = document.getElementById('score');
const feedback = document.getElementById('feedback');

function grade(){
  const total = 35;
  let score = 0;

  const cards = quiz.querySelectorAll('.card');
  cards.forEach((card, idx) => {
    // limpiar estilos previos
    card.querySelectorAll('.opt').forEach(l => l.classList.remove('correct','wrong'));
    const name = 'q' + (idx+1);
    const checked = quiz.querySelector('input[name="'+name+'"]:checked');

    if (checked) {
      const isCorrect = checked.value === '1';
      if (isCorrect) score++;

      // marcar el seleccionado
      const label = checked.closest('label');
      label.classList.add(isCorrect ? 'correct' : 'wrong');

      // mostrar también cuál era la correcta
      const inputs = card.querySelectorAll('input[type="radio"]');
      inputs.forEach(i => { if(i.value === '1'){ i.closest('label').classList.add('correct'); } });
    }
  });

  scoreEl.textContent = `Puntaje: ${score} / ${total}`;
  feedback.style.display = 'block';
  const pct = Math.round((score/total)*100);
  const msg = pct>=90? '¡Excelente!' : pct>=70? '¡Bien hecho!' : pct>=50? 'Vamos por buen camino.' : "Repasemos de nuevo.";
  feedback.innerHTML = `<strong>Resultado:</strong> ${pct}% — ${msg}`;

  // botones/visibilidad
  if (showKeyBtn) showKeyBtn.style.display = "none";
  document.getElementById("botoncito").style.display = "block";

  // guardar progreso en Firestore (si hay usuario)
  importarProgreso(pct).catch(err => console.error(err));
}

function showKey(){
  // Resalta la opción correcta de cada pregunta
  const cards = quiz.querySelectorAll('.card');
  cards.forEach((card) => {
    card.querySelectorAll('.opt').forEach(l => l.classList.remove('wrong','correct'));
    const inputs = card.querySelectorAll('input[type="radio"]');
    inputs.forEach(i => { if(i.value==='1'){ i.closest('label').classList.add('correct'); } });
  });
}

async function importarProgreso(pct) {
  const user = auth.currentUser;
  if (!user) {
    console.warn("⚠️ No hay usuario logueado, no se puede guardar progreso.");
    return;
  }
  const ref = doc(db, "perfiles", user.uid);
  await updateDoc(ref, { progreso: pct });
  console.log("Progreso guardado correctamente:", pct);
}

// Listeners seguros
if (gradeBtn) {
  gradeBtn.addEventListener('click', (e) => { e.preventDefault(); grade(); });
}
if (showKeyBtn) {
  showKeyBtn.addEventListener('click', (e) => { e.preventDefault(); showKey(); });
}
