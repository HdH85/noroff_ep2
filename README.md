<img src="Frontend/doctors-appointment/public/EP2_logo.png" alt="alt text" width="100" height="100"> 

# Doctors Appointment

## Table of contents
- [About](#about)
- [Tech Stack](#tech-stack)
    - [Backend](#backend)
    - [Frontend](#frontend)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
    - [Clone the Repository](#1-clone-the-repository)
    - [Set up the backend](#2-set-up-the-backend)
    - [Set up the frontend](#3-set-up-the-frontend)
- [Reflection](#reflection)
- [References](#references)
  - [AI tools](#ai-tools)
  - [Noroff course assignments](#noroff-course-assignments)
  - [Noroff modules](#noroff-modules)
  - [Online sources](#online-sources)
  - [YouTube resources](#youtube-resources)
- [Development notes](#development-notes)

## About
The application is divided into separate frontend and backend applications.  
Starting with the backend, it's built on .NET Core using the Entity framework. The database is a SQL relational database. Since this is an application handling booking logic it requires a consistent and firm logic with strict relations to work reliably, so anything other than a SQL-type table is not on the table. The application is structured in such a way that the backend takes care of all the heavy lifting in terms of the booking logic, managing work hours for doctors, time slot allocation for the booking system etc. The frontend is there to provide a UI for the client, only realying the information provided and curated by the backend through the backends API endpoints, working as two entirely separate entities that speaks fluently with each other.

The frontend part is built using React, more specifically Next.js using Typescript with Tailwind for visual styling. Using a React framework means great flexibility and access to a wide community and ecosystem. As already mentioned, the frontend serves to mainly be a GUI for the client as information is sent to and from the backend. The frontend does no heavy lifting in terms of data handling, it only either reads and presents data from the backend or serves data to it.

By keeping the frontend and backend separate and working completely independent of each other gives you great modularity. Switching platforms for either side means the other stays unaffected and can be implemented with different frameworks without substantial rebuilds, futureproofing the application.

Application structure chart.
```text
your root directory/
├── Backend/DoctorsAppointment/
│   ├── Controllers/         # API endpoints
│   ├── Models/             # Database entities
│   ├── Services/           # Business logic
│   ├── Data/               # DbContext
│   ├── DTO/                # Data transfer objects
│   └── Migrations/         # EF migrations
└── Frontend/doctors-appointment/
    ├── app/                # Next.js pages
    ├── components/         # React components
    ├── modules/            # Server actions
    ├── lib/                # Constants and schemas
    └── proxy.ts            # Request proxy (token validation, first-visit redirect)
```

## Tech Stack

### Backend
- ASP.NET Core 10.0
- Entity Framework Core
- MySQL Database
- JWT Authentication

### Frontend
- Next.js 16.2.6
- TypeScript
- Tailwind CSS

## Prerequisites
To run the app you'll need to have the following installed:
- .NET 10.0 SDK
- Node.js 18+ and npm
- MySQL Server

## Installation & Setup
The application has a separate frontend and backend component that each require separate installation procedures. 

Follow the steps below:
### 1. Clone the Repository

```bash
git clone <repository-url>
cd aug25-ep2-HdH85
```

### 2. Set up the backend
Install the .NET application.

```bash
cd Backend/DoctorsAppointment

# Restore dependencies
dotnet restore

# Update appsettings.json with your MySQL connection string

# Apply database migrations
dotnet ef database update

# Run the backend
dotnet run
```
Make sure the appsettings.json file has the correct values.

Note: Values displayed below are just example data. Fill inn the values with your own required data.
```json
{
  "JwtSettings": {
    "SecretKey": "InserSecretKeyHere",
    "Issuer": "MyIssuer",
    "Audience": "MyAudience",
    "ExpiryMinutes": 60
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "ConnectionStrings": {
      "DefaultConnection": "server=localhost;database=DoctorsAppointment;user=root;password=Passw0rd1234"
  }
}
```
Create and push a database migration to create the database tables.
```bash
# Install dependencies
# Create new migration (if needed)
dotnet ef migrations add MigrationName

# Update database
dotnet ef database update
```
The backend uses Swagger for API documentation and access. Swagger can be accessed via (backendURL)/doc.
This gives you a complete overview of alle the API endpoints and allows authorized users to add, manipulate and remove data in the database.

To test the database structure there is a data.json file in the apps root directory. This contains correctly formatted seed data that can be used to test the API directly through Swagger and also populate the database in preparation for the API to interact with the frontend.
### 3. Set up the frontend
Start from the root directory and run the following commands in your terminal.
```bash
cd Frontend/doctors-appointment

# Install dependencies
npm install
```
You need to make a .env file. Use the .env.example as a template.
```sh
API_URL =
NEXT_PUBLIC_API_URL =
JWT_SECRET_KEY =
```
Once the relevant data has been added to the .env file, you're ready to run the app.
```bash
# Run the development server
npm run dev
```

## Reflection
I decided from the outset to start with developing the backend first, and get that to a working state before starting any kind of development on the frontend. This keeps the process predictable and manageable, as well as simplifying any work on the frontend later on as you know exactly what parameters you're working with in the API. I'd say the backend was at roughly 90% completion before any work was done on the frontend. As mentioned in the about section, I intended to make the backend bare the brunt of the data managing and handling - letting the frontend focus on simpler tasks, like just parsing and serving data to and from client and backend. With that said, my experience from the project has been that just because the tasks of an app seems simple at face value, doesn't mean that the logic underneath is always as straight forward.

The project overall has been a great learning experience - for frontend in particular, which hasn't been explored at length beforehand. I wanted the user experience to be pleasant and elegant, leading me to explore and research a lot of aspects of the React framework not covered by the curriculum. Lessons have also been learned from making the backend as well, such as more intricate table relations which again can lead to more complex data fetches.

Overall it's been a rewarding experience that's left me with an even deeper knowledge and understanding of both database structures and API building in general. But even more so lessons learned on presenting the data in creative and intuitive ways through frontend.

## References

### AI tools
#### Model - GitHub Copilot Chat running Claude Sonnet 4.5.
AI use in this project:
  - General syntax structure guidance. Several aspects of this project has presented challenges not being faced before and requiring solutions not yet tried and outside the scope of the curriculum. Getting guidance on general structure and syntax for these scenarios have cut down on development time and prevented potential dead end problem solving attempts.
  - Roadmapping. Setting up a list of priorities, helping to keep track of what's been done and what remains.
  - Cross-file checks for code consistency and potential syntax errors across files/folders.
  - Check for dead code. Check across files for potential dead code, typically after doing numerous iterations of functions.
  - Strategizing - Presenting my ideas and solutions and getting feedback on it's validity, potential weaknesses and how it might be improved.
  - Debugging and troubleshooting problematic code and error messages. Saving time on finding the break in the chain, especially with sequences spanning across not only multiple files, but also across folders.
  - Syntax and function structure guidance for longer more complex functions. Getting feedback on wrong syntax use and potential wrong sequuencing that can prematurely exit a function, making it fail to do it's intended job and breaking an event chain.
  - Check Swagger documentation comments in the controller files. Making sure the content is correct and giving json-formatted examples for inputs.

Areas of more notable AI assitance
- AppointmentService.ts in the services folder in the backend app. The functions in is this file involves some rather convoluted logic that can be hard to keep track of. AI helped me keep track of the correct tables to access, the correct queries to extract the correct data, and event sequencing, preventing a breakdown in the flow.
- AppointmentForm.tsx in components folder at the frontend. Since I wanted to use one single form as the basis for both new appointments and editing an existing one, setting up multiple states for deciding the formatting meant some somewhat complicated state handling, especially keeping track of where to put the parameter booleans to make the form behave as intended. Another area is the slot allocation.Getting assistanse with applying proper syntax and setting up the steps in a correct sequence, making sure that not only available slots are mapped, but also making sure that taken slots are removed from the pool to prevent potential double bookings.

### Noroff course assignments
- [Backend Technologies CA](https://github.com/noroff-backend-2/aug25ft-bet-ca-HdH85)
- [Frontend Technologies CA](https://github.com/noroff-backend-2/aug25-fts-ca-HdH85)

### Noroff Modules
- [Frontend Technologies 2](https://learning.noroff.no/course/section.php?id=1681#module-8853)
- [Backend Technologies](https://learning.noroff.no/course/section.php?id=1668)

### Online sources
- [Next.js](https://nextjs.org/)
- [Zod](https://zod.dev/)
- [Tailwind](https://tailwindcss.com/)
- [MDN](https://developer.mozilla.org/)
- [W3 schools](https://www.w3schools.com/)


### YouTube resources
- [All The ReactJS You Need To Know For NextJS](https://www.youtube.com/watch?v=Ycswfi9Sf6k)
- [All Relationships with Entity Framework & Code-First Migrations in .NET 9](https://www.youtube.com/watch?v=kMewc-TjO2s)
- [Build a .NET 10 Web API from Scratch (Controllers, EF Core, SQL Server, DTOs)](https://www.youtube.com/watch?v=RwQVRXEs370)
- [How to enable Swagger UI in Web API project for .NET 9 or 10](https://www.youtube.com/watch?v=6EeimuAptSI)

## Development notes

The frontend is configured to run with Turbopack in development mode. 
Due to the use of `force-dynamic` rendering and server-side data fetching, 
frequent recompilation may be visible in the Next.js dev indicator — 
this is expected behaviour in development and won't occur in a production build.