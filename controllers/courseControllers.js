//course controller

const Course = require('../models/Courses');

exports.createCourse = async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Unauthorised, only admins can create courses'});
    }
    
    const { name, code, description, credits, faculty } = req.body;

    //course name check
    if (!name) {
      return res.status(400).json({ error: 'Invalid course name' });
    }

    //code check
    if (!code) {
      return res.status(400).json({ error: 'Invalid code' });
    }

    //desc. check
    if (!description) {
      return res.status(400).json({ error: 'Invalid description' });
    }

    //credits check
    if (!credits) {
      return res.status(400).json({ error: 'Invalid credits' });
    }

    //faculty check
    if (!faculty) {
      return res.status(400).json({ error: 'Invalid faculty' });
    }

    const course = new Course({ name, code, description, credits, faculty });
    
    await course.save();
    res.status(201).json({ message: 'Course created successfully', course });

  } catch (error) {
    res.status(500).json({ error: error.message });

  }
}


exports.getAllCourses = async (req, res) => { //req not used as nothing in req body is needed for this request.
  try {
    const courses = await Course.find();
    res.json(courses);

  } catch (error) {
    res.status(500).json({ error: error.message });
    
  }
};


exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });

    }
    res.json(course);

  } catch (error) {
    res.status(500).json({ error: error.message });

  }
};

exports.getCourseByCode = async (req, res) => {
  try {
    const { code } = req.params;
    const course = await Course.findOne({ code });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.updateCourse = async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Unauthorised, only admins can edit courses'});
    }

    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(201).json({ message: 'Course updated successfully', course });

    
  } catch (error) {
    res.status(500).json({ error: error.message });

  }
};


exports.deleteCourse = async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Unauthorised, only admins can delete courses'});
    }

    const course = await Course.findByIdAndDelete(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json({ message: 'Course deleted successfully' });

  } catch (error) {
    res.status(500).json({ error: error.message });

  }
};

