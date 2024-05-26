import React from 'react';
// import './AdminDashboard.css'; // Assuming you have some custom CSS for styling

const AdminDashboard = () => {
    // Sample data for demonstration purposes
    const availableSeats = 120;
    const bookedSeats = 80;
    const numberOfCustomers = 50;
    const totalSales = 20000; // in currency, e.g., PHP
    const pendingBookings = 10;
    const canceledBookings = 5;

    return (
        <div className="container mt-5">
            <h1 className="mb-4">Admin Dashboard</h1>
            <div className="row">
                <div className="col-md-4 mb-4">
                    <div className="card text-white bg-primary h-100">
                        <div className="card-body">
                            <h5 className="card-title">Available Seats</h5>
                            <p className="card-text fs-3">{availableSeats}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 mb-4">
                    <div className="card text-white bg-success h-100">
                        <div className="card-body">
                            <h5 className="card-title">Booked Seats</h5>
                            <p className="card-text fs-3">{bookedSeats}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 mb-4">
                    <div className="card text-white bg-info h-100">
                        <div className="card-body">
                            <h5 className="card-title">Customers</h5>
                            <p className="card-text fs-3">{numberOfCustomers}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 mb-4">
                    <div className="card text-white bg-warning h-100">
                        <div className="card-body">
                            <h5 className="card-title">Total Sales</h5>
                            <p className="card-text fs-3">₱ {totalSales.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 mb-4">
                    <div className="card text-white bg-danger h-100">
                        <div className="card-body">
                            <h5 className="card-title">Pending Bookings</h5>
                            <p className="card-text fs-3">{pendingBookings}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 mb-4">
                    <div className="card text-white bg-secondary h-100">
                        <div className="card-body">
                            <h5 className="card-title">Canceled Bookings</h5>
                            <p className="card-text fs-3">{canceledBookings}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
