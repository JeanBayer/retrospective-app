export const PASSWORD_RESET = {
  'password-reset': {
    subject: 'Restablece tu Contraseña',
    html: `
      <!DOCTYPE html>
      <html lang="es">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Restablecimiento de Contraseña</title>
          <style>
              body {
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
                  margin: 0;
                  padding: 0;
                  background-color: #f4f4f4;
                  color: #333333;
              }
              .container {
                  max-width: 600px;
                  margin: 20px auto;
                  background-color: #ffffff;
                  padding: 30px;
                  border-radius: 8px;
                  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
                  border: 1px solid #e0e0e0;
              }
              .header {
                  text-align: center;
                  padding-bottom: 20px;
                  border-bottom: 1px solid #eeeeee;
                  margin-bottom: 30px;
              }
              .header h1 {
                  color: #007bff; /* Un azul profesional */
                  font-size: 28px;
                  margin: 0;
              }
              .content p {
                  font-size: 16px;
                  line-height: 1.6;
                  margin-bottom: 15px;
              }
              .code-section {
                  text-align: center;
                  background-color: #f8f9fa;
                  padding: 20px;
                  border-radius: 5px;
                  margin: 30px 0;
                  border: 1px dashed #cccccc;
              }
              .code-section strong {
                  display: block;
                  font-size: 32px;
                  color: #28a745; /* Un verde para destacar el código */
                  letter-spacing: 3px;
                  margin-top: 10px;
              }
              .footer {
                  text-align: center;
                  padding-top: 20px;
                  border-top: 1px solid #eeeeee;
                  margin-top: 30px;
                  font-size: 14px;
                  color: #777777;
              }
              .footer p {
                  margin: 5px 0;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1>Restablecimiento de Contraseña</h1>
              </div>
              <div class="content">
                  <p>Hola {{name}},</p>
                  <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta. Para completar el proceso, usa el siguiente código de verificación:</p>

                  <div class="code-section">
                      <p>Tu código de restablecimiento es:</p>
                      <strong>{{code}}</strong>
                  </div>

                  <p>Por favor, introduce este código en la página de restablecimiento de contraseña. Este código es válido por <strong>10 minutos</strong></p>
                  <p>Si no solicitaste este restablecimiento de contraseña, por favor ignora este correo electrónico o contáctanos si tienes alguna preocupación.</p>
              </div>
              <div class="footer">
                  <p>Saludos cordiales,</p>
                  <p>El equipo de Retrospective Util</p>
              </div>
          </div>
      </body>
      </html>
    `,
  },
};
