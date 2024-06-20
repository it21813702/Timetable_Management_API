//define routes that require authentication using the middleware


const express = require('express');
const router = express.Router();
const controllers = require('./auth/controllers');
const courseControllers = require('./controllers/courseControllers');
const timetableControllers = require('./controllers/timetableControllers');
const adminRoomControl = require('./controllers/adminRoomControl');
const enrollmentController = require('./controllers/enrollmentController');
const authenticateToken = require('./auth/middleware');

//routes for registration and login
router.post('/register', controllers.register);
router.post('/login', controllers.login);

//course routes
router.post('/courses', authenticateToken, courseControllers.createCourse);
router.get('/courses', authenticateToken, courseControllers.getAllCourses);
router.get('/courses/:id', authenticateToken, courseControllers.getCourseById);
router.put('/courses/:id', authenticateToken, courseControllers.updateCourse);
router.delete('/courses/:id', authenticateToken, courseControllers.deleteCourse);
router.get('/courses/code/:code', authenticateToken, courseControllers.getCourseByCode);


//Admin routes to perfrom CRUD ops on room
router.post('/admin/rooms', authenticateToken, adminRoomControl.createRoom);
router.get('/admin/rooms', authenticateToken, adminRoomControl.getAllRooms);
router.get('/admin/rooms/:id', authenticateToken, adminRoomControl.getRoomById);
router.put('/admin/rooms/:id', authenticateToken, adminRoomControl.updateRoom);
router.delete('/admin/rooms/:id', authenticateToken, adminRoomControl.deleteRoom);

//timetable routes
router.post('/class-sessions', authenticateToken, timetableControllers.createClassSession); // Only Faculty Staff and Admins
router.put('/class-sessions/:id', authenticateToken, timetableControllers.updateClassSession); 
router.delete('/class-sessions/:id', authenticateToken, timetableControllers.deleteClassSession); 
router.get('/class-sessions/:courseId', authenticateToken, timetableControllers.getClassSessions);


//student enrollment routes
router.post('/courses/:courseId/enroll', authenticateToken, enrollmentController.enrollStudent);
router.delete('/courses/:courseId/unenroll/:studentId', authenticateToken, enrollmentController.unenrollStudent);
router.get('/courses/:courseId/enrolledStudents', authenticateToken, enrollmentController.getEnrolledStudents);

module.exports = router;