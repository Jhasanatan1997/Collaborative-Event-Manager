const express = require("express");
const {
    createEvent,
    getMyEvents,
    getEventById,
    updateEvent,
    deleteEvent,
    addParticipant,
    removeParticipant,
    getParticipants,
    addTask,
    updateTask,
    getTasks
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


//add participants to an event
router.post('/:id/add-participants', authMiddleware, async (req, res, next) => {
  try {

    const { userId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(req.params.id) || !mongoose.Types.ObjectId.isValid(userId)) {
      throw new errors.Validation("Invalid ID format");
    }

    const result = await addParticipant(req, userId);
    res.status(200).json(result);

  } catch (error) {
    next(error);
  }
});


//get all participants for an event
router.get('/:id/get-participants', authMiddleware, async (req, res, next) => {
  try {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new errors.Validation("Invalid ID format");
    }

    const result = await getParticipants(req);
    res.status(200).json(result);

  } catch (error) {
    next(error);
  }
});



router.delete('/:id/remove-participants', authMiddleware, async (req, res, next) => {

  const { userId } = req.body;

  try {

    if (!mongoose.Types.ObjectId.isValid(req.params.id) || !mongoose.Types.ObjectId.isValid(userId)) {
      throw new errors.Validation("Invalid ID format");
    }

    const result = await removeParticipant(req, userId);
    res.status(200).json(result);

  } catch (error) {
    next(error);
  }
});




// Add a task
router.post('/:id/add-tasks', authMiddleware, async (req, res, next) => {
  try {

    if (!mongoose.Types.ObjectId.isValid(req.params.id) || (req.body.assignedTo && !mongoose.Types.ObjectId.isValid(assignedTo))) {
      throw new errors.Validation("Invalid ID format");
    }

    const result = await addTask(req);
    res.status(200).json(result);

  } catch (error) {
    next(error);
  }
});



router.put('/:id/update-tasks', authMiddleware, async (req, res, next) => {
  try {

    if (!mongoose.Types.ObjectId.isValid(req.params.id) || !mongoose.Types.ObjectId.isValid(req.body.taskId) || (req.body.assignedTo && !mongoose.Types.ObjectId.isValid(req.body.assignedTo))) {
      throw new errors.Validation("Invalid ID format");
    }

    const result = await updateTask(req);
    res.status(200).json(result);

  } catch (error) {
    next(error);
  }
});



router.get('/:id/get-tasks', authMiddleware, async (req, res, next) => {
  try {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new errors.Validation("Invalid ID format");
    }

    const result = await getTasks(req);
    res.status(200).json(result);

  } catch (error) {
    next(error);
  }
});



module.exports = router;