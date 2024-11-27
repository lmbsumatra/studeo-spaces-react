<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
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
            color: #007BFF;
        }
        .details {
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Your Booking Receipt</h1>
        <p>Thank you for your booking! Below are the details of your appointment:</p>
        <div class="details">
            <p><strong>Service:</strong> {{ $bookingDetails['service_name'] }}</p>
            <p><strong>Date:</strong> {{ $bookingDetails['date'] }}</p>
            <p><strong>Time:</strong> {{ $bookingDetails['time'] }}</p>
            <p><strong>Price:</strong> ₱{{ $bookingDetails['price'] }}</p>
            <p><strong>Reference Number:</strong> {{ $bookingDetails['refNumber'] }}</p>
            <p><strong>Customer ID:</strong> {{ $bookingDetails['customer_id'] }}</p>
        </div>
        <p>We look forward to serving you!</p>
    </div>
</body>
</html>
