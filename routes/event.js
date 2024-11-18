const express = require("express");
const {
    createEvent,
    getMyEvents,
    getEventById,
    updateEvent,
    deleteEvent,
} = require("../controllers/eventController");
const { authMiddleware } = require("../utils/middleware");
const mongoose = require("mongoose");
const errors = require('../utils/errors/error');


const router = express.Router();

router.post('/add-event', authMiddleware, async (req, res, next) => {
    try {
      const result = await createEvent(req);
      res.status(201).json(result);
  
    } catch (error) {
      next(error);
    }
});

// Get all events for the authenticated user
router.get('/get-events', authMiddleware, async (req, res, next) => {
  try {
    const result = await getMyEvents(req);
    res.status(200).json(result);

  } catch (error) {
    next(error);
  }
});

 // Get an event by ID
 router.get('/get-event/:id', authMiddleware, async (req, res, next) => {
  try {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new errors.Validation("Invalid ID format");
    }

    const result = await getEventById(req);
    res.status(200).json(result);

  } catch (error) {
    next(error);
  }
});


router.put('/update-event/:id', authMiddleware, async (req, res, next) => {
  try {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new errors.Validation("Invalid ID format");
    }

    const result = await updateEvent(req);
    res.status(200).json(result);

  } catch (error) {
    next(error);
  }
});

router.delete('/remove-event/:id', authMiddleware, async (req, res, next) => {
  try {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new errors.Validation("Invalid ID format");
    }

    const result = await deleteEvent(req);
    res.status(200).json(result);

  } catch (error) {
    next(error);
  }
});


module.exports = router;