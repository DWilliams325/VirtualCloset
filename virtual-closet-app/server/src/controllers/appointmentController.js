import Appointment from "../models/Appointment.js";

/**
 * Get all appointments (with optional filters)
 */
export async function getAllAppointments(req, res) {
  try {
    const { userId, status, date, startDate, endDate } = req.query;
    const filter = {};

    if (userId) filter.userId = userId;
    if (status) filter.status = status;
    if (date) filter.date = date;
    
    // Date range filter
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = startDate;
      if (endDate) filter.date.$lte = endDate;
    }

    const appointments = await Appointment.find(filter).sort({ date: 1, time: 1 });

    res.json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch appointments",
    });
  }
}

/**
 * Get a single appointment by ID
 */
export async function getAppointmentById(req, res) {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: "Appointment not found",
      });
    }

    res.json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    console.error("Error fetching appointment:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch appointment",
    });
  }
}

/**
 * Create a new appointment
 */
export async function createAppointment(req, res) {
  try {
    const {
      userId,
      userName,
      userEmail,
      date,
      time,
      studentId,
      major,
      notes,
      duration = 45,
    } = req.body;

    // Validate required fields
    if (!userId || !userName || !userEmail || !date || !time) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: userId, userName, userEmail, date, time",
      });
    }

    // Check if slot is available
    const existingAppointment = await Appointment.findOne({
      date,
      time,
      status: { $in: ["pending", "confirmed", "blocked"] },
    });

    if (existingAppointment) {
      return res.status(409).json({
        success: false,
        error: "This time slot is already booked",
      });
    }

    const appointment = new Appointment({
      userId,
      userName,
      userEmail,
      date,
      time,
      studentId,
      major,
      notes,
      duration,
      appointmentType: "consultation",
      status: "pending",
      createdBy: userId,
    });

    await appointment.save();

    res.status(201).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to create appointment",
    });
  }
}

/**
 * Update an appointment
 */
export async function updateAppointment(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Don't allow updating these fields via this endpoint
    delete updates._id;
    delete updates.createdBy;
    delete updates.createdAt;

    // Add updatedBy field
    if (updates.userId) {
      updates.updatedBy = updates.userId;
    }

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: "Appointment not found",
      });
    }

    res.json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    console.error("Error updating appointment:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to update appointment",
    });
  }
}

/**
 * Cancel an appointment
 */
export async function cancelAppointment(req, res) {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: "Appointment not found",
      });
    }

    appointment.status = "cancelled";
    if (userId) appointment.updatedBy = userId;
    await appointment.save();

    res.json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to cancel appointment",
    });
  }
}

/**
 * Delete an appointment (admin only)
 */
export async function deleteAppointment(req, res) {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findByIdAndDelete(id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: "Appointment not found",
      });
    }

    res.json({
      success: true,
      message: "Appointment deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to delete appointment",
    });
  }
}

/**
 * Get available time slots for a specific date
 */
export async function getAvailableSlots(req, res) {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        error: "Date parameter is required",
      });
    }

    // Check if date is a weekday (Monday-Friday)
    const [year, month, day] = date.split('-').map(Number);
    const selectedDate = new Date(year, month - 1, day);
    const dayOfWeek = selectedDate.getDay();
    
    // Return empty slots for weekends (0 = Sunday, 6 = Saturday)
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return res.json({
        success: true,
        data: {
          date,
          availableSlots: [],
          bookedSlots: [],
        }
      });
    }

    const bookedSlots = await Appointment.findAvailableSlots(date);

    // Define available hours 9 AM - 5 PM Monday-Friday (30 min slots)
    const businessHours = [
      "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
      "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
      "15:00", "15:30", "16:00", "16:30", "17:00"
    ];

    const bookedTimes = bookedSlots.map(slot => slot.time);
    const availableSlots = businessHours.filter(time => !bookedTimes.includes(time));

    res.json({
      success: true,
      data: {
        date,
        availableSlots,
        bookedSlots: bookedTimes,
      }
    });
  } catch (error) {
    console.error("Error fetching available slots:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch available slots",
    });
  }
}

/**
 * Admin: Block a time slot
 */
export async function blockTimeSlot(req, res) {
  try {
    const { date, time, duration = 60, reason } = req.body;
    const adminId = req.body.adminId || "admin";

    if (!date || !time) {
      return res.status(400).json({
        success: false,
        error: "Date and time are required",
      });
    }

    const blockedSlot = new Appointment({
      userId: adminId,
      userName: "Admin Block",
      userEmail: "admin@university.edu",
      date,
      time,
      duration,
      reason,
      status: "blocked",
      appointmentType: "consultation",
      isAdminBlocked: true,
      createdBy: adminId,
    });

    await blockedSlot.save();

    res.status(201).json({
      success: true,
      data: blockedSlot,
    });
  } catch (error) {
    console.error("Error blocking time slot:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to block time slot",
    });
  }
}
