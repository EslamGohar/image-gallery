const nodemailer = require("nodemailer")

const smtpConfig = {
    service: 'yahoo',
    auth:{
        user:"islamgoher1@yahoo.com",
        pass:"islamgoher"
    }
}

const sendEmailCustom = (receiver, emailTxt, subject) =>{
    try{
        const transporater = nodemailer.createTransport(smtpConfig)
        let emailOptions =             {
            from: "My Application",
            to: receiver,
            subject: subject,
            html: emailTxt
        }
        transporater.sendMail(emailOptions)
    }
    catch(e){
        console.log(e)
    }
}
module.exports = sendEmailCustom