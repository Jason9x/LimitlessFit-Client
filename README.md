# LimitlessFit Web Application

LimitlessFit is a rich web application for fitness management, offering authentication, notifications, localization, real-time updates, and order management features.

## Features

- **Authentication**: Token-based safe login and registration.
- **Real-time Notifications**: Real-time notification for users for important updates.
- **Localization**: Support for multiple languages in order to provide users with a personalized experience according to their chosen language.
- **Websockets**: Real-time interaction for live updates and notifications.
- **User Management**: Admin dashboard to handle users and roles, proper access control.
- **Order Management**: Proper system for order and transaction management for fitness.

## Installation

### Prerequisites

- Node.js
- NPM

### Clone the repository

```bash
git clone https://github.come/lJason9/LimitlessFit.git
cd LimitlessFit
```

### Install Dependencies

```bash
npm install
```

### Running the Application

To run the application in development mode:

```bash
npm run dev
```

To build the application for production:

```bash
npm run build
```

## Usage

### Authentication

1. Register an account through the registration page.
2. Login to the account.
3. On successful login, JWT token will be transmitted for authentication.

### User Management

Admins will be able to manage user role and permissions via the admin panel for enabling access control.

### Notifications

Users will receive real-time notifications, such as order updates and system notifications, via websockets.

### Orders Management

Users can order fitness-related services or products. Admins will be able to handle and process orders via the admin panel.

## License

This project is published under the MIT License - see the [LICENSE](LICENSE) file for details.
