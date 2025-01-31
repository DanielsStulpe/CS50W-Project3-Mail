# CS50 Web - Project 3 - Mail

## Overview
Mail is a single-page web application that functions as an email client. Users can send and receive emails, archive messages, and reply to received emails. The application interacts with a Django backend via API calls and dynamically updates the UI using JavaScript.

## Features
- **Inbox, Sent, and Archive Views**: Users can navigate between different mailboxes.
- **Compose Email**: Users can create and send emails to registered users.
- **View Email**: Users can click an email to view its contents.
- **Mark as Read/Unread**: Emails are marked as read when opened.
- **Archive/Unarchive Emails**: Users can archive and unarchive emails.
- **Reply to Emails**: Users can reply to received emails with pre-filled recipient, subject, and body fields.

## Getting Started
### Prerequisites
Ensure you have Python and Django installed.

### Setup
1. Clone the repository:
   ```sh
   git clone <repository_url>
   cd mail
   ```
2. Run database migrations:
   ```sh
   python manage.py makemigrations mail
   python manage.py migrate
   ```
3. Start the Django development server:
   ```sh
   python manage.py runserver
   ```
4. Open your browser and navigate to `http://127.0.0.1:8000/`.

## API Endpoints
The application interacts with the backend using the following API routes:

- **GET /emails/<mailbox>**: Retrieves emails in a specified mailbox (`inbox`, `sent`, `archive`).
- **GET /emails/<email_id>**: Fetches details of a specific email.
- **POST /emails**: Sends an email with recipients, subject, and body.
- **PUT /emails/<email_id>**: Updates an email's read or archived status.

## JavaScript Functionality
All frontend logic is contained in `mail/static/mail/inbox.js`, including:
- Handling navigation between different mailboxes.
- Sending emails using `fetch` requests.
- Displaying email contents dynamically.
- Marking emails as read/unread.
- Implementing archiving/unarchiving functionality.
- Pre-filling fields for email replies.

## How It Works
- The main page dynamically loads different views using JavaScript.
- Clicking a button (`Inbox`, `Sent`, `Archive`, `Compose`) updates the UI without reloading the page.
- Emails are retrieved and displayed as lists, and clicking an email reveals its full content.
- Users can send and receive emails, which are stored in the database.

## Requirements
- Python 3
- Django
- JavaScript (fetch API for handling requests)

## Future Enhancements
- Add pagination for emails.
- Improve UI with additional styling.
- Implement search functionality.

## License
This project is part of the CS50W course and follows its guidelines.

