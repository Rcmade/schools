import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendMail(mailOptions: {
  subject: string;
  toEmail: string;
  html: string;
}): Promise<boolean> {
  return new Promise((resolve, reject) => {
    transporter.sendMail(
      { ...mailOptions, to: mailOptions.toEmail, from: process.env.EMAIL_FROM },
      (error: unknown) => {
        if (error) {
          // console.log("Email Send Error ", error);
          reject(new Error("Email sending failed"));
        } else {
          resolve(true);
        }
      }
    );
  });
}

export default transporter;
