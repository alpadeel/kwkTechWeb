const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
var nodemailer = require('nodemailer');
require("dotenv").config();

// body parser middleware
app.use(express.json());
app.use(express.urlencoded( { extended: false } )); // this is to handle URL encoded data
app.set('views', './views');
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

// index page
app.get('/', function(req, res) {
  res.render('index.ejs');
});
app.post("/ajax/email", function(request, response) {
    // create reusable transporter object using the default SMTP transport
      const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
             // this should be YOUR GMAIL account
              user: process.env.EMAIL,
              pass: process.env.PASSWORD
          }
      });
  
      var textBody = `FROM: ${request.body.name} EMAIL: ${request.body.email} MESSAGE: ${request.body.message}`;
      var htmlBody = `<h2>Mail From Contact Form</h2><p>from: ${request.body.name} <a href="mailto:${request.body.email}">${request.body.email}</a></p><p>${request.body.message}</p>`;
      var mail = {
          from: "your_account@gmail.com", // sender address
          to: "your_account@gmail.com", // list of receivers (THIS COULD BE A DIFFERENT ADDRESS or ADDRESSES SEPARATED BY COMMAS)
          subject: "Mail From Contact Form", // Subject line
          text: textBody,
          html: htmlBody
      };
  
      // send mail with defined transport object
      transporter.sendMail(mail, function (err, info) {
          if(err) {
              console.log(err);
              response.json({ message: "message not sent: an error occured; check the server's console log" });
          }
          else {
              response.json({ message: `message sent: ${info.messageId}` });
          }
      });
  });



app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));