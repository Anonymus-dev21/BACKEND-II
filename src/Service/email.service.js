
import { transporter } from "../config/mailingTransporter.config.js";
export class MailService {
    async sendEmail(to, subject, html) {
        try {
            const info = await transporter.sendMail({
              from: process.env.SMTP_USER,
              to,
              subject,
              html
            });
            console.log("Email sent:", info.messageId, info.accepted);
            return info;
          } catch (err) {
            console.error("Error sending email:", err);
            throw err;
          }
    }

    static async sendPurchaseReceipt(email, code, amount, date) {
        try{
        const html = `
      <h1>Gracias por tu compra</h1>
      <p>Tu código de ticket es: <b>${code}</b></p>
      <p>Fecha: ${date.toLocaleString()}</p>
      <p>Total abonado: $${amount}</p>
      <hr/>
      <p>¡Esperamos verte pronto!</p>
    `;
    const mailSvc = new MailService();
    return mailSvc.sendEmail(
      email,
      "Recibo de compra",
      html
    );
    } catch (err) {
      console.error("Error sending email:", err);
      throw err;
    }
    }
}
