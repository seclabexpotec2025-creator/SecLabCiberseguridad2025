// === Explorador estilo Windows ===
// Selección, doble clic y OCULTADO PERSISTENTE usando SOLO `value`

// ---- Helpers para persistir ocultos ----
function getOcultos() {
  const raw = localStorage.getItem("archivosOcultos");
  return new Set((raw ? raw.split(",") : []).filter(Boolean));
}
function saveOcultos(set) {
  localStorage.setItem("archivosOcultos", Array.from(set).join(","));
}
function aplicarOcultos() {
  const ocultos = getOcultos();
  document.querySelectorAll(".Arch").forEach((tr) => {
    const v = tr.getAttribute("value");
    tr.style.display = v && ocultos.has(v) ? "none" : "";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // 1) Aplicar ocultos guardados
  aplicarOcultos();

  // 2) Delegación global: selección
  document.addEventListener("click", (event) => {
    const fila = event.target.closest(".Arch");
    if (!fila || fila.style.display === "none") return;

    const anterior = document.getElementById("seleccionado");
    if (anterior && anterior !== fila) anterior.removeAttribute("id");

    fila.id = "seleccionado";
  });

  // 3) Doble clic: abrir data-href
  document.addEventListener("dblclick", (event) => {
    const fila = event.target.closest(".Arch");
    if (!fila || fila.style.display === "none") return;

    const destino = fila.dataset.href;
    if (destino && destino.trim() !== "") {
      window.location.href = destino;
    } else {
      console.warn("⚠️ Esta fila no tiene destino (data-href vacío).");
    }
  });
});

// Navegación (igual que lo tenías)
function volver() { window.location.href = "Archivos-actividad3.html"; }
function volver1() { window.location.href = "inicio.html"; }

// === Acción: si el seleccionado NO es value="1", se oculta y queda oculto entre páginas ===
function selección() {
  const seleccionado = document.getElementById("seleccionado");
  if (!seleccionado) return;

  const valor = seleccionado.getAttribute("value"); // puede ser null
  if (valor === "1") {
    window.location.href = "documento23.html";
    return;
  }

  alert("Eliminaste un archivo seguro, tengamos más cuidado la próxima.");

  // Ocultar ya
  seleccionado.style.display = "none";
  seleccionado.removeAttribute("id");

  // Persistir oculto SOLO si tiene value definido
  if (valor) {
    const ocultos = getOcultos();
    ocultos.add(valor);
    saveOcultos(ocultos);
  }
}

// (Opcional) Utilidad rápida para "resetear" los ocultos desde consola: 
// localStorage.removeItem("archivosOcultos");

function restaurar() {
  // Borrar la lista de archivos ocultos guardados
  localStorage.removeItem("archivosOcultos");
  alert("Archivos restaurados correctamente.");
  location.reload(); // recargar para aplicar
}

    const slides = document.querySelector('.carousel-slides');
    const slideItems = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsContainer = document.querySelector('.carousel-dots');
    let index = 0;

    function renderDots(){
      dotsContainer.innerHTML = '';
      slideItems.forEach((_, i)=>{
        const d = document.createElement('span');
        d.className = 'dot' + (i===index?' active':'');
        d.addEventListener('click', ()=> goTo(i));
        dotsContainer.appendChild(d);
      });
    }
    function updateCarousel(){
      slides.style.transform = `translateX(-${index*100}%)`;
      renderDots();
    }
    function goTo(i){ index = (i + slideItems.length) % slideItems.length; updateCarousel(); }
    prevBtn.addEventListener('click', ()=> goTo(index-1));
    nextBtn.addEventListener('click', ()=> goTo(index+1));
    renderDots();
    setInterval(()=> goTo(index+1), 7000);
    /* Animaciones scroll */
    const observer = new IntersectionObserver((entries)=>entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('show'); }),{threshold:.1});
    document.querySelectorAll('.hidden').forEach(el=>observer.observe(el));

    /* Funciones de acordeón (una abierta por grupo) */
    function setExpanded(btn, open){
      btn.setAttribute('aria-expanded', String(open));
      const card = btn.closest('.exp-card');
      card.classList.toggle('open', open);
      const wrap = card.querySelector('.exp-content-wrapper');
      if(open){
        const h = card.querySelector('.exp-content').scrollHeight + 16;
        wrap.style.height = h + 'px';
      } else {
        wrap.style.height = '0px';
      }
    }

    document.querySelectorAll('.accordion-group').forEach(group=>{
      const cards = group.querySelectorAll('.exp-card');
      cards.forEach(card=>{
        const btn = card.querySelector('.exp-header');
        const wrap = card.querySelector('.exp-content-wrapper');
        wrap.style.height = '0px';

        // Click abre y cierra, y cierra las demás del mismo grupo
        btn.addEventListener('click', ()=>{
          const isOpen = btn.getAttribute('aria-expanded') === 'true';
          // Cerrar todas en el grupo
          group.querySelectorAll('.exp-card .exp-header[aria-expanded="true"]').forEach(openBtn=>{
            if(openBtn !== btn) setExpanded(openBtn, false);
          });
          // Toggle actual
          setExpanded(btn, !isOpen);
        });

        // Accesibilidad teclado
        btn.setAttribute('role','button');
        btn.setAttribute('tabindex','0');
        btn.addEventListener('keydown', (ev)=>{
          if(ev.key === 'Enter' || ev.key === ' '){
            ev.preventDefault(); btn.click();
          }
        });

        // Ajusta la altura si está abierta al redimensionar
        window.addEventListener('resize', ()=>{
          if(btn.getAttribute('aria-expanded') === 'true'){
            const content = card.querySelector('.exp-content');
            wrap.style.height = (content.scrollHeight + 16) + 'px';
          }
        });
      });

    });

