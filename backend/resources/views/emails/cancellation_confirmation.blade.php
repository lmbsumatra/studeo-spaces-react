<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f9f9f9;
        }
        .container {
            max-width: 600px;
            margin: auto;
            padding: 20px;
            background-color: #ffffff;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: #e63946;
            font-size: 24px;
            font-weight: 600;
            text-align: center;
        }
        h2 {
            font-size: 20px;
            color: #333;
            margin-top: 20px;
        }
        p {
            font-size: 16px;
            line-height: 1.6;
            margin: 10px 0;
        }
        ul {
            font-size: 16px;
            line-height: 1.6;
            list-style: none;
            padding-left: 0;
        }
        li {
            padding: 8px 0;
            border-bottom: 1px solid #f1f1f1;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 14px;
            color: #888;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Booking Cancellation Confirmation</h1>
        <p>Hello {{ $bookingDetails->name }},</p>
        <p>Your booking has been successfully cancelled. Below are the details of the cancelled booking:</p>
        <ul>
            <li><strong>Service:</strong> {{ $bookingDetails->service->name }}</li>
            <li><strong>Date:</strong> {{ $bookingDetails->date }}</li>
            <li><strong>Time:</strong> {{ $bookingDetails->time }}</li>
            <li><strong>Reference Number:</strong> {{ $bookingDetails->refNumber }}</li>
        </ul>

        <p>If you have any questions, please contact us.</p>
        <p class="footer">Thank you,<br>Studeo Space</p>
    </div>
</body>
</html>
