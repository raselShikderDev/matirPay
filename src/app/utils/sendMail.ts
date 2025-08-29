import path from "path";
import { envVarriables } from "../configs/envVars.config";
import { transporter } from "../configs/nodeMailer";
import myAppError from "../errorHelper";
import { StatusCodes } from "http-status-codes";
import ejs from "ejs";

interface sendEmailOptions {
  to: string;
  subject: string;
  templateName: string;
  templateData?: Record<string, any>;
  attachments?: {
    fileName: string;
    content: Buffer | string;
    contentType: string;
  }[];
}

export const sendMail = async ({
  to,
  subject,
  templateName,
  attachments,
  templateData,
}: sendEmailOptions) => {
  try {
    const filepath = path.join(__dirname, `templates/${templateName}.ejs`);
    const html = await ejs.render(filepath, templateData);

    const info = await transporter.sendMail({
      from: envVarriables.SMTP_FROM as string,
      to,
      subject,
      html: html,
      attachments: attachments?.map((attachment) => ({
        filename: attachment.fileName,
        content: attachment.content,
        contentType: attachment.contentType,
      })),
    });
    console.log(`\u2709\uFE0F Email sent to ${to}: ${info.messageId}`);
  } catch (error: any) {
    console.log("email sending error", error.message);
    throw new myAppError(StatusCodes.BAD_GATEWAY, error.message);
  }
};
