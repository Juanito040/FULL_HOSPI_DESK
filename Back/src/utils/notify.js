const nodemailer = require('nodemailer');
const db = require('../models/sequelize');

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "64ffc89cdff4ce",
    pass: "6dffef119a5b86"
  }
});

async function notifyUserPendingBackup(idUsuario, recurso, periodicidad) {
  try {
    const user = await db.Usuario.findByPk(idUsuario);

    if (!user) {
      console.log("Usuario no encontrado");
      return;
    }

    const mensaje = `
⚠️ NOTIFICACIÓN DE BACKUP PENDIENTE ⚠️
Usuario: ${user.nombres} ${user.apellidos}
Recurso: ${recurso}
Periodicidad: ${periodicidad}
Acción: Realizar backup pendiente ASAP.
`;

    // ENVIAR CORREO
    await transporter.sendMail({
      from: '"Sistema Backups HUSRT" <notificaciones@husrt.com>',
      to: user.email,
      subject: "¡Tienes un backup pendiente!",
      text: mensaje
    });

    console.log("Correo enviado correctamente a:", user.email);

  } catch (error) {
    console.error("Error enviando notificación:", error);
  }
}

module.exports = { notifyUserPendingBackup };
