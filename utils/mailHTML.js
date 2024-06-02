const emailHTML = (currentURL, verificationToken) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verification</title>
      <style>
        /* Thiết lập các kiểu CSS cho email */
        .container {
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          border: 1px solid #ccc;
          border-radius: 16px;
          background-color: #fff;
        }
        .card {
          background-color: #ffffff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
        }
        .button {
          display: inline-block;
          background-color: #007bff;
          color: #fff !important;
          text-decoration: none;
          padding: 10px 20px;
          border-radius: 8px;

        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="card">
          <h2>Email xác thực</h2>
          <p>Cảm ơn bạn đã đăng ký với website TMS của chúng tôi! Vui lòng xác minh địa chỉ email của bạn bằng cách nhấp vào nút bên dưới:</p>
          <a href="${currentURL}/auth/verify-mail?verificationToken=${verificationToken}" target="_blank" class="button">Xác nhận Email</a>
        </div>
      </div>
    </body>
    </html>
  `;
};

module.exports = emailHTML;
