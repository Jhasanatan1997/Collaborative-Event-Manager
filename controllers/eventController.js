const Event = require("../models/Event");
const logUtil = require('../utils/logger');
const errors = require('../utils/errors/error');
const { google } = require("googleapis");
const googleAuth = require("../utils/googleAuth");
const scheduleReminder = require("../utils/reminderScheduler");

// Create a new event
exports.createEvent = async (req) => {
    const { name, description, date, location } = req.body;

    try {
        const newEvent = new Event({
            name,
            description,
            date,
            location,
            createdBy: req.user.id,
        });

        const savedEvent = await newEvent.save();
        return savedEvent;
    } catch (error) {
        logUtil.appLogger(
            'error',
            req.user,
            'createEvent',
            error.status,
            error.message
        );
        throw error;
    }
};

// Get all events created by the authenticated user
exports.getMyEvents = async (req) => {
    try {
        const events = await Event.find({ createdBy: req.user.id });
        return events;
    } catch (error) {
        logUtil.appLogger(
            'error',
            req.user,
            'getMyEvents',
            error.status,
            error.message
        );
        throw error;
    }
};

// Get a specific event by ID
exports.getEventById = async (req) => {
    try {
        const event = await Event.findById(req.params.id).populate("participants tasks.assignedTo", "username email");
        if (!event) {
            throw new errors.RecordNotFound("Event Not Found");
        }
        return event;
    } catch (error) {
        logUtil.appLogger(
            'error',
            req.user,
            'getEventById',
            error.status,
            error.message
        );
        throw error;
    }
};

// Update an event
exports.updateEvent = async (req) => {
    const { name, description, date, location } = req.body;

    try {
        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.id,
            { name, description, date, location },
            { new: true }
        );

        if (!updatedEvent) {
           throw new errors.RecordNotFound("Event Not Found");
        }

        return updatedEvent;
    } catch (error) {
        logUtil.appLogger(
            'error',
            req.user,
            'updateEvent',
            error.status,
            error.message
        );
        throw error;
    }
};

// Delete an event
exports.deleteEvent = async (req, res) => {
    try {
        const deletedEvent = await Event.findByIdAndDelete(req.params.id);
        if (!deletedEvent) {
            throw new errors.RecordNotFound("Event Not Found");
        }
        return{ message: "Event deleted successfully", deletedEvent };

    } catch (error) {
        logUtil.appLogger(
            'error',
            req.user,
            'deleteEvent',
            error.status,
            error.message
        );
        throw error;
    }
};



// Add a participant to an event
exports.addParticipant = async (req, userId) => {
    
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            throw new errors.RecordNotFound("Event Not Found");
        }

        if (event.participants.includes(userId)) {
            throw new errors.DuplicateData("User already a participant");
        }

        event.participants.push(userId);
        await event.save();
        return ({ message: "Participant added successfully", event });

    } catch (error) {
        logUtil.appLogger(
            'error',
            req.user,
            'addParticipant',
            error.status,
            error.message
        );
        throw error;
    }
};




// Get participants of an event
exports.getParticipants = async (req) => {

    try {
        const event = await Event.findById(req.params.id).populate("participants", "username email");
        if (!event) {
            throw new errors.RecordNotFound("Event Not Found");
        }

        return { participants: event.participants };

    } catch (error) {
        logUtil.appLogger(
            'error',
            req.user,
            'addParticipant',
            error.status,
            error.message
        );
        throw error;
    }
};




// Remove a participant from an event
exports.removeParticipant = async (req, userId) => {

    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            throw new errors.RecordNotFound("Event Not Found");
        }

        if (!event.participants.includes(userId)) {
            throw new errors.RecordNotFound("User is not a participant");
        }

        event.participants = event.participants.filter((id) => id.toString() !== userId);
        await event.save();
        return { message: "Participant removed successfully", event };

    } catch (error) {
        logUtil.appLogger(
            'error',
            req.user,
            'removeParticipant',
            error.status,
            error.message
        );
        throw error;
    }
};




exports.addTask = async (req, res) => {

    const { title, description, dueDate, reminderTime, assignedTo } = req.body;

    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            throw new errors.RecordNotFound("Event Not Found");
        }

        if (assignedTo && !event.participants.includes(assignedTo)) {
            throw new errors.BadRequest("Assigned user must be a participant in the event");
        }

        const newTask = new Task({
            title,
            description,
            dueDate,
            reminderTime,
            assignedTo,
            createdBy: req.user.id,
        });
        
        const savedTask = await newTask.save();

        // Schedule a reminder if reminderTime is provided
        if (reminderTime) {
            scheduleReminder(savedTask._id, new Date(reminderTime), assignedTo);
        }

        return { message: "Task added successfully", task: savedTask };

    } catch (error) {
        logUtil.appLogger(
            'error',
            req.user,
            'addTask',
            error.status,
            error.message
        );
        throw error;
    }
};



// Update a task in an event
exports.updateTask = async (req) => {

    const { taskId, title, description, dueDate, status, assignedTo } = req.body;
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            throw new errors.RecordNotFound("Event Not Found");
        }

        const task = event.tasks.id(taskId);
        if (!task) {
            throw new errors.RecordNotFound("Task not found");
        }

        if (assignedTo && !event.participants.includes(assignedTo)) {
            throw new errors.BadRequest("Assigned user must be a participant in the event");
        }

        if (title) task.title = title;
        if (description) task.description = description;
        if (dueDate) task.dueDate = dueDate;
        if (status) task.status = status;
        if (assignedTo) task.assignedTo = assignedTo;

        await event.save();

        return { message: "Task updated successfully", task };
    } catch (error) {
        logUtil.appLogger(
            'error',
            req.user,
            'updateTask',
            error.status,
            error.message
        );
        throw error;
    }
};




// Get tasks for an event
exports.getTasks = async (req, res) => {
    
    try {
        const event = await Event.findById(req.params.id).populate("tasks.assignedTo", "username email");
        if (!event) {
            throw new errors.RecordNotFound("Event Not Found");
        }

        return { tasks: event.tasks };
        
    } catch (error) {
        logUtil.appLogger(
            'error',
            req.user,
            'getTasks',
            error.status,
            error.message
        );
        throw error;
    }
};




exports.addToGoogleCalendar = async (req, res) => {

    try {
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        const calendar = google.calendar({ version: "v3", auth: googleAuth });

        const googleEvent = {
            summary: event.title,
            description: event.description,
            start: { dateTime: event.startDate.toISOString() },
            end: { dateTime: event.endDate.toISOString() },
            attendees: event.participants.map((participant) => ({ email: participant.email })),
        };

        const response = await calendar.events.insert({
            calendarId: "primary",
            resource: googleEvent,
        });

        res.status(200).json({ message: "Event added to Google Calendar", data: response.data });
    } catch (error) {
        console.error("Error adding event to Google Calendar:", error);
        res.status(500).json({ message: "Failed to add event to Google Calendar" });
    }
};