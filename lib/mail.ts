import nodemailer from 'nodemailer'

var transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "3d8dbda0ebfb4b",
    pass: "05d4c6eba2b55e"
  }
});

export async function sendMail({
    to,
    subject,
    html,
}: {
    to: string;
    subject: string;
    html: string;
}) {
    return transport.sendMail({
        from: `Rikhye <deepak@gmail.com>`,
        to,
        subject,
        html,
    });
}