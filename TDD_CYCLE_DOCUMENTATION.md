# TDD Cycle Implementation: User Authentication & Course Management

## **User Stories Implemented**

### **Authentication Stories**

### 1. **As a user, I want to log out so that I can keep my account secure on shared devices**
-  Session invalidation on logout
-  Secure session management
-  Session expiration handling

### 2. **As a user, I want to log in so that I can access my dashboard**
-  Secure login with email/password
-  Session creation on successful login
-  Dashboard access with valid session

### 3. **As a visitor, I want to register with email & password so that my data is private**
- User registration with email validation
- Password hashing for security
- Duplicate email prevention

### **Course Management Stories**

### 4. **As a student, I want to create courses so that I can organize my studies**
- Course creation with validation
- Course data persistence
- Duplicate course prevention

### 5. **As a student, I want to delete courses so that I can remove outdated ones**
- Course deletion with confirmation
- Data integrity maintenance
- Error handling for non-existent courses

### 6. **As a student, I want to update course information so that I can keep it current**
- Course information updates
- Validation of updated data
- Persistence of changes

### **Assignment Management Stories**

### 7. **As a student, I want to create assignments so that I can track my work**
- Assignment creation with title and due date validation
- Default status set to "todo"
- Inline error handling for blank titles
- Preserve entered inputs on validation errors

### 8. **As a student, I want to view assignments ordered by due date so that I can prioritize my work**
- Assignments sorted by due date (nulls last)
- Display title, course, and due date
- Proper ordering for task prioritization

### 9. **As a student, I want to filter assignments so that I can focus on specific work**
- Filter by course, status, and due date range
- Apply multiple filters simultaneously
- Clear and intuitive filtering interface

### 10. **As a student, I want to update assignment status so that I can track progress**
- Change status from todo to in-progress to completed
- Status updates saved immediately
- Success confirmation messages
- Status persistence across sessions

##  **TDD Cycle Implementation**

### **RED Phase: Failing Tests**

#### **Authentication Tests**
```java
@Test
@DisplayName("RED: User should be able to register with email and password")
void testUserRegistration() {
    // Test fails - UserAuthenticationService doesn't exist yet
    // Test fails - UserRegistrationResult doesn't exist yet
    // Test fails - User entity doesn't exist yet
}
```

#### **Course Management Tests**
```java
@Test
@DisplayName("RED: Should create a course successfully with valid details")
void testCreateCourseSuccess() {
    // Test fails - CourseManagementService doesn't exist yet
    // Test fails - Course entity doesn't exist yet
    // Test fails - CourseRepository doesn't exist yet
}

@Test
@DisplayName("RED: Should not create a course with a blank name")
void testCreateCourseBlankName() {
    // Test fails - Validation logic doesn't exist yet
    // Test fails - Error handling not implemented
}
```

#### **Assignment Management Tests**
```java
@Test
@DisplayName("RED: Should create assignment successfully with valid details")
void testCreateAssignmentSuccess() {
    // Test fails - AssignmentManagementService doesn't exist yet
    // Test fails - Assignment entity doesn't exist yet
    // Test fails - AssignmentRepository doesn't exist yet
}

@Test
@DisplayName("RED: Should not create assignment with blank title")
void testCreateAssignmentBlankTitle() {
    // Test fails - Validation logic doesn't exist yet
    // Test fails - Error handling not implemented
}

@Test
@DisplayName("RED: Should list assignments ordered by due date")
void testListAssignmentsSortedByDueDate() {
    // Test fails - Sorting logic doesn't exist yet
    // Test fails - Repository methods not implemented
}

@Test
@DisplayName("RED: Should filter assignments by course and status")
void testFilterAssignmentsByCourseAndStatus() {
    // Test fails - Filtering logic doesn't exist yet
    // Test fails - Repository filtering not implemented
}

@Test
@DisplayName("RED: Should update assignment status successfully")
void testUpdateAssignmentStatus() {
    // Test fails - Status update logic doesn't exist yet
    // Test fails - Assignment update not implemented
}
```

### **GREEN Phase: Minimal Implementation**

#### **Authentication Classes**
```java
// Created minimal classes to make tests pass
public class UserAuthenticationService { /* minimal implementation */ }
public class User { /* basic entity */ }
public class UserRegistrationResult { /* result wrapper */ }
```

#### **Course Management Classes**
```java
// Created minimal classes to make tests pass
public class CourseManagementService { /* minimal implementation */ }
public class Course { /* basic entity */ }
public class CourseRepository { /* basic persistence */ }
public class CourseCreationResult { /* result wrapper */ }
```

#### **Assignment Management Classes**
```java
// Created minimal classes to make tests pass
public class AssignmentManagementService { /* minimal implementation */ }
public class Assignment { /* basic entity */ }
public class AssignmentRepository { /* basic persistence */ }
public class AssignmentCreationResult { /* result wrapper */ }
public class AssignmentStatusUpdateResult { /* result wrapper */ }
```

### **REFACTOR Phase: Code Improvement**

#### **Authentication Improvements**
-  Extracted password hashing logic
- Added proper error handling
- Implemented session management
-  Added security measures

#### **Course Management Improvements**
- Extracted validation logic
- Added proper error handling
- Implemented data persistence
- Added update functionality
- Enhanced error messages

#### **Assignment Management Improvements**
- Extracted assignment validation logic
- Added comprehensive filtering capabilities
- Implemented due date sorting with null handling
- Added status update functionality with persistence
- Enhanced error handling and user feedback
- Added overdue assignment detection
- Implemented assignment counting by status

##  **JUnit Test Coverage**

### **Authentication Test Categories:**
1. **Registration Tests**
   - Valid registration
   - Duplicate email handling
   - Password hashing verification

2. **Login Tests**
   - Valid credentials
   - Invalid credentials
   - Session creation

3. **Logout Tests**
   - Session invalidation
   - Security verification
   - Session expiration

4. **Dashboard Access Tests**
   - Valid session access
   - Invalid session rejection
   - User data retrieval

### **Course Management Test Categories:**
5. **Course Creation Tests**
   - Valid course creation
   - Blank name validation
   - Null name validation
   - Data persistence verification

6. **Course Deletion Tests**
   - Successful deletion
   - Non-existent course handling
   - Data integrity maintenance

7. **Course Update Tests**
   - Information updates
   - Data validation
   - Persistence verification

8. **Course Listing Tests**
   - Multiple course retrieval
   - Empty repository handling
   - Data consistency

### **Assignment Management Test Categories:**
9. **Assignment Creation Tests**
   - Valid assignment creation
   - Blank title validation
   - Null title validation
   - Null due date validation
   - Default status assignment

10. **Assignment Listing Tests**
    - Due date sorting (nulls last)
    - Assignment details display
    - Multiple assignment handling

11. **Assignment Filtering Tests**
    - Course-based filtering
    - Status-based filtering
    - Due date range filtering
    - Combined filter application

12. **Assignment Status Update Tests**
    - Successful status updates
    - Non-existent assignment handling
    - Empty status validation
    - Status persistence verification

13. **Assignment Analytics Tests**
    - Overdue assignment detection
    - Status-based counting
    - Total assignment counting


##  **Running the Tests**

```bash
# Run all tests
mvn test

# Run authentication tests only
mvn test -Dtest=UserAuthenticationTest

# Run course management tests only
mvn test -Dtest=CourseManagementTest

# Run assignment management tests only
mvn test -Dtest=AssignmentManagementTest

# Run with verbose output
mvn test -Dtest=UserAuthenticationTest -Dmaven.test.failure.ignore=true
```

##  **Test Results Expected**

### **Complete Test Suite Results**
```
[INFO] Running com.arqon.study.CourseManagementTest
[INFO] Tests run: 7, Failures: 0

[INFO] Running com.arqon.study.AssignmentManagementTest
[INFO] Tests run: 14, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.026 s
[INFO] Running com.arqon.study.UserAuthenticationTest
[INFO] Tests run: 9, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.014 s
[INFO] 
[INFO] Results:
[INFO] Tests run: 30, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
```

### **Individual Test Results**

#### **Authentication Tests (9 tests)**
- User registration with valid data
- User registration with duplicate email
- User login with valid credentials
- User login with invalid credentials
- Session creation on login
- Session invalidation on logout
- Session expiration handling
- Dashboard access with valid session
- Dashboard access with invalid session

#### **Course Management Tests (7 tests)**
- Course creation with valid details
- Course creation with blank name (validation)
- Course creation with null name (validation)
- Course deletion with existing course
- Course deletion with non-existent course
- Course listing with multiple courses
- Course update with valid data

#### **Assignment Management Tests (14 tests)**
- Assignment creation with valid details
- Assignment creation with blank title (validation)
- Assignment creation with null title (validation)
- Assignment creation with null due date (validation)
- Assignment listing sorted by due date
- Assignment details display
- Assignment filtering by course
- Assignment filtering by status
- Assignment filtering by due date range
- Assignment status update success
- Assignment status update for non-existent assignment
- Assignment status update with empty status
- Overdue assignment detection
- Assignment counting by status

## **Security Features Implemented**

1. **Password Hashing**: SHA-256 encryption
2. **Session Management**: Secure session creation/invalidation
3. **Session Expiration**: 24-hour session timeout
4. **Input Validation**: Email format and password requirements
5. **Error Handling**: Secure error messages without information leakage

## **Course Management Features Implemented**

1. **Data Validation**: Course name and code validation
2. **Data Persistence**: In-memory repository with CRUD operations
3. **Error Handling**: Comprehensive error messages for invalid operations
4. **Data Integrity**: Prevention of duplicate courses and invalid operations
5. **Update Functionality**: Full course information updates
6. **Repository Pattern**: Clean separation of data access logic

## **Assignment Management Features Implemented**

### **Core Functionality**
- ✅ **Assignment Creation** - Create assignments with title and due date validation
- ✅ **Assignment Listing** - View assignments sorted by due date (nulls last)
- ✅ **Assignment Filtering** - Filter by course, status, and due date range
- ✅ **Status Updates** - Change assignment status with persistence
- ✅ **Data Persistence** - In-memory storage with repository pattern

### **Validation & Error Handling**
- ✅ **Required Field Validation** - Title and due date are mandatory
- ✅ **Blank Title Handling** - Prevents creation with empty titles
- ✅ **Null Title Handling** - Prevents creation with null titles
- ✅ **Null Due Date Handling** - Prevents creation without due dates
- ✅ **Status Validation** - Ensures valid status updates
- ✅ **Error Messages** - Clear, descriptive error feedback

### **Advanced Features**
- ✅ **Due Date Sorting** - Assignments ordered by due date with nulls last
- ✅ **Multi-Filter Support** - Filter by course, status, and date range simultaneously
- ✅ **Overdue Detection** - Identify assignments past due date
- ✅ **Status Counting** - Count assignments by status
- ✅ **Default Status** - New assignments default to "todo" status

### **Technical Implementation**
- ✅ **Repository Pattern** - Clean separation of data access with filtering
- ✅ **Service Layer** - Business logic encapsulation
- ✅ **Result Objects** - Structured response handling for creation and updates
- ✅ **Entity Management** - Proper object lifecycle with timestamps
- ✅ **Test Coverage** - Comprehensive JUnit test suite (14 tests)

##  **TDD Benefits Demonstrated**

- **Confidence**: Tests ensure functionality works as expected
- **Documentation**: Tests serve as living documentation
- **Refactoring Safety**: Changes don't break existing functionality
- **Design Quality**: TDD leads to better code design
- **Regression Prevention**: Automated testing prevents bugs
