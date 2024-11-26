import { createTransport } from "nodemailer";

const transporter = createTransport({
    service: "Gmail", // Use your email service (Gmail, Outlook, etc.)
    auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your email password or app-specific password
    },
});

const sendEmail = async (to, subject, text) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully to", to);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

export default sendEmail;