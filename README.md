OVERVIEW: ReciPals is a social recipe-sharing web application where users can share, discover, and save recipes. The application is pre-loaded with 300+ recipes fetched from TheMealDB API (https://www.themealdb.com/) attributed to "recipeBot" to provide immediate content for users to explore.

CORE FEATURES:
- Home
  - Loads recipe post feed (login not required)
  - Loads followers’ posts first (login required) 
- Login and Signup
  - Login with username and password
  - Signup required information include name, username, password, and tags 
-  Profile
  - Display and edit profile information
  - Display user posts and saved recipes 
  - Follow and unfollow users (login required) 
- Search 
  - Search recipes by name, ingredient, tags (login not required)
  - Search users by name and username (login not required)
- Recipe and Post 
  - Create and edit recipes (login required) 
  - View complete recipe details, including name, photo, ingredients, instructions, total time, and serving (login not required)
  - Interact with posts: like and comment (login required)
  - Save recipes (login required) 
- Admin Management
  - Admin user type required
  - Update user role types and delete users
  - Edit and delete recipes and posts 

This codebase provides the back-end implementation of ReciPals built with Node.js and Express. See repository for the front-end implementation with TypeScript and React: https://github.com/jasminduong/recipals 

RUNNING THE APP: 
To run the app on the server: https://recipals.netlify.app/ 

To run the node.js and express app (back-end) locally: 
1) Clone the repository, run on your terminal:
    git clone https://github.com/jasminduong/recipals-node-server-app.git
    cd recipals-node-server-app
2) Install dependencies
    npm install
3) Create an .env file with required variables:
        MONGODB_URI=mongodb://localhost:27017/recipals SESSION_SECRET=your-session-secret 
PORT=4000
4) Start the development server, run on your terminal:
    nodemon index.js
    Server with run on http://localhost:4000

**The frontend React application connects to this backend. See the React frontend repository for frontend setup instructions: https://github.com/jasminduong/recipals 

KEY COMPONENTS:
- API Routes: Express.js routes that handle HTTP requests and responses
    - User routes for authentication, profile management, and user operations
    - Recipe routes for recipe CRUD operations and recipe-related functionality
    - Post routes for recipe CRUD operations and post-related functionality

- Data Models: Mongoose schemas that define data structure and validation
    - User model with authentication, profile, and social features
    - Recipe model with recipe details and metadata
    - Post model with post details and metadata

- Database Access Objects (DAOs): Data access layer that handles database operations
    - User DAO for user-related database operations
    - Recipe DAO for recipe data management
    - Post DAO for post and social interaction data
- Database Integration: MongoDB database with Mongoose ODM for data persistence
    - User collection for storing user accounts and profiles
    - Recipe collection for storing recipe data
    - Post collection for storing social posts and interactions

Schema Validation: Mongoose schemas that enforce data structure and validation rules
    - User schema with authentication and profile validation
    - Recipe schema with recipe content validation
    - Post schema with social content validation

KEY SUB-COMPONENTS:
- Database Layer: MongoDB collections and data models
    - Database/index.js: Main database configuration and connection setup
    - Database/posts.js: Post data seeding and initial data
    - Database/recipes.js: Recipe data seeding and initial data
    - Database/users.js: User data seeding and initial data

- Posts Module: Social posting and interaction functionality
    - Posts/dao.js: Data access object for post operations
    - Posts/model.js: Mongoose model for post data structure
    - Posts/routes.js: Express routes for post API endpoints
    - Posts/schema.js: Mongoose schema for post validation

- Recipes Module: Recipe management and operations
    - Recipes/dao.js: Data access object for recipe operations
    - Recipes/model.js: Mongoose model for recipe data structure
    - Recipes/routes.js: Express routes for recipe API endpoints
    - Recipes/schema.js: Mongoose schema for recipe validation

- Users Module: User authentication and profile management
    - Users/dao.js: Data access object for user operations
    - Users/model.js: Mongoose model for user data structure
    - Users/routes.js: Express routes for user API endpoints
    - Users/schema.js: Mongoose schema for user validation

- Configuration: Server configuration and environment setup
    - .env: Environment variables for database and server configuration

SOURCE ORGANIZATION: The main application structure is organized as follows:
- Main Application:
    - Server entry point: index.js

- Database Layer:
    - Database configuration: Database/index.js
    - Initial data: Database/posts.js, Database/recipes.js, Database/users.js

- API Modules:
    - Posts API: Posts/dao.js, Posts/model.js, Posts/routes.js, Posts/schema.js
    - Recipes API: Recipes/dao.js, Recipes/model.js, Recipes/routes.js, Recipes/schema.js
    - Users API: Users/dao.js, Users/model.js, Users/routes.js, Users/schema.js

- Configuration:
    - Environment variables: .env
