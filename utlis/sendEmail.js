const nodeMailer = require("nodemailer")
const sendEmail = async (options) => {
    const tranporter = nodeMailer.createTransport({
        service: process.env.SMPT_SERVICE,
        // host: 'smtp.gmail.com',
        port: 465,
        auth: {
            user: process.env.SMPT_MAIL,
            pass: process.env.SMPT_PASSWORD,
        },
        tls: {
            rejectUnauthorized: false
        }
    })
    const mailoption = {
        from: process.env.SMPT_MAIL,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    tranporter.sendMail(mailoption)
}
module.exports = sendEmail