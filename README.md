Here's a `README.md` template you can use for your GitHub project **"Incognito Inbox"**:
![GitHub last commit](https://img.shields.io/github/last-commit/dishax2510/Incognito-Inbox)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Contributors](https://img.shields.io/github/contributors/dishax2510/Incognito-Inbox)

---

![image](https://github.com/user-attachments/assets/aa412749-ae66-4e5b-b3f1-598341fcad17)

![image](https://github.com/user-attachments/assets/2336d2a6-908c-42bc-93ef-7d266b706d83)

![image](https://github.com/user-attachments/assets/0dbb9a12-f4a4-489e-a429-e4c487ea606b)

![image](https://github.com/user-attachments/assets/57d1b291-ef7f-4a5e-b46e-786468a1c2a2)

![image](https://github.com/user-attachments/assets/0533bbb3-9bb9-477e-ada0-7fad5f8c15e0)


```markdown
# 📧 Incognito Inbox

Incognito Inbox is a secure, minimal email-based login system designed with privacy in mind. It allows users to authenticate using an OTP sent to their email—without the need for traditional passwords.

---

##  Features

-  Password-less authentication using OTP
-  Email-based login flow
-  Frontend built with React
-  Backend using Node.js and Express
-  Axios for client-server communication

---

## 🏗Project Structure

```

incognito-inbox/
│
├── frontend/              # React app
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── index.js
│   ├── package.json
│
└── backend/               # Express backend
├── controllers/
├── routes/
├── server.js
└── package.json

````

---

## ⚙Installation

### Prerequisites

- Node.js & npm installed
- Working internet connection


### 2. Install frontend dependencies

```bash
cd frontend
npm install
```

### 3. Install backend dependencies

```bash
cd ../backend
npm install
```

---

## Running the Application

### Start backend server

```bash
cd backend
node server.js
```

### Start frontend (React)

```bash
cd ../frontend
npm start
```

---

##  Technologies Used

* **React** – Frontend UI
* **Node.js & Express** – Backend API
* **Axios** – HTTP Client
* **nodemailer** – Email service for OTP
* **dotenv** – Environment variable handling

---

## 🛡Security Considerations

* OTPs expire after a short time (configurable)
* Input validation and sanitization on both ends
* Password-less design = reduced attack surface

---

##  License

This project is licensed under the MIT License.

```

---







