# attendance-system

The following application is an attendance management system, allowing a school or organization to track and organize their attendance.

The attendance management system allows the user to log in as either an administrator or a teacher, which determines which features the user will be able to use.

Teacher features:
1. View class dashboard of all the classes the teacher instructs.
2. View class details along with a table of students in the class, containing the attendance mark for each student
3. View every student in their class, allowing the teacher to view their attendance marks in other courses.
4. View attendance home page for the class, containing the average class percentage for the class and a table of all attendances recorded.
5. Mark new attendance.
5. Update or delete a recorded attendance.

Administrator features:
1. All of the Teacher features (the administrators class dashboard will contain all classes).
2. Add, update, or delete a class.
3. Add or remove students from a class.
4. View student dashboard of all students.
5. View student details, including their currently enrolled classes and their attendance marks in these classes.
6. Add, update, or delete a student.
7. View teacher dashboard of all students.
8. View teacher details, including the classes they currently teach.
9. Add, update, or delete a teacher.
10. Update a teacher's password (without seeing their previous password).


Additional Application Features:
1. Pagination for student, class, and teacher tables (server side and client side were implemented, and usage depends on the page).
2. Search bar for student, class, and teacher tables (this works in conjunction with client side pagination when it is used).
3. Responsive sidebar menu, which becomes a dropdown menu at a smaller screen size.
4. Date picker component, allowing the user to choose a date for a new attendance record. 
5. Prevent the user from marking attendance for a date that has already been recorded and for a date past today on client side (also handled on server side).
6. Active navigation list, helping the user keep track of where they are in the application.
7. Client side form validation, preventing the user from submitting empty or incorrect information.
8. Show password functionality, allowing the user to show or hide their password entry.
9. Confirm password validation, making sure the user enters their password entry twice to confirm.
10. User login page.

Patterns/Methodologies:
1. Model View Controller: Mongoose models, Express/Javascript controllers, EJS views.
2. Express Router: Separate Class, Student, Teacher, and Attendance routing.
3. Reusable Views: Views are separated into reusable components/partials. State is passed top down.
4. Authorization: Express middleware to check if logged in first, then the type of user.

Main Technologies:
1. MongoDB: Database.
2. Mongoose: Database modeling.
3. Node: Back-end runtime.
4. Express: Server framework.
5. Joi: Server side user data validation
6. EJS: HTML templating
7. Bootstrap: Front-end framework
8. Javascript: Front-end scripting.
9. HTML/CSS: Markup and styling.
