# Rwanda USSD Application Database Schema

## Users Table

Stores information about users who have accessed the USSD service.

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key, auto-increment |
| phoneNumber | STRING | User's phone number (unique) |
| language | ENUM('en', 'rw') | User's preferred language |
| lastAccessed | DATE | Last time the user accessed the service |
| createdAt | DATE | Record creation timestamp |
| updatedAt | DATE | Record update timestamp |

## Sessions Table

Stores active USSD sessions.

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key, auto-increment |
| sessionId | STRING | USSD session ID (unique) |
| phoneNumber | STRING | User's phone number |
| level | STRING | Current menu level |
| language | ENUM('en', 'rw') | Session language |
| history | TEXT | JSON array of previous menu levels |
| lastActivity | DATE | Last activity timestamp |
| createdAt | DATE | Record creation timestamp |
| updatedAt | DATE | Record update timestamp |

## Services Table

Stores information about services available in Rwanda.

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key, auto-increment |
| name_en | STRING | Service name in English |
| name_rw | STRING | Service name in Kinyarwanda |
| category | ENUM('healthcare', 'education', 'transportation') | Service category |
| description_en | TEXT | Service description in English |
| description_rw | TEXT | Service description in Kinyarwanda |
| contact | STRING | Contact information |
| location | STRING | Service location |
| createdAt | DATE | Record creation timestamp |
| updatedAt | DATE | Record update timestamp |

## Relationships

- Users to Sessions: One-to-Many relationship based on phoneNumber
```

## 8. Create Menu Flow Documentation

```markdown:docs/menu-flow.md
# Rwanda USSD Application Menu Flow

## Main Menu (Welcome)
- 1: Find Services
- 2: Contact Us
- 3: Change Language (English/Kinyarwanda)

## Find Services Menu
- 1: Healthcare
- 2: Education
- 3: Transportation
- 4: Back to Main Menu

## Healthcare Menu
- 1: Find a Hospital
- 2: Emergency Numbers
- 3: Back

### Find a Hospital
- Lists hospitals from database
- Option to go back

### Emergency Numbers
- Displays emergency contact numbers
- Option to go back

## Education Menu
- 1: Schools
- 2: Universities
- 3: Back

### Schools
- Lists schools from database
- Option to go back

### Universities
- Lists universities from database
- Option to go back

## Transportation Menu
- 1: Public Transport
- 2: Taxi Services
- 3: Back

### Public Transport
- Lists public transport options from database
- Option to go back

### Taxi Services
- Lists taxi services from database
- Option to go back

## Contact Us Menu
- Displays contact information
- 1: Back to Main Menu
```

## 9. Create Error Handling Middleware

```javascript:middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  
  if (req.path === '/ussd') {
    // For USSD requests, return a user-friendly message
    res.contentType('text/plain');
    res.send('END An error occurred. Please try again later.');
  } else {
    // For other API requests, return a JSON error
    res.status(500).json({
      error: 'Internal Server Error',
      message: process.env.NODE_ENV === 'production' 
        ? 'An unexpected error occurred' 
        : err.message
    });
  }
};

module.exports = errorHandler;
```

## 10. Update the Main Server File to Include Error Handling

```javascript:index.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ussdController = require('./controllers/ussdController');
const { initDatabase } = require('./utils/dbInit');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize database
initDatabase().then(() => {
  console.log('Database initialized');
}).catch(err => {
  console.error('Database initialization failed:', err);
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.post('/ussd', ussdController.handleUSSD);

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).send('USSD Service is running!');
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## 11. Create a Dockerfile for Containerization

```dockerfile:Dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

## 12. Create a Docker Compose File for Local Development

```yaml:docker-compose.yml
version: '3'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    depends_on:
      - db
    environment:
      - PORT=3000
      - DB_HOST=db
      - DB_USER=root
      - DB_PASSWORD=password
      - DB_NAME=rwanda_ussd
      - DB_PORT=3306
    volumes:
      - .:/app
      - /app/node_modules

  db:
    image: mysql:8.0
    ports:
      - "3306:3306"
    environment:
      - MYSQL_ROOT_PASSWORD=password
      - MYSQL_DATABASE=rwanda_ussd
    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:
```

## 13. Update the README with Comprehensive Documentation

```markdown:README.md
# Rwanda USSD Application

A USSD application for Rwanda that provides various services information in both English and Kinyarwanda languages.

## Features

- Bilingual support (English and Kinyarwanda)
- Multi-level menu navigation
- Information about healthcare, education, and transportation services
- Contact information
- Database integration for dynamic content
- Session management

## Technical Stack

- Node.js
- Express.js
- MySQL (with Sequelize ORM)
- Africa's Talking USSD API
- Hosted on Render

## Database Schema

The application uses a MySQL database with the following tables:
- Users: Stores user information and preferences
- Sessions: Manages USSD session state
- Services: Stores information about services in Rwanda

For detailed schema information, see [Database Schema](docs/database-schema.md).

## Menu Flow

The USSD application has a hierarchical menu structure:
- Main Menu
  - Find Services
    - Healthcare
    - Education
    - Transportation
  - Contact Us
  - Change Language

For detailed menu flow, see [Menu Flow](docs/menu-flow.md).

## Setup and Installation

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v8.0 or higher)

### Local Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/rwanda-ussd-app.git
cd rwanda-ussd-app
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with the following variables:
```
PORT=3000
AFRICAS_TALKING_API_KEY=your_api_key_here
AFRICAS_TALKING_USERNAME=your_username_here
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=rwanda_ussd
DB_PORT=3306
```

4. Initialize the database:
```bash
npx sequelize-cli db:create
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

5. Start the application:
```bash
npm start
```

### Using Docker

1. Make sure Docker and Docker Compose are installed
2. Run the application:
```bash
docker-compose up
```

## Deployment to Render

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Use the following settings:
   - Build Command: `npm install && npx sequelize-cli db:migrate && npx sequelize-cli db:seed:all`
   - Start Command: `npm start`
4. Add the environment variables in the Render dashboard
5. Set up a MySQL database (either on Render or another provider)

## Africa's Talking Configuration

1. Log in to your Africa's Talking account
2. Create a new USSD service
3. Set the callback URL to your Render deployment URL + `/ussd` (e.g., `https://your-app.onrender.com/ussd`)
4. Use the provided service code when testing your USSD application

## Testing

### Local Testing with Thunder Client

1. Install Thunder Client extension in VS Code
2. Create a new request:
   - Method: POST
   - URL: http://localhost:3000/ussd
   - Headers: Content-Type: application/x-www-form-urlencoded
   - Body (Form):
     - sessionId: 12345
     - serviceCode: *123#
     - phoneNumber: +250700000000
     - text: (varies based on menu navigation)

### Testing with Africa's Talking Simulator

1. Log in to your Africa's Talking account
2. Navigate to the USSD section
3. Use the simulator with your service code

## License

MIT
```

## 14. Create a Script for Database Backup

```javascript:utils/dbBackup.js
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Create backups directory if it doesn't exist
const backupDir = path.join(__dirname, '../backups');
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir);
}

// Generate filename with timestamp
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const filename = path.join(backupDir, `backup-${timestamp}.sql`);

// MySQL connection details from environment variables
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

// Construct mysqldump command
const command = `mysqldump -h ${DB_HOST} -u ${DB_USER} -p${DB_PASSWORD} ${DB_NAME} > ${filename}`;

// Execute backup
exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  console.log(`Database backup created: ${filename}`);
  
  // Clean up old backups (keep only the last 5)
  fs.readdir(backupDir, (err, files) => {
    if (err) {
      console.error(`Error reading backup directory: ${err.message}`);
      return;
    }
    
    // Sort files by creation time (oldest first)
    files = files
      .filter(file => file.endsWith('.sql'))
      .map(file => ({
        name: file,
        time: fs.statSync(path.join(backupDir, file)).mtime.getTime()
      }))
      .sort((a, b) => a.time - b.time);
    
    // Delete all but the 5 most recent backups
    if (files.length > 5) {
      files.slice(0, files.length - 5).forEach(file => {
        fs.unlinkSync(path.join(backupDir, file.name));
        console.log(`Deleted old backup: ${file.name}`);
      });
    }
  });
});
```

## 15. Add the Backup Script to Package.json

```bash
npm pkg set scripts.backup="node utils/dbBackup.js"
```

## 16. Create a Script for Running Database Migrations on Render

```bash:bin/render-build.sh
#!/usr/bin/env bash
# Exit on error
set -o errexit

npm install
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

Make the script executable:

```bash
chmod +x bin/render-build.sh
```

## 17. Update Render Configuration

```yaml:render.yaml
services:
  - type: web
    name: rwanda-ussd-app
    env: node
    buildCommand: ./bin/render-build.sh
    startCommand: npm start
    envVars:
      - key: PORT
        value: 10000
      - key: AFRICAS_TALKING_API_KEY
        sync: false
      - key: AFRICAS_TALKING_USERNAME
        sync: false
      - key: DB_HOST
        sync: false
      - key: DB_USER
        sync: false
      - key: DB_PASSWORD
        sync: false
      - key: DB_NAME
        sync: false
      - key: DB_PORT
        value: 3306

databases:
  - name: rwanda_ussd_db
    plan: starter