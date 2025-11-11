let contra = document.getElementById("nombre");

  contra.addEventListener('keydown', function(event) {
    // Verificamos si la tecla presionada es Enter (código 'Enter')
    if (event.key === 'Enter') {
      revisar();
    }
  });

function revisar(){
    let contra = document.getElementById("nombre").value,
    pad=document.getElementById("hero-text");
    pad.style.padding="15px"
    mayusculas(contra);
    corto(contra);
    repetir(contra);
    contieneEspeciales(contra);
    numero(contra);
    letras(contra);
    vacio(contra);

}

function mayusculas(contra){
    let a=0;
    for (let i = 0; i < contra.length; i++){
       if(contra[i].toLowerCase() !== contra[i].toUpperCase() && contra[i] === contra[i].toUpperCase()){
            a=a+1;
        }
    }
    let mensaje=document.getElementById("falma");
    if (a===0){
        mensaje.innerHTML="No hay mayusculas";
    }
    else{
        mensaje.innerHTML="";
    }
}
function corto(contra){
    let mensaje=document.getElementById("falle");
    if (contra.length<8){
        mensaje.innerHTML="Muy corto";
    }
    else{
        mensaje.innerHTML="";
    }

}
function repetir(contra){
    let a=0;
    for (let i = 0; i < contra.length -1; i++){
        if (contra[i]=== contra[i+1]){
            a=a+1;
        }
    }
    let mensaje=document.getElementById("repe");
    if (a===0){
        mensaje.innerHTML="";
    }
    else{
        mensaje.innerHTML="No se permiten 2 caracteres iguales seguidos";
    }
}

function contieneEspeciales(contra) {
    let especiales = /[!@#$%^&*()_\-+=\[\]{};:'",.<>\/?\\|`~]/;

    let mensaje = document.getElementById("especiales");

    if (!especiales.test(contra)) {
        mensaje.innerHTML = "Debe incluir al menos un carácter especial";
    } else {
        mensaje.innerHTML = "";
    }
}

function numero(contra) {
    let mensaje = document.getElementById("num");

    if (!/\d/.test(contra)) {
        mensaje.innerHTML = "No hay números";
    } else {
        mensaje.innerHTML = "";
    }
}




function letras(contra) {
    let a = 0;
    for (let i = 0; i < contra.length; i++) {
        if (contra[i].toLowerCase() !== contra[i].toUpperCase()) {
            a++;
        }
    }
    let mensaje = document.getElementById("letra");
    if (a === 0) {
        mensaje.innerHTML = "No hay letras";
    } else {
        mensaje.innerHTML = "";
    }
}

function vacio(contra){
  const div = document.getElementById("hero-text");
  const parrafos = div.querySelectorAll("p:not(#main)");
  const todosVacios = Array.from(parrafos).every(p => p.textContent.trim() === "");
  let espacio=document.getElementById("main");
    if (todosVacios) {
    espacio.innerHTML="Tu contraseña cumple con todas las condiciones";
    
  } else {
    espacio.innerHTML="Tu contraseña no cumple con las siguientes condiciones: ";

  }
}

