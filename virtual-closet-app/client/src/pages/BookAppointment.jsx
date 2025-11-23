import { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useAppointment } from "../context/AppointmentContext";
import "../styles/BookAppointment.css";

export default function BookAppointment({ userEmail }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState(userEmail || "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [bookedSlots, setBookedSlots] = useState([]);

  const { requestedItems } = useAppointment();
  const isAdmin = userEmail && userEmail.toLowerCase() === "admin@pfw.edu";

  // Admin view state
  const [appointments, setAppointments] = useState([]);
  const [showAppointments, setShowAppointments] = useState(false);
  const [loadingAppointments, setLoadingAppointments] = useState(false);

  // Generate calendar days
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty slots for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days in month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  // Navigate months
  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    setSelectedDate(null);
    setSelectedTime(null);
  };

  // Fetch available slots when a date is selected
  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots(selectedDate);
    }
  }, [selectedDate]);

  const fetchAvailableSlots = async (date) => {
    setLoadingSlots(true);
    const dateStr = date.toISOString().split('T')[0];

    try {
      const response = await fetch(`http://localhost:5001/api/appointments/available-slots?date=${dateStr}`);
      const data = await response.json();

      if (data.success) {
        setAvailableSlots(data.data.availableSlots || []);
        setBookedSlots(data.data.bookedSlots || []);
      }
    } catch (err) {
      console.error("Error fetching slots:", err);
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleDateClick = (date) => {
    if (!date) return;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return; // Prevent selecting past dates

    setSelectedDate(date);
    setSelectedTime(null);
    setError("");
  };

  const handleTimeClick = (time) => {
    setSelectedTime(time);
    setError("");
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!selectedDate) {
      setError("Please select a date.");
      return;
    }
    if (!selectedTime) {
      setError("Please select a time slot.");
      return;
    }

    const appointmentData = {
      userId: email,
      userName: name,
      userEmail: email,
      date: selectedDate.toISOString().split('T')[0],
      time: selectedTime,
      requestedItems: requestedItems.map(item => ({
        id: item.id,
        name: item.name,
        category: item.category,
        color: item.color,
        size: item.size
      })),
      notes: ""
    };

    try {
      const response = await fetch("http://localhost:5001/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appointmentData)
      });

      const data = await response.json();

      if (data.success) {
        setSuccess("Appointment booked successfully!");
        setError("");
        setName("");
        setEmail("");
        setSelectedDate(null);
        setSelectedTime(null);

        // Refresh available slots
        if (selectedDate) {
          fetchAvailableSlots(selectedDate);
        }
      } else {
        setError(data.error || "Failed to book appointment.");
      }
    } catch (err) {
      setError("Failed to book appointment. Please try again.");
    }
  };

  const fetchAppointments = async () => {
    setLoadingAppointments(true);
    try {
      const response = await fetch("http://localhost:5001/api/appointments");
      const data = await response.json();

      if (data.success) {
        setAppointments(data.data);
      }
    } catch (err) {
      console.error("Error fetching appointments:", err);
    } finally {
      setLoadingAppointments(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Convert 24-hour time to 12-hour EST format
  const formatTime = (time24) => {
    if (!time24) return "";
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${hour12}:${minutes} ${ampm} EST`;
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    if (!date || !selectedDate) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  const days = getDaysInMonth(currentMonth);
  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="appointment-page">
      {isAdmin && (
        <div className="admin-section">
          <button
            className="admin-btn"
            onClick={() => {
              setShowAppointments(!showAppointments);
              if (!showAppointments) fetchAppointments();
            }}
          >
            {showAppointments ? "Hide Appointments" : "View All Appointments"}
          </button>

          {showAppointments && (
            <div className="appointments-table">
              {loadingAppointments ? (
                <div>Loading...</div>
              ) : appointments.length === 0 ? (
                <div>No appointments found.</div>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((appt) => (
                      <tr key={appt._id}>
                        <td>{appt.userName}</td>
                        <td>{appt.userEmail}</td>
                        <td>{appt.date}</td>
                        <td>{appt.time}</td>
                        <td>{appt.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      )}

      <div className="appointment-container">
        <div className="appointment-header">
          <h1>Book Career Closet Appointment</h1>
          <p className="appointment-subtitle">30 min appointments • In-person consultation</p>
        </div>

        <div className="appointment-content">
          {/* Calendar Section */}
          <div className="calendar-section">
            <h2>Select an appointment time</h2>

            <div className="calendar">
              <div className="calendar-header">
                <button onClick={previousMonth} className="nav-btn">
                  <FaChevronLeft />
                </button>
                <span className="month-name">{monthName}</span>
                <button onClick={nextMonth} className="nav-btn">
                  <FaChevronRight />
                </button>
              </div>

              <div className="calendar-grid">
                <div className="weekday-header">S</div>
                <div className="weekday-header">M</div>
                <div className="weekday-header">T</div>
                <div className="weekday-header">W</div>
                <div className="weekday-header">T</div>
                <div className="weekday-header">F</div>
                <div className="weekday-header">S</div>

                {days.map((date, index) => (
                  <button
                    key={index}
                    className={`calendar-day ${!date ? 'empty' : ''} ${isToday(date) ? 'today' : ''} ${isSelected(date) ? 'selected' : ''}`}
                    onClick={() => handleDateClick(date)}
                    disabled={!date || date < new Date().setHours(0, 0, 0, 0)}
                  >
                    {date ? date.getDate() : ''}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Time Slots Section */}
          <div className="slots-section">
            {selectedDate ? (
              <>
                <h3>{formatDate(selectedDate)}</h3>

                {loadingSlots ? (
                  <div className="loading">Loading available slots...</div>
                ) : availableSlots.length === 0 ? (
                  <div className="no-slots">No available slots for this date.</div>
                ) : (
                  <div className="time-slots-grid">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot}
                        className={`time-slot ${selectedTime === slot ? 'selected' : ''}`}
                        onClick={() => handleTimeClick(slot)}
                      >
                        {formatTime(slot)}
                      </button>
                    ))}
                  </div>
                )}

                {selectedTime && (
                  <form className="booking-form" onSubmit={handleBookAppointment}>
                    <h3>Confirm your details</h3>

                    <div className="form-field">
                      <label>Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your full name"
                        required
                      />
                    </div>

                    <div className="form-field">
                      <label>Email</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@pfw.edu"
                        required
                      />
                    </div>

                    {requestedItems.length > 0 && (
                      <div className="requested-items-summary">
                        <strong>Requested Items:</strong>
                        <ul>
                          {requestedItems.map(item => (
                            <li key={item.id}>{item.name}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}

                    <button type="submit" className="book-btn">
                      Confirm Appointment
                    </button>
                  </form>
                )}
              </>
            ) : (
              <div className="select-date-prompt">
                <p>Select a date from the calendar to view available time slots</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
