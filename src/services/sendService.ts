import { sendMail } from "@/lib/nodemailer";

class SendService {
  public static async sendRegistrationEmail(
    toEmail: string,
    otp: string | number
  ) {
    const subject = "Email confirmation";
    const html = `<p>Your OTP is: ${otp}</p>`;
    const send = await sendMail({ toEmail, subject, html });
    return send;
  }

  public static async sendLoginEmail(toEmail: string, otp: string | number) {
    const subject = "Email Verification";
    const html = `<p>Your OTP is: ${otp}</p>`;
    const send = await sendMail({ toEmail, subject, html });
    return send;
  }

  // public static async sendResetPasswordEmail(toEmail: string, token: string) {
  //   // const subject = "Reset Your RayAuth Account Password";
  //   // const html = resetPasswordEmail(token, OTP_EXPIRES_TIME_IN_MIN, toEmail);
  //   // const send = await sendMail({ toEmail, subject, html });
  //   // return send;
  // }

  // public static async sendEmailVerificationOtp(toEmail: string, token: string) {
  //   // const subject = "RayAuth: Email confirmation";
  //   // const html = registerUserVerificationTemplate(
  //   //   token,
  //   //   OTP_EXPIRES_TIME_IN_MIN,
  //   //   toEmail
  //   // );
  //   // const send = await sendMail({ toEmail, subject, html });
  //   // return send;
  // }
}

export { SendService };
