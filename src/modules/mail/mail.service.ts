import { Injectable, Logger } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly mailerService: MailerService) {}

  async sendOtpEmail(email: string, otpCode: string): Promise<boolean> {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: "Tasdiqlash kodi - Visit Uzbekistan",
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
            <h2 style="color: #333;">Salom!</h2>
            <p>Sizning tasdiqlash kodingiz:</p>
            <h1 style="color: #007bff; letter-spacing: 5px;">${otpCode}</h1>
            <p style="color: #666; font-size: 12px;">Ushbu kod 5 daqiqa davomida amal qiladi.</p>
          </div>
        `,
      });
      return true;
    } catch (error) {
      this.logger.error(`Email yuborishda xatolik (${email}): ${error.message}`);
      return false;
    }
  }

  async sendWelcome(email: string, name: string): Promise<boolean> {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: "Visit Uzbekistan ga xush kelibsiz!",
        html: `
          <div style="font-family: sans-serif; padding: 20px;">
            <h2>Salom, ${name}!</h2>
            <p>Visit Uzbekistan ga xush kelibsiz.</p>
          </div>
        `,
      });
      return true;
    } catch (error) {
      this.logger.error(`Welcome email xatolik (${email}): ${error.message}`);
      return false;
    }
  }

  async sendBookingConfirmed(
    email: string,
    data: {
      name: string;
      propertyName: string;
      checkIn: string;
      checkOut: string;
      totalPrice: number;
    },
  ): Promise<boolean> {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: "Bronlash tasdiqlandi",
        html: `
          <div style="font-family: sans-serif; padding: 20px;">
            <h2>Bronlash tasdiqlandi</h2>
            <p>Salom, ${data.name}!</p>
            <p><strong>${data.propertyName}</strong> muvaffaqiyatli bron qilindi.</p>
            <p>Kirish: ${data.checkIn}</p>
            <p>Chiqish: ${data.checkOut}</p>
            <p>Jami: $${data.totalPrice}</p>
          </div>
        `,
      });
      return true;
    } catch (error) {
      this.logger.error(`Booking email xatolik (${email}): ${error.message}`);
      return false;
    }
  }

  async sendPasswordReset(email: string, resetUrl: string): Promise<boolean> {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: "Parolni tiklash",
        html: `
          <div style="font-family: sans-serif; padding: 20px;">
            <h2>Parolni tiklash</h2>
            <p>Parolingizni tiklash uchun quyidagi tugmani bosing:</p>
            <a href="${resetUrl}" style="background:#007bff;color:#fff;padding:10px 20px;border-radius:4px;text-decoration:none;">
              Parolni tiklash
            </a>
            <p style="color:#666;font-size:12px;">Agar siz so'rov yubormagan bo'lsangiz, e'tiborsiz qoldiring.</p>
          </div>
        `,
      });
      return true;
    } catch (error) {
      this.logger.error(`Reset email xatolik (${email}): ${error.message}`);
      return false;
    }
  }
}