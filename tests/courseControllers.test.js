
const { createCourse, getAllCourses, getCourseById, updateCourse, deleteCourse } = require('../controllers/courseControllers');
const Course = require('../models/Courses');

//mock course model methds.
jest.mock('../models/Courses', () => ({
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findOne: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  }));

  describe('courseControllers', () => {
    afterEach(() => {
      jest.clearAllMocks();

    });
  
    describe('createCourse', () => {  
      it('should create a new course', async () => {
        const req = {
          user: { role: 'Admin' },
          body: {
            name: 'Test Course',
            code: 'TEST101',
            description: 'This is a test course',
            credits: 3,
            faculty: 'Test Faculty',
          },
        };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
        await createCourse(req, res);
  
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
          message: 'Course created successfully',
          course: expect.objectContaining({
            name: 'Test Course',
            code: 'TEST101',
            description: 'This is a test course',
            credits: 3,
            faculty: 'Test Faculty',
          }),
        });
      });
      
      //if user not admin
      it('should return 403 if user not admin', async () => {
        const req = {
          user: { role: 'User' }, // User doesnt have Admin role
          body: {
            name: 'Test Course',
            code: 'TEST101',
            description: 'This is a test course',
            credits: 3,
            faculty: 'Test Faculty',
          },
        };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    
        await createCourse(req, res);
    
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorised, only admins can create courses' });

      });
    });
  
    describe('getAllCourses', () => {
      it('should get all courses', async () => {
        const courses = [
          {
            _id: '1',
            name: 'Course 1',
            code: 'COURSE101',
            description: 'Course 1 Description',
            credits: 3,
            faculty: 'Faculty A',
          },
          {
            _id: '2',
            name: 'Course 2',
            code: 'COURSE102',
            description: 'Course 2 Description',
            credits: 4,
            faculty: 'Faculty B',
          },
        ];
        Course.find.mockResolvedValueOnce(courses);
        const req = {};
        const res = { json: jest.fn() };
  
        await getAllCourses(req, res);
  
        expect(res.json).toHaveBeenCalledWith(courses);
      });
  
    });
  
    describe('getCourseById', () => {
        it('should return the course if found', async () => {
          const courseId = '1234567890';
          const courseData = {
            _id: courseId,
            name: 'Test Course',
            code: 'TEST101',
            description: 'This is a test course',
            credits: 3,
            faculty: 'Test Faculty',
          };
      
          // Mocking mrthod to return the course data
          Course.findById.mockResolvedValueOnce(courseData);
      
          const req = { params: { id: courseId } };
          const res = { json: jest.fn() };
      
          await getCourseById(req, res);
      
          expect(res.json).toHaveBeenCalledWith(courseData);
        });
      
        it('should return 404 if course is not found', async () => {
          const courseId = '1234567890';
      
          // Mocking the Course.findById method to return null (course not found)
          Course.findById.mockResolvedValueOnce(null);
      
          const req = { params: { id: courseId } };
          const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      
          await getCourseById(req, res);
      
          expect(res.status).toHaveBeenCalledWith(404);
          expect(res.json).toHaveBeenCalledWith({ message: 'Course not found' });
        });
      
        it('should handle errors and return 500 status code', async () => {
          const courseId = '1234567890';
          const errorMessage = 'Database error';
      
          // Mocking the Course.findById method to throw an error
          Course.findById.mockRejectedValueOnce(new Error(errorMessage));
      
          const req = { params: { id: courseId } };
          const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      
          await getCourseById(req, res);
      
          expect(res.status).toHaveBeenCalledWith(500);
          expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
        });
      });


    describe('deleteCourse', () => {
        it('should delete the course if found and user is admin', async () => {
          const courseId = '1234567890';
      
          // Mock  method to return the deleted course data
          Course.findByIdAndDelete.mockResolvedValueOnce({ _id: courseId });
      
          const req = {
            params: { id: courseId },
            user: { role: 'Admin' },
          };
          const res = { json: jest.fn() };
      
          await deleteCourse(req, res);
      
          expect(res.json).toHaveBeenCalledWith({ message: 'Course deleted successfully' });
        });

      
        it('should return 404 if course is not found', async () => {
          const courseId = '1234567890';
      
          // Mocking the method to return null 
          Course.findByIdAndDelete.mockResolvedValueOnce(null);
      
          const req = { params: { id: courseId }, user: { role: 'Admin' } };
          const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      
          await deleteCourse(req, res);
      
          expect(res.status).toHaveBeenCalledWith(404);
          expect(res.json).toHaveBeenCalledWith({ message: 'Course not found' });
        });

      
        it('should return 403 if user is not admin', async () => {
          const courseId = '1234567890';
      
          const req = { params: { id: courseId }, user: { role: 'User' } };
          const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      
          await deleteCourse(req, res);
      
          expect(res.status).toHaveBeenCalledWith(403);
          expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorised, only admins can delete courses' });
        });
      
        it('should handle errors and return 500 status code', async () => {
          const courseId = '1234567890';
          const errorMessage = 'Database error';
      
          // Mocking the Course.findByIdAndDelete method to throw an error
          Course.findByIdAndDelete.mockRejectedValueOnce(new Error(errorMessage));
      
          const req = { params: { id: courseId }, user: { role: 'Admin' } };
          const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      
          await deleteCourse(req, res);
      
          expect(res.status).toHaveBeenCalledWith(500);
          expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
        });
      });



      describe('updateCourse', () => {
      
      });
    

  });
  