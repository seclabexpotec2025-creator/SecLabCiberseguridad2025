let a=2,s=0;

function verde0(){
      a=a+1;
  document.getElementById('correoe1').style.display='block'
    document.getElementById('correo1').style.display='none'

}
function verde2(){
  document.getElementById('correo2').style.backgroundColor = 'green';
    document.getElementById('correoe2').style.display='block'
    document.getElementById('correo2').style.display='none'
    a=a+1;
}
function verde3(){
  document.getElementById('correo4').style.backgroundColor = 'green';
    document.getElementById('correoe4').style.display='block'
    document.getElementById('correo4').style.display='none'
    a=a+1;
}
function verde4(){
  document.getElementById('correo6').style.backgroundColor = 'green';
    document.getElementById('correoe6').style.display='block'
    document.getElementById('correo6').style.display='none'
    a=a+1;
}
function rojo(){
  document.getElementById('correo3').style.backgroundColor = 'red';
    document.getElementById('correoe3').style.display='block'
    document.getElementById('correo3').style.display='none'
    alert("Ha ingresado un virus")
      a=a-1;
}
function rojo2(){
  document.getElementById('correo5').style.backgroundColor = 'red';
    document.getElementById('correoe5').style.display='block'
    document.getElementById('correo5').style.display='none'
  alert("Ha ingresado un virus")
      a=a-1;
}

function veres(){
        const bott= document.getElementById("tick")
        bott.style.display="none"
        const bot= document.getElementById("tick2")
        bot.style.display="flex"
        const resultado = document.getElementById("ni");
        resultado.textContent="Su puntaje es de "+a+"/6";
}

