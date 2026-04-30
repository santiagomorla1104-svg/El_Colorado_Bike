// Función para enviar mensaje de contacto por WhatsApp
function sendContactMessage(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    
    // Construir el mensaje para WhatsApp
    let whatsappMessage = `*NUEVO MENSAJE DE CONTACTO*\n\n`;
    whatsappMessage += `*Nombre:* ${name}\n`;
    whatsappMessage += `*Teléfono:* ${phone}\n`;
    if (email) {
        whatsappMessage += `*Email:* ${email}\n`;
    }
    whatsappMessage += `*Asunto:* ${subject}\n`;
    whatsappMessage += `*Mensaje:* ${message}`;
    
    // Codificar el mensaje para URL
    const encodedMessage = encodeURIComponent(whatsappMessage);
    
    // Redirigir a WhatsApp
    const whatsappUrl = `https://wa.me/51922039946?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    
    // Limpiar el formulario
    document.getElementById('contactForm').reset();
    
    // Mostrar notificación
    showNotification('¡Mensaje enviado! Se abrirá WhatsApp en tu navegador.');
}

// Función mejorada de notificación (si no existe en script.js)
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background-color: #25D366;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 300;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}
