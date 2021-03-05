import nodemailer, { Transporter } from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs';

class SendMailService {
  private client: Transporter
  constructor() {
    const transporter = nodemailer.createTransport({
      host: 'smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: '--',
        pass: '--'
      }
    });

    this.client = transporter;
  }

  async execute(to: string, subject: string, variables: object, path: string) {

    const templateFileContent = fs.readFileSync(path).toString('utf8');

    const mailTemplateParse = handlebars.compile(templateFileContent);
    const html = mailTemplateParse(variables)

    const message = await this.client.sendMail({
      to,
      subject,
      html,
      from: "NPS <noreplay@nps.com.br>"
    })

    console.log('Message sent: %s', message.messageId);
  }
}

export default new SendMailService();
