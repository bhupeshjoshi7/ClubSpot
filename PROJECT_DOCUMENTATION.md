# ClubSpotPEC - Project Documentation

## Project Overview
**ClubSpotPEC** is a comprehensive web-based club recruitment and management platform designed for PEC (Punjab Engineering College). It enables cultural and technical clubs to recruit student members and manage club activities centrally. The platform connects students interested in joining clubs with club secretaries and coordinators who manage recruitment, applications, and club operations. It facilitates the entire club recruitment workflow from position postings to member application management.

---

## Problem Statement

### Identified Problems

1. **Fragmented Club Recruitment Process**
   - Students struggle to find and track multiple club opportunities in one place
   - Clubs lack a centralized platform to post open positions (roles) and manage student applications
   - No unified interface for club secretaries to manage member applications
   - Club activities and member information scattered across multiple platforms

2. **Lack of Student Profile Management**
   - Students cannot showcase their skills, interests, and achievements effectively
   - No standardized way for clubs to understand student capabilities
   - Difficulty matching students with suitable club roles

3. **Application Management Inefficiency**
   - Manual tracking of club membership applications is time-consuming
   - Clubs cannot easily view applicants for specific roles
   - No transparent application status updates for students
   - Lack of organization in managing club recruitment workflows
   - Difficulty in coordinating multiple clubs' recruitment processes

4. **Authentication and Security Issues**
   - No secure registration and login system for students and club management
   - User roles (student vs. club secretary) not properly differentiated
   - No proper access control for different user types

5. **Club Visibility & Discovery**
   - Students struggle to discover all available clubs at PEC
   - Difficulty understanding what roles each club is recruiting for
   - Clubs cannot effectively showcase their profiles and membership benefits

6. **Limited Communication Between Clubs and Students**
   - No centralized way to update students about their application status
   - Club secretaries cannot efficiently manage candidate responses
   - Lack of structured communication workflow for club activities and announcements

---

## How ClubSpotPEC Addresses These Problems

### 1. **Unified Club Recruitment Platform** ✅
**Solution:** Centralized web application serving as a single point for all club recruitment activities at PEC

- **For Students:**
  - Browse all available clubs and open roles in one place (Clubs page: `/clubs`)
  - View detailed club descriptions and role requirements (`/description/:id`)
  - Track club applications (`/appliedclubs`)
  - Receive real-time status updates on their applications
  - Discover both cultural and technical clubs at PEC

- **For Club Secretaries/Coordinators:**
  - Create and manage club profiles (`admin/companies`)
  - Post open roles for membership recruitment (`admin/position`)
  - Organize member roles under specific clubs
  - Access a complete database of all club listings and open positions
  - Centrally manage all club activities from one dashboard

---

### 2. **Student Profile Management** ✅
**Solution:** Comprehensive student profile system showcasing interests and qualifications

**Features:**
- User registration with role selection (Student/Club Secretary)
- Editable student profiles with:
  - Personal information (full name, email)
  - Student ID (SID)
  - Bio/About section
  - Skills and interests listing
  - Resume uploads (for club evaluation)
  - Profile photo with image upload via Cloudinary
  - Club association (which clubs they belong to)

**Implementation:**
- User model includes `profile` schema with extensible fields
- Profile update endpoint: `POST /api/user/profile/update`
- Image storage via Cloudinary integration for scalability
- Role-based profile customization for students vs. club management

---

### 3. **Efficient Club Member Application Management** ✅
**Solution:** Structured application workflow with status tracking for club recruitment

**Key Features:**

**For Students:**
- Apply to club roles with one click: `GET /api/application/apply/:id`
- View all club applications: `GET /api/application/get`
- Track application status in real-time
- See which clubs have reviewed their applications
- Update profile and interests before applying
- Easily browse and discover open club positions

**For Club Secretaries:**
- View all applicants for specific club roles: `GET /api/application/:id/applicants`
- Update application status: `POST /api/application/status/:id/update`
- Possible statuses: pending, accepted, rejected, interview scheduled
- Filter applicants by club role and position
- Review applicant profiles and skill sets
- Manage Applications dashboard (`admin/applications`)
- Coordinate member selection across multiple open positions

**Implementation:**
- Application model linking User, Club Role, and Club
- Application controller handling creation and status updates
- Proper referencing with MongoDB ObjectIds for data integrity
- Track club membership and role assignments

---

### 4. **Secure Authentication & Authorization** ✅
**Solution:** JWT-based authentication with role-based access control for students and club management

**Features:**
- Secure registration for students and club secretaries
- Secure login with email and password
- JWT token generation for session management
- Logout functionality with token invalidation
- Cookie-based session management
- Role-based middleware (`isAuthenticated`)
- Protected routes for students and club secretaries
- Separate dashboards for students vs. club management

**Protected Endpoints:**
- Student profile updates
- Club creation and management (club secretaries only)
- Club role postings (club secretaries only)
- Application submission (students only)
- Application management (club secretaries only)
- Applicant viewing (club secretaries only)

**Implementation:**
- Bcryptjs for password hashing
- JWT tokens for stateless authentication
- Cookie parser for secure token transmission
- Middleware: `isAuthenticated.js` for route protection
- Role-based access control distinguishing students from club management

---

### 5. **Club Discovery & Information Accessibility** ✅
**Solution:** Advanced search, filtering, and organization features for discovering clubs

**Frontend Components:**
- **Clubs Page** (`/clubs`): Browse all PEC clubs with available member roles
- **Filtercard Component**: Filter clubs and roles by:
  - Club name and type (cultural/technical)
  - Club category
  - Required skills/interests
  - Club focus area

- **Latest Clubs Section**: Display trending or recently active clubs
- **Club Description Page** (`/description/:id`): Detailed club information including:
  - Club overview and mission
  - Open positions/roles for recruitment
  - Club achievements and activities
  - Application requirements

**Backend Endpoints:**
- `GET /api/job/getAllJobs`: Retrieve all open club roles with filters
- `GET /api/job/get/:id`: Detailed club role information
- `GET /api/company/all`: Browse all PEC clubs with their profiles

---

### 6. **Structured Club-Student Communication** ✅
**Solution:** Centralized application status management and member communication

**Communication Features:**
- Real-time status updates on club applications
- Status types:
  - **Pending**: Application received, under review
  - **Accepted**: Student selected as club member
  - **Rejected**: Not selected in current round
  - **Interview Scheduled**: Student invited for club interview/selection round

- **For Students:**
  - Track all club application statuses (`/appliedclubs`)
  - See next steps clearly
  - Understand where they stand in club selection process
  - Get notified of status changes

- **For Club Secretaries:**
  - Update membership statuses efficiently
  - Communicate selection decisions quickly
  - Manage multiple applications across open roles
  - Coordinate member onboarding process

**Implementation:**
- Application status tracking
- Real-time updates on recruitment progress
- Centralized dashboard for club management activities

---

## Core Features Summary

### User Management
| Feature | Details |
|---------|---------|
| **Registration** | Students and Club Secretaries can create accounts |
| **Authentication** | JWT-based with bcrypt password hashing |
| **Profile Management** | Comprehensive profile with interests, skills, SID, photo |
| **Role-Based Access** | Student vs. Club Secretary permissions |

### Club Management
| Feature | Details |
|---------|---------|
| **Club Registration** | Club secretaries register and manage club profiles |
| **Club Details** | Club description, mission, type (cultural/technical), achievements |
| **Club Updates** | Edit and maintain club information and branding |
| **Club Visibility** | All clubs visible to students for discovery |

### Club Role Posting & Management
| Feature | Details |
|---------|---------|
| **Role Posting** | Club secretaries post open member roles (president, treasurer, etc.) |
| **Role Listing** | All open roles visible with filtering options |
| **Role Details** | Comprehensive role description and requirements |
| **Search & Filter** | Find clubs/roles by type, skills required, club name |

### Application Workflow
| Feature | Details |
|---------|---------|
| **Apply** | Students apply to club member roles |
| **View Applications** | Students track their club applications |
| **Manage Applicants** | Club secretaries view applicants per role |
| **Status Updates** | Track application status through selection pipeline |
| **Application History** | Complete record of all club applications |

### Admin Dashboard
| Feature | Details |
|---------|---------|
| **Manage Clubs** | Create, update club profiles and details |
| **Manage Roles** | Post and organize club member roles |
| **Manage Applications** | Review and update application statuses |
| **Club Analytics** | View all club and role data |

---

## Technology Stack

### Backend
- **Framework:** Express.js (Node.js)
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT, Bcryptjs
- **File Upload:** Multer, Cloudinary
- **Image Processing:** DataURI
- **Security:** Cookie Parser, CORS

### Frontend
- **Framework:** React 18.3.1
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI
- **State Management:** Redux with Redux Toolkit
- **Persistence:** Redux Persist
- **HTTP Client:** Axios
- **Routing:** React Router v6

### Additional Libraries
- **Icons:** Lucide React, React Icons
- **Utilities:** CLSX, Class Variance Authority
- **Themes:** Next-themes

---

## Project Structure

### Backend
```
backend/
├── index.js                 # Server entry point
├── controllers/             # Business logic
│   ├── user.controller.js
│   ├── company.controller.js
│   ├── job.controller.js
│   └── application.controller.js
├── routes/                  # API endpoints
│   ├── user.route.js
│   ├── company.route.js
│   ├── job.route.js
│   └── application.route.js
├── model/                   # Database schemas
│   ├── user.model.js
│   ├── company.model.js
│   ├── job.model.js
│   └── application.model.js
├── middlewares/             # Auth & file handling
│   ├── isAuthenticated.js
│   └── multer.js
└── utils/                   # Utilities
    ├── cloudinary.js
    ├── datauri.js
    └── db.js
```

### Frontend
```
frontend/
├── src/
│   ├── App.jsx              # Main router
│   ├── components/
│   │   ├── auth/            # Login, Signup
│   │   ├── admin/           # Admin dashboard
│   │   ├── Home.jsx
│   │   ├── Clubs.jsx
│   │   ├── Profile.jsx
│   │   └── ...
│   ├── hooks/               # Custom React hooks
│   ├── redux/               # State management
│   ├── utils/               # Utilities
│   └── assets/              # Images, files
```

---

## API Endpoints Summary

### User Routes
- `POST /api/user/register` - Register new user
- `POST /api/user/login` - User login
- `GET /api/user/logout` - User logout
- `POST /api/user/profile/update` - Update profile (authenticated)

### Company Routes
- `POST /api/company/register` - Register company (authenticated)
- `GET /api/company/get` - Get current user's company (authenticated)
- `GET /api/company/all` - Get all companies
- `GET /api/company/get/:id` - Get company by ID (authenticated)
- `PUT /api/company/update/:id` - Update company (authenticated)

### Job Routes
- `POST /api/job/post` - Post new job (authenticated)
- `GET /api/job/get` - Get admin's jobs (authenticated)
- `GET /api/job/getAllJobs` - Get all jobs
- `GET /api/job/get/:id` - Get job details

### Application Routes
- `GET /api/application/apply/:id` - Apply to job (authenticated)
- `GET /api/application/get` - Get user's applications (authenticated)
- `GET /api/application/:id/applicants` - Get applicants (authenticated)
- `POST /api/application/status/:id/update` - Update status (authenticated)

---

## Key Benefits

### For Students
1. ✅ Centralized club discovery platform for PEC
2. ✅ Professional profile building to showcase interests and skills
3. ✅ Easy application tracking across multiple clubs
4. ✅ Real-time status updates on club applications
5. ✅ Access to all PEC cultural and technical clubs
6. ✅ Clear understanding of club roles and requirements

### For Club Secretaries/Coordinators
1. ✅ Comprehensive club profile management
2. ✅ Easy member role posting and management
3. ✅ Efficient applicant tracking system
4. ✅ Quick status communication to candidates
5. ✅ Centralized applicant database for comparison
6. ✅ Filtering and search capabilities for selection

### For PEC Administration
1. ✅ Streamlined club recruitment process
2. ✅ Better coordination across all clubs
3. ✅ Centralized club activity management
4. ✅ Transparent club recruitment pipeline
5. ✅ Data insights on club memberships
6. ✅ Standardized club management processes

---

## Security Features

- **Password Security:** Bcryptjs hashing
- **API Protection:** JWT authentication on sensitive endpoints
- **Session Management:** Secure cookie-based sessions
- **File Upload:** Secured with Multer validation
- **CORS:** Configured to prevent unauthorized access
- **Role-Based Access:** Different permissions for students vs. recruiters
- **Data Validation:** Server-side validation on all inputs

---

## Future Enhancement Opportunities

1. Email/SMS notifications for application status updates
2. Club member verification and registration system
3. Club achievement and event tracking
4. Member skill endorsement system
5. Club analytics and reporting dashboard
6. Messaging system between club secretaries and members
7. Mobile application for easy access
8. Club event scheduling and management
9. Member portfolio and achievement showcase
10. Integration with college management system

---

## Conclusion

ClubSpotPEC successfully addresses the critical problems in club recruitment and management by providing:
- A unified, user-friendly platform for all PEC clubs
- Secure and efficient member recruitment processes
- Real-time communication and tracking between clubs and students
- Professional profile management for student members
- Streamlined member selection and onboarding workflows
- Centralized club activity management

The platform bridges the gap between students interested in joining clubs and club secretaries looking for active members, creating a transparent and efficient club management ecosystem at PEC.

---

**Version:** 1.0.0  
**License:** MIT  
**Author:** bhupeshjoshi7  
**Institution:** Punjab Engineering College (PEC)  
**Last Updated:** March 14, 2026
