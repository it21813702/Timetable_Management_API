
const ClassSession = require('../models/ClassSession'); //where timetables schema stored;

//create a new class session
exports.createClassSession = async (req, res) => {
  try {
    if (req.user.role !== 'Admin' && req.user.role != 'Faculty') {
      return res.status(403).json({ message: 'Unauthorised, only admins and faculty can make class sessions'});
    }


    // Validate if room is available for the given time slot
    const { day, startTime, endTime, room } = req.body;
    const existingSession = await ClassSession.findOne({
      day,
      $or: [
        { $and: [{ startTime: { $lte: startTime } }, { endTime: { $gte: startTime } }] },
        { $and: [{ startTime: { $lte: endTime } }, { endTime: { $gte: endTime } }] },
        { $and: [{ startTime: { $gte: startTime } }, { endTime: { $lte: endTime } }] }
      ],
      room
    });

    if (existingSession) {
      return res.status(409).json({ message: `Room is occupied` });
    }

    // Create the class session if the room is available
    const classSession = await ClassSession.create(req.body);
    res.status(201).json({ message: 'Class session created successfully', classSession })
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Func. to update a class session by ID
exports.updateClassSession = async (req, res) => {
  try {
    if (req.user.role !== 'Admin' && req.user.role != 'Faculty') {
      return res.status(403).json({ message: 'Unauthorised, only admins and faculty can update class sessions'});
    }

    const classSession = await ClassSession.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!classSession) {
      return res.status(404).json({ message: 'Class session not found' });
    }

    // Validate if room is available for the updated time slot
    const { day, startTime, endTime, room } = req.body;
    const existingSession = await ClassSession.findOne({
      _id: { $ne: req.params.id },
      day,
      $or: [
        { $and: [{ startTime: { $lte: startTime } }, { endTime: { $gte: startTime } }] },
        { $and: [{ startTime: { $lte: endTime } }, { endTime: { $gte: endTime } }] },
        { $and: [{ startTime: { $gte: startTime } }, { endTime: { $lte: endTime } }] }
      ],
      room
    });

    if (existingSession) {
      return res.status(409).json({ message: `Room is occupied` });
    }

    res.json({ message: 'Class session updated successfully', classSession });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Function to delete a class session by ID
exports.deleteClassSession = async (req, res) => {
  try {
    if (req.user.role !== 'Admin' && req.user.role != 'Faculty') {
      return res.status(403).json({ message: 'Unauthorised, only admins and faculty can delete class sessions'});
    }

    const classSession = await ClassSession.findByIdAndDelete(req.params.id);

    if (!classSession) {
      return res.status(404).json({ message: 'Class session not found' });
    }

    res.json({ message: 'Class session deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get timetable for a specific course by id
exports.getClassSessions = async (req, res) => {
  try {
    if (req.user.role !== 'Admin' && req.user.role != 'Faculty') {
      return res.status(403).json({ message: 'Unauthorised, only admins and faculty can view class sessions'});
    }

    const { courseId } = req.params;
    const classSessions = await ClassSession.find({ course: courseId });
    res.json(classSessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


