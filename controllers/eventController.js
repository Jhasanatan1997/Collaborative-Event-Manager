const Event = require("../models/Event");
const logUtil = require('../utils/logger');
const errors = require('../utils/errors/error');



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