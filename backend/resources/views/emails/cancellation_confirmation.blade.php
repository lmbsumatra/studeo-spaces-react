<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 10px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        h1 {
            color: #FF0000;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Booking Cancellation Confirmation</h1>
        <p>Hello {{ $bookingDetails->name }},</p>
        <p>Your booking has been successfully canceled. Below are the details of the canceled booking:</p>
        <ul>
            <li><strong>Service:</strong> {{ $bookingDetails->service_name }}</li>
            <li><strong>Date:</strong> {{ $bookingDetails->date }}</li>
            <li><strong>Time:</strong> {{ $bookingDetails->time }}</li>
            <li><strong>Reference Number:</strong> {{ $bookingDetails->refNumber }}</li>
        </ul>
        <p>If you have any questions or would like to rebook, please contact us or visit our website.</p>
        <p>Thank you, <br>Your Service Team</p>
    </div>
</body>
</html>
