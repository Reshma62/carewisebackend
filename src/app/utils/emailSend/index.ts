import nodemailer from "nodemailer";
import AppError from "../../modules/errors/AppError";
import httpStatus from "http-status";
import config from "../../config";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async ({ to, subject, html }: EmailOptions) => {
  console.log(to);
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.node_mailer_email,
        pass: config.node_mailer_pass,
      },
    });

    const mailOptions = {
      from: config.node_mailer_email,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    return { success: true, message: "Email sent successfully" };
  } catch (error: any) {
    console.log(error);
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to send email"
    );
  }
};
