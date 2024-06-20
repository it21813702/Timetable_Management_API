
const Course = require('../models/Courses');
const User = require('../models/Users');


// Function to enroll a student in a course
exports.enrollStudent = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { username } = req.body;

    // Validate input
    if (!username || typeof username !== 'string') {
      return res.status(400).json({ message: 'Invalid username' });
    }

    // Find the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Find the user by username
    const student = await User.findOne({ username });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check if the user is a student
    if (student.role !== 'Student') {
      return res.status(403).json({ message: 'Only students can enroll in courses' });
    }

    // Check if the student is already enrolled
    if (course.students.includes(student._id)) {
      return res.status(409).json({ message: 'Student is already enrolled in the course' });
    }

    // Enroll the student
    course.students.push(student._id);
    await course.save();

    res.status(201).json({ message: 'Student enrolled successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//unenroll a student from a course
exports.unenrollStudent = async (req, res) => {
  try {
    const { courseId, studentId } = req.params;

    // Check if the user is (Admin or Faculty)
    if (req.user.role !== 'Admin' && req.user.role !== 'Faculty') {
      return res.status(403).json({ message: 'Unauthorized, only admins or faculty can unenroll students from courses' });
    }

    // Find the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if the student is enrolled
    const studentIndex = course.students.indexOf(studentId);
    if (studentIndex === -1) {
      return res.status(404).json({ message: 'Student is not enrolled in the course' });
    }

    // Remove the student from course
    course.students.splice(studentIndex, 1);
    await course.save();

    res.json({ message: 'Student unenrolled successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get all usernames and student IDs of students enrolled incourse
exports.getEnrolledStudents = async (req, res) => {
  try {
    // Check if the user is an admin or faculty
    if (req.user.role !== 'Admin' && req.user.role !== 'Faculty') {
      return res.status(403).json({ message: 'Unauthorized, only admins or faculty can access enrolled students' });
    }

    const { courseId } = req.params;

    // Find the course
    const course = await Course.findById(courseId   ).populate('students', 'username');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // get usernames and student IDs
    const enrolledStudents = course.students.map(student => ({
      username: student.username,
      studentId: student._id
    }));

    res.json(enrolledStudents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

