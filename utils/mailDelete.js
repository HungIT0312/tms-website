const mailDelete = (content) => {
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
        display: flex;
        flex-direction:column;
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
          img{
          width:160px;
          align-self: center
          }
      </style>
    </head>
    <body>
      <div class="container">

        <div class="card">
          <img src="https://res.cloudinary.com/dzdfqqdxs/image/upload/v1714743799/logoBanner.png"/>

          <h2>Thông báo</h2>
          <p>${content}</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

module.exports = mailDelete;
