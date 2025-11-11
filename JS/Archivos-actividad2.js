function selected() {
  const documento = document.querySelector(".docum");
  if (!documento) return;

  // Click: marcar seleccionado
  documento.addEventListener("click", (event) => {
    const fila = event.target.closest(".Arch");
    if (!fila) return;

    const anterior = document.getElementById("seleccionado");
    if (anterior && anterior !== fila) anterior.removeAttribute("id");
    fila.id = "seleccionado";
  });

document.addEventListener("DOMContentLoaded", () => {
  // Escuchar el doble clic en cualquier fila con clase .Arch
  document.addEventListener("dblclick", (event) => {
    const fila = event.target.closest(".Arch");
    if (!fila) return;
    const href = fila.getAttribute("data-href");

    if (href && href.trim() !== "") {
      window.location.href = href;
    } else {
      console.log("Sin destino para esta fila");
    }
  });
});

}

selected();
