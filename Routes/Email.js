const nodemailer = require('nodemailer');

//send mail function

async function sendEmail(to, subject, name, message, attachments, prevMsg){
    try{
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'devmax2001@gmail.com',
                pass: 'dohmnazrppmiulyg'
            }
        });

        const mailOptions ={
            form: 'myemail',
            to: to,
            subject: subject,
            html: `
                
                <html>
                <head>
                    <style>
                        .container{
                            width: 85%;
                            height: auto;
                            margin: auto;
                            padding: 20px;
                            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                            background-color: rgba(179, 163, 91, 0.237);
                        }
                        .mailheader{
                            display: flex;
                            width: 100%;
                            height: 120px;
                        }
                        .mailheader .comLogo{
                            width: 120px;
                            margin: 5px 10px 0px 0px;
                        }
                        .mailheader img{
                            width: 100%;
                        }
                        .mailheader .company{
                            width: 85%;
                        }
                        .mailheader h2{
                            width: 100%;
                            padding: 5px 0px 5px 0px;
                            border-bottom: 3px rgba(76, 75, 75, 0.833) solid;
                            font-size: 25px;
                        }
                        .message{
                            width: 100%;
                            margin: auto;
                        }
                        .hi{
                            display: flex;
                        }
                        .msg p{
                            font-size:20px;
                        }
                        .hi h3{
                            margin-right: 10px;
                            font-size: 20px;
                        }
                        .msg{
                            text-align: justify;
                        }
                        .prevmsg{
                            text-align: justify;
                        }
                        .prevmsg p{
                            font-size:17px;
                        }
                        .attach{
                            margin-top: 30px;
                            margin-bottom: 20px;
                            display: flex;
                            flex-wrap: wrap;
                            gap: 10px;
                            padding-left: 15px;
                        }
                        .afile{
                            width: 170px;
                            height: 100px;
                            background-color: rgba(160, 163, 163, 0.403);
                            border-radius: 10px;
                        }
                        .foot{
                            background-color: rgb(233, 179, 114);
                            width: 100%;
                            display: flex;
                            font-weight: 600;
                        }
                        .foot .data{
                            margin: auto;
                            display: flex;
                        }
                        .foot p{
                            margin-right: 10px;
                        }

                    </style>
                </head>
                <body>

                    <div class="container">
                        <div class="mailheader">
                            <div class="comLogo">
                                <img src="https://i.ibb.co/0M6GFpZ/wb.png" />
                            </div>
                            <div class='company'>
                                <h2>Wasana Bakers pvt Ltd</h2>
                            </div>
                        </div>

                        <div class="message">
                            <div class="hi">
                                <h3>Hi </h3>
                                <h3> ${name},</h3>
                            </div>

                            <div class="msg">
                                <p>${message}</p>
                            </div>

                            <div class="thank">
                                <h3>Thank You.</h3>
                            </div>
                            <hr>

                            
                            <div class="prevmsg">
                                <p>${prevMsg}</p>
                            </div>
                        </div>

                        <div class="foot">
                            <div class="data">
                                <p>@ Wasana Bakers,</p>
                                <p>All right reserved</p>
                            </div>
                        </div>
                    </div>
                    
                </body>
                </html>

            `
        };

        //attachments

        if(attachments && attachments.length > 0){
            mailOptions.attachments = attachments;
        }

        //send mail
        await transporter.sendMail(mailOptions);
        console.log('mail send success');
    }
    catch(error){
        console.log('error sending email:' , error);
        throw error;
    }
}

module.exports = sendEmail;