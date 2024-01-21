import hbs from'nodemailer-express-handlebars';
import nodemailer from 'nodemailer';
import path from 'path';

import { getEnvironmentVariables } from '../environments/enviroment';

// initialize nodemailer
var transporter = nodemailer.createTransport(
    {
        service: 'gmail',
        auth:{
            user: getEnvironmentVariables().appEmail,
            pass: getEnvironmentVariables().appPassword
        }
    }
);

// point to the template folder
const handlebarOptions = {
    viewEngine: {
        partialsDir: path.resolve('./src/views/'),
        defaultLayout: false,
    },
    viewPath: path.resolve('./src/views/'),
};

// use a template file with nodemailer
transporter.use('compile', hbs(handlebarOptions))

export const sendMail = async (receiver): Promise<string | Error> => {
  if (receiver.email) {

    const mailOptions = {
      from: '"FoodJet" <my@company.com>', // sender address
      template: "email", // the name of the template file, i.e., email.handlebars
      to: receiver.email,
      subject: `Welcome to FoodJet, ${receiver.name}`,
      context: {
        name: receiver.name,
        company: 'FoodJet',
        verification_token: receiver.verification_token,
        main_content: receiver.main_content
      },
    };
    try {
      await transporter.sendMail(mailOptions);
      return `Email successfully sent to ${receiver.email}`;
    } catch (error) {
      console.log("error");
      return new Error(`Nodemailer error sending email to ${receiver.email}`);
    }
  }
  else{
      return new Error('Receiver email is undefined');
  }

};



