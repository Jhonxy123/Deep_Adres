import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

//crear un transporte. El objeto de conexión que tiene la configuración de nuestra conexión con nuestro gestor de emails

const transporter = nodemailer.createTransport({

    host:process.env.EMAIL_SERVICE,
    port:465,
    secure:true,


    // Credenciales de la cuenta que envia los correos
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASSWORD
    }

})

export async function enviarEmail(direccion,token) {
    transporter.sendMail({
        from: '"DEEP_ADRES" <adrescolombia1578@gmail.com>',
        to:direccion,
        subject:"VERIFICACIÓN DE LA CUENTA",
        html:crearEmail(token)
    })
}

function crearEmail(token){
    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Correo Enviado</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f5f5f5;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            color: #333;
        }
        
        .success-container {
            background-color: white;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            padding: 40px;
            text-align: center;
            max-width: 500px;
            width: 90%;
        }
        
        .success-icon {
            color: #4CAF50;
            font-size: 60px;
            margin-bottom: 20px;
        }
        
        h1 {
            color: #4CAF50;
            margin-bottom: 15px;
        }
        
        p {
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 25px;
        }
        
        .btn {
            display: inline-block;
            background-color: #4CAF50;
            color: white;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 5px;
            font-weight: bold;
            transition: background-color 0.3s;
        }
        
        .btn:hover {
            background-color: #45a049;
        }
    </style>
</head>
<body>
    <div class="success-container">
        <div class="success-icon">✓</div>
        <h1>¡Correo enviado exitosamente!</h1>
        <p>El mensaje ha sido enviado correctamente al destinatario. Recibirás una copia en tu bandeja de entrada.</p>
        <a href="/" class="btn">Volver al inicio</a>
    </div>
</body>
</html>`
}
