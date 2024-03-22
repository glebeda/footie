# Footie: Your Football Organizer

Footie is a web application designed to make organizing football games with friends easier and more efficient. It allows users to join games, create new matches, and manage football events seamlessly.

<img width="585" alt="image" src="https://github.com/glebeda/footie/assets/32038177/079ac0c8-c31c-4c66-b0af-6a0ac7fa044a">

## Features

- **Game Creation:** Create football games specifying the date, time, and location.
- **Sign Up:** Easily sign up for upcoming games and see who else is attending.
- **Admin Panel:** Manage games, including cancelling upcoming matches.
- **Responsive Design:** Use Footie on any device, anytime, anywhere.

## Tech Stack

- **Frontend:** React, Material-UI
- **Backend:** Node.js, Express, DynamoDB
- **Deployment:** AWS Elastic Beanstalk (Backend), Amazon S3 (Frontend), CloudFront

## Getting Started

### Prerequisites

- Node.js
- npm or yarn
- AWS Account

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-github-username/footie.git
cd footie
```

2. Install dependencies for the backend:

```bash
cd backend
npm install
```

3. Set up your .env file according to the .env.example.

4. Start the backend server:

```bash
npm start
```

5. Install dependencies for the frontend:

```bash
cd ../frontend
npm install
```

6. Start the frontend application:

```bash
npm start
```

Now, navigate to http://localhost:3000 to see your Footie app in action!
