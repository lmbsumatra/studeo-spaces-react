import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseApiUrl } from "../../App";
import { formatTimeTo12Hour } from "../../utils/timeFormat";
import PaginationComponent from "../../components/PaginationComponent";
import { formatDate } from "../../utils/dateFormat";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [statuses, setStatuses] = useState({});
  const [sortedBookings, setSortedBookings] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [serviceFilter, setServiceFilter] = useState(""); // Default to all services
  const [statusFilter, setStatusFilter] = useState(""); // Default to all statuses
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [dateSortOption, setDateSortOption] = useState("default"); // State for date sorting
  const [isLoading, setLoading] = useState(true);
  const params = new URLSearchParams(window.location.search);
  const [highlightedRow, setHighlightedRow] = useState(null);
  const highlightId = params.get("highlight");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // 10 items per page

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${baseApiUrl}bookings`);
        setBookings(response.data);
        const initialStatuses = response.data.reduce((acc, booking) => {
          acc[booking.id] = booking.status;
          return acc;
        }, {});
        setStatuses(initialStatuses);
      } catch (error) {
        // console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  useEffect(() => {
    // Sorting and filtering logic is placed here inside the useEffect
    let sortedData = [...bookings];

    // Sorting logic
    if (sortConfig.key && sortConfig.direction) {
      sortedData.sort((a, b) => {
        const aValue =
          sortConfig.key === "customer.name"
            ? a.customer?.name
            : a[sortConfig.key];
        const bValue =
          sortConfig.key === "customer.name"
            ? b.customer?.name
            : b[sortConfig.key];
        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    // Date sorting logic
    if (dateSortOption === "dateAscend") {
      sortedData.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (dateSortOption === "dateDescend") {
      sortedData.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    // Apply service filter (filter only if a specific service is selected)
    if (serviceFilter && serviceFilter !== "All Services") {
      sortedData = sortedData.filter(
        (booking) => booking.service?.name === serviceFilter
      );
    }

    // Apply status filter (filter only if a specific status is selected)
    if (statusFilter && statusFilter !== "All Statuses") {
      sortedData = sortedData.filter(
        (booking) => statuses[booking.id] === statusFilter
      );
    }

    // Apply search filter for Booking ID and Customer Name
    if (searchQuery) {
      sortedData = sortedData.filter(
        (booking) =>
          booking.id.toString().includes(searchQuery) ||
          (booking.customer?.name &&
            booking.customer.name
              .toLowerCase()
              .includes(searchQuery.toLowerCase()))
      );
    }

    setSortedBookings(sortedData);
  }, [
    bookings,
    sortConfig,
    serviceFilter,
    statusFilter,
    statuses,
    searchQuery,
    dateSortOption,
  ]); // Add dateSortOption as a dependency

  const handleSortChange = (key, direction) => {
    setSortConfig({ key, direction });
  };

  const handleServiceFilterChange = (event) => {
    setServiceFilter(event.target.value); // Set selected service filter
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value); // Set selected status filter
  };

  const handleDateSortChange = (event) => {
    setDateSortOption(event.target.value); // Set selected date sort option
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      setLoading(true);
      setStatuses((prevStatuses) => ({
        ...prevStatuses,
        [bookingId]: newStatus,
      }));

      const response = await axios.put(
        `http://127.0.0.1:8000/api/bookings/${bookingId}/status`,
        {
          status: newStatus,
        }
      );

      if (response.status === 200) {
        // console.log("Booking status updated successfully");

        if (newStatus === "Completed") {
          const bookingDetails = bookings.find(
            (booking) => booking.id === bookingId
          );

          const paymentData = {
            customerName: bookingDetails.customer?.name,
            amount: bookingDetails.service?.price,
            date: bookingDetails.date,
          };

          const paymentResponse = await axios.post(
            "http://127.0.0.1:8000/api/payments",
            paymentData
          );

          if (paymentResponse.status === 201) {
            // console.log("Payment added successfully");
          } else {
            throw new Error("Failed to add payment");
          }
        }
      } else {
        throw new Error("Failed to update status");
      }
    } catch (error) {
      // console.error("Error updating booking status:", error);
      setStatuses((prevStatuses) => ({
        ...prevStatuses,
        [bookingId]: prevStatuses[bookingId],
      }));
    } finally {
      setLoading(false);
    }
  };

  // Calculate the indices of the first and last bookings on the current page
  const indexOfLastBooking = currentPage * itemsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - itemsPerPage;
  // Pagination logic
  const currentBookings = sortedBookings.slice(
    indexOfFirstBooking,
    indexOfLastBooking
  );
  const totalPages = Math.ceil(sortedBookings.length / itemsPerPage);

  useEffect(() => {
    if (highlightId && sortedBookings.length > 0) {
      // Find the index of the booking to highlight
      const bookingIndex = sortedBookings.findIndex(
        (booking) => booking.id.toString() === highlightId.toString()
      );

      if (bookingIndex !== -1) {
        // Calculate the page number where this booking resides
        const pageNumber = Math.floor(bookingIndex / itemsPerPage) + 1;
        setCurrentPage(pageNumber); // Update currentPage to the page where the highlighted booking is

        // Scroll into view after the page has updated
        setTimeout(() => {
          const highlightElement = document.getElementById(highlightId);
          if (highlightElement) {
            highlightElement.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }
        }, 200); // Delay to ensure page renders before scrolling
      }
    }
  }, [highlightId, sortedBookings, itemsPerPage]);

  useEffect(() => {
    if (highlightId) {
      // Set the highlight for the row
      setHighlightedRow(highlightId);

      // Remove the highlight after 5 seconds
      const timer = setTimeout(() => {
        setHighlightedRow(null);
      }, 5000);

      // Clear timeout if the component unmounts or highlightId changes
      return () => clearTimeout(timer);
    }
  }, [highlightId]); // Re-run when highlightId changes

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Bookings</h1>
      {isLoading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : bookings.length === 0 ? (
        <p>No bookings to show</p>
      ) : (
        <div>
          <div className="mb-3">
            <input
              type="text"
              placeholder="Search by Booking ID or Customer Name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <select
              value={dateSortOption}
              onChange={handleDateSortChange}
              className="form-control form-control-sm"
            >
              <option value="default">Sort by Date</option>
              <option value="dateAscend">Date (Oldest to Newest)</option>
              <option value="dateDescend">Date (Newest to Oldest)</option>
            </select>
          </div>
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th scope="col">
                    Booking ID
                    <select
                      onChange={(e) => handleSortChange("id", e.target.value)}
                      className="form-control form-control-sm"
                    >
                      <option value="">Sort</option>
                      <option value="asc">↑ Ascending</option>
                      <option value="desc">↓ Descending</option>
                    </select>
                  </th>
                  <th scope="col">
                    Customer Name
                    <select
                      onChange={(e) =>
                        handleSortChange("customer.name", e.target.value)
                      }
                      className="form-control form-control-sm"
                    >
                      <option value="">Sort</option>
                      <option value="asc">↑ Ascending</option>
                      <option value="desc">↓ Descending</option>
                    </select>
                  </th>
                  <th scope="col">
                    Service
                    <select
                      value={serviceFilter} // Set the selected value
                      onChange={handleServiceFilterChange}
                      className="form-control form-control-sm"
                    >
                      <option value="All Services">All Services</option>
                      {Array.from(
                        new Set(bookings.map((b) => b.service?.name))
                      ).map((service) => (
                        <option key={service} value={service}>
                          {service}
                        </option>
                      ))}
                    </select>
                  </th>
                  <th scope="col">Payment</th>
                  <th scope="col">Date</th>
                  <th scope="col">
                    Time
                    <select
                      onChange={(e) => handleSortChange("time", e.target.value)}
                      className="form-control form-control-sm"
                    >
                      <option value="">Sort</option>
                      <option value="asc">↑ Ascending</option>
                      <option value="desc">↓ Descending</option>
                    </select>
                  </th>
                  <th scope="col">
                    Payment Status
                    <select
                      value={statusFilter} // Set the selected value
                      onChange={handleStatusFilterChange}
                      className="form-control form-control-sm"
                    >
                      <option value="All Statuses">All Statuses</option>
                      <option value="Pending">Pending</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                      <option value="Done">Done</option>
                    </select>
                  </th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    id={booking.id}
                    className={
                      highlightedRow &&
                      highlightedRow.toString() === booking.id.toString()
                        ? "table-primary"
                        : ""
                    }
                  >
                    <td>{booking.id}</td>
                    <td>{booking.customer?.name}</td>
                    <td>{booking.service?.name}</td>
                    <td>{booking.service?.price}</td>
                    <td>{formatDate(booking.date)}</td>
                    <td>{formatTimeTo12Hour(booking.time)}</td>
                    <td>{statuses[booking.id]}</td>
                    <td>
                      <select
                        value={statuses[booking.id] || ""}
                        onChange={(e) =>
                          handleStatusChange(booking.id, e.target.value)
                        }
                        className="form-control"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
