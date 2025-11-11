const estado = document.getElementById("estado");
const emailForm = document.getElementById("emailForm");
const mfaForm = document.getElementById("mfaForm");
const emailInput = document.getElementById("email");
const codigoInput = document.getElementById("codigo");

// Inicializa EmailJS
emailjs.init("MVl9HGou9wi9XIn8F");

async function enviarCodigo() {
    const email = emailInput.value.trim();
    if (!email) {
        estado.textContent = "Ingresa un email válido.";
        return;
    }

    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    const expira = Date.now() + 5 * 60 * 1000;

    localStorage.setItem('mfa_codigo', codigo);
    localStorage.setItem('mfa_expira', expira.toString());
    localStorage.setItem('mfa_email', email);

    // SOLO los parámetros ABSOLUTAMENTE necesarios
    const templateParams = {
        to_email: email,
        codigo: codigo
        // NADA MÁS - sin from_name, reply_to, subject, etc.
    };

    try {
        console.log("Enviando email con parámetros mínimos...", templateParams);
        
        const response = await emailjs.send(
            "service_c5g19uh", 
            "template_jk48nof", 
            templateParams
        );
        
        console.log("✅ Email enviado exitosamente:", response);
        estado.innerHTML = '<span style="color: green;">✅ Código enviado. Revisa tu email.</span>';
        emailForm.style.display = "none";
        mfaForm.style.display = "block";
        
    } catch (error) {
        console.error("❌ Error EmailJS:", error);
        
        // MODO DESARROLLO - muestra el código de forma elegante
        estado.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #1E3A5F, #2D5F8B);
                color: white;
                padding: 25px;
                border-radius: 12px;
                text-align: center;
                margin: 20px 0;
                box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            ">
                <div style="font-size: 20px; margin-bottom: 10px;">🔐 Verificación de Seguridad</div>
                <div style="font-size: 42px; font-weight: bold; letter-spacing: 8px; margin: 20px 0; font-family: monospace;">
                    ${codigo}
                </div>
                <div style="background: rgba(255,255,255,0.1); padding: 10px; border-radius: 8px; margin: 15px 0;">
                    <strong>Para:</strong> ${email}<br>
                    <strong>Expira:</strong> En 5 minutos
                </div>
                <div style="font-size: 14px; opacity: 0.8;">
                    Ingresa este código en el siguiente campo
                </div>
            </div>
        `;
        
        emailForm.style.display = "none";
        mfaForm.style.display = "block";
    }
}

function verificarCodigo() {
    const codigoIngresado = codigoInput.value.trim();
    const codigoGuardado = localStorage.getItem('mfa_codigo');
    const expira = parseInt(localStorage.getItem('mfa_expira'));

    if (!codigoGuardado || Date.now() > expira) {
        estado.innerHTML = '<span style="color: red;">❌ Código expirado. Reenvía uno nuevo.</span>';
        return;
    }

    if (codigoIngresado === codigoGuardado) {
        localStorage.removeItem('mfa_codigo');
        localStorage.removeItem('mfa_expira');
        localStorage.removeItem('mfa_email');
        localStorage.setItem('logged_in', 'true');
        
        estado.innerHTML = '<span style="color: green;">✅ Verificación exitosa. Redirigiendo...</span>';
        setTimeout(() => window.location.href = "inicio.html", 1000);
    } else {
        estado.innerHTML = '<span style="color: red;">❌ Código incorrecto. Intenta de nuevo.</span>';
    }
}

// Event listeners
emailForm.onsubmit = (e) => {
    e.preventDefault();
    enviarCodigo();
};

mfaForm.onsubmit = (e) => {
    e.preventDefault();
    verificarCodigo();
};

document.getElementById("reenviar").onclick = () => {
    enviarCodigo();
};

// Inicia MFA
(function iniciarMFA() {
    console.log("Iniciando MFA...");
    
    if (!localStorage.getItem('logged_in')) {
        estado.textContent = "No estás logueado. Redirigiendo...";
        setTimeout(() => window.location.href = "login.html", 2000);
        return;
    }

    // Limpia datos antiguos
    localStorage.removeItem('mfa_codigo');
    localStorage.removeItem('mfa_expira');
    localStorage.removeItem('mfa_email');

    // Obtén el email del usuario
    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
    if (!usuarioActivo || !usuarioActivo.correo) {
        estado.textContent = "Preparando verificación...";
        emailForm.style.display = "block";
        mfaForm.style.display = "none";
        return;
    }

    const emailGuardado = usuarioActivo.correo;
    console.log("Email del usuario:", emailGuardado);

    // Auto-rellena y envía
    emailInput.value = emailGuardado;
    enviarCodigo();
})();