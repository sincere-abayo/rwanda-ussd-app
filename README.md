# Rwanda USSD Application

A USSD application for Rwanda that provides various services information in both English and Kinyarwanda languages.

## Features

- Bilingual support (English and Kinyarwanda)
- Multi-level menu navigation
- Information about healthcare, education, and transportation services
- Contact information

## Technical Stack

- Node.js
- Express.js
- Africa's Talking USSD API
- Hosted on Render

## Setup and Installation

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
```

4. Start the application:
```bash
npm start
```

## Deployment to Render

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Use the following settings:
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Add the environment variables in the Render dashboard

## Africa's Talking Configuration

1. Log in to your Africa's Talking account
2. Create a new USSD service
3. Set the callback URL to your Render deployment URL + `/ussd` (e.g., `https://your-app.onrender.com/ussd`)
4. Use the provided service code when testing your USSD application

## Testing

You can test the USSD application using Africa's Talking simulator or by dialing the USSD code on a real device once the service is live.

## License

MIT
```

## Deployment Instructions for Render

1. First, create a Git repository and push your code:

```bash
git init
git add .
git commit -m "Initial commit"
```

2. Create a repository on GitHub and push your code:

```bash
git remote add origin https://github.com/yourusername/rwanda-ussd-app.git
git push -u origin main