# Munasiq - Edu-Activity Management Platform

![Munasiq Logo](./frontend/src/assets/logo/munaseq-logo-dark.svg)
### 🏫 Coordinating your Educational Activities, from A to Z

Munasiq is a comprehensive platform designed to streamline the creation, management, and participation in educational events. Whether it's lectures, workshops, or courses, Munasiq makes it easy to coordinate and join activities with ease.

---

## 🌟 Features

- **Event Creation**: Create and manage educational activities such as lectures, workshops, and courses.
- **Activity Details**: Add details like title, description, location, date, capacity, and more.
- **Joining Methods**: Allow open registration, request approval, QR code access, or invites.
- **Collaborative Management**: Invite others to co-manage events.
- **Seamless Communication**: Integrated messaging for participants, event creators, and managers.
- **Event Discovery**: Search and browse events based on interest, category, and creator.
- **Conflict Notifications**: Receive alerts for overlapping events.
- **Social Integration**: Share events via social media and follow event creators.

---

## 🎯 Key Stakeholders and Target Users

1. **Event Creators**: Manage and create activities with ease.
2. **Participants**: Discover and join events that match their interests.
3. **Administrators**: Oversee platform operations, manage reports, and ensure smooth functionality.

---

## 🛠️ Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/) – Modern React framework for optimized performance.
- **Backend**: [Nest.js](https://nestjs.com/) – A scalable Node.js framework for efficient server-side logic.
- **Database**: [PostgreSQL](https://www.postgresql.org/) – A robust, relational database for storing platform data.
- **Design**: [Figma](https://www.figma.com/) – Collaborative design tool for UI/UX mockups.
- **Version Control**: [GitHub](https://github.com/) – Version control and collaboration.

----

## 🚀 Getting Started

### Prerequisites

- **Node.js**: Ensure you have Node.js installed. [Download Node.js](https://nodejs.org/)
- **PostgreSQL**: Install and set up PostgreSQL for local development.
- **Git**: Version control system to clone and manage the repository. [Install Git](https://git-scm.com/).

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/munasiq.git

2. Initilize a copy of the DB and create a .env file to store the DB url:

3. Run the prisma commands to create the schema for your DB:
   npm install
   npx prisma migrate dev
   npx prisma generate
