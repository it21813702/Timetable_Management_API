//admin crud functions for rooms that will be 
//      visible for booking by faculty staff

const Room = require('../models/Room');

// Create a new room
exports.createRoom = async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Unauthorised, only admins can create rooms'});
    }

    const { roomNumber, capacity, type, hasProjector } = req.body;
    const room = new Room({ roomNumber, capacity, type, hasProjector });
    
    await room.save();
    res.status(201).json({ message: 'Room created successfully', room });

  } catch (error) {
    res.status(500).json({ error: error.message });

  }
};

// Retrieve all rooms
exports.getAllRooms = async (req, res) => {
  try {
    if (req.user.role !== 'Admin' && req.user.role !== 'Faculty') {
      return res.status(403).json({ message: 'Unauthorised, only admins and faculty can view all rooms'});
    }

    const rooms = await Room.find();
    res.json(rooms);

  } catch (error) {
    res.status(500).json({ error: error.message });

  }
};

// Retrieve a single room by ID
exports.getRoomById = async (req, res) => {
  try {
    if (req.user.role !== 'Admin' && req.user.role !== 'Faculty') {
      return res.status(403).json({ message: 'Unauthorised, only admins and faculty can view rooms'});
    }

    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json(room);

  } catch (error) {
    res.status(500).json({ error: error.message });

  }
};

// Update a room by ID
exports.updateRoom = async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Unauthorised, only admins can edit room data'});
    }

    const { roomNumber, capacity, type, hasProjector } = req.body;
    const room = await Room.findByIdAndUpdate(req.params.id, { roomNumber, capacity, type, hasProjector }, { new: true });

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json({ message: 'Room updated successfully', room });

  } catch (error) {
    res.status(500).json({ error: error.message });

  }
};

// Delete a room by ID
exports.deleteRoom = async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Unauthorised, only admins can delete rooms'});
    }

    const room = await Room.findByIdAndDelete(req.params.id);

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json({ message: 'Room deleted successfully' });

  } catch (error) {
    res.status(500).json({ error: error.message });

  }
};
