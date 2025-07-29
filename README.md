Setup: Instructions to Get Started

1. Prerequisites
   Ensure the following tools and dependencies are installed, Node.js: Version 16 or
   later, npm: Comes with Node.js, MongoDB: You’ll need a MongoDB instance to
   store data.
2. Clone the repository
   - Navigate to the URL below which will bring you to our source repository:
     https://github.com/neu-cs4530/fall24-project-fall24-team-project-group-506
   - Then clone the repository using the web URL or an SSH key
3. Configure the database
   - Update the MongoDB connection string in the environment configuration file
     MONGO_URI=mongodb+srv://luad:wW4NhEbhMTYx9fah@db-cs4530-f24-
     506.el68d.mongodb.net/
   - To avoid issues with the outdated database schema, remove the existing database
     and repopulate it
4. Populate the database with the updated schema
   - First navigate to the server: cd server
   - Run the populate script: npx ts-node populate_db.ts
     mongodb+srv://luad:wW4NhEbhMTYx9fah@db-cs4530-f24-
     506.el68d.mongodb.net/fake_so
5. Set up the server
   - In the server directory install the required dependencies, run npm install
   - Next, start the server: npx ts-node server.ts
6. Set up the client
   - Navigate to the client directory: cd client
   - Install the client dependencies: npm install
   - Start the client: npm run start
7. Enjoy!
   Open a browser and navigate to the client URL: http://localhost:3000. Interact with
   the application features: Log in using Google OAuth and use the live chat feature
   and personal collections. Access the deployed version of the application at:
   https://cs4530-f24-506.onrender.com/
