# ResumAI

ResumAI is an AI-powered resume optimization tool that helps job seekers transform rough experience descriptions into strong, professional resume bullet points and tailored resumes for specific job descriptions.

The goal of this project is to make resume writing faster, clearer, and more optimized for modern hiring processes.

---

## Features

### AI Resume Bullet Generator
Convert raw work experience into polished resume bullet points.

Example:

Input:

"helped customers, handled payments, answered questions, managed returns"

Output:

• Managed high-volume customer transactions while maintaining accurate payment processing and cash-handling procedures  
• Assisted customers with product inquiries, purchases, and returns while maintaining strong service standards  
• Maintained organized store operations and supported efficient checkout processes during peak hours  

---

### Bullet Editing Workflow
Generated bullets can be:

• edited directly  
• regenerated individually  
• copied to clipboard  
• copied all at once  

---

### Resume Tailoring (Upcoming Feature)

Users will be able to:

• upload a PDF resume  
• paste a job description  
• generate a tailored version of their resume

The system will return:

• improved professional summary  
• optimized experience bullet points  
• suggested keywords to include  
• skills to highlight for the role  

---

## Tech Stack

### Frontend
React Native  
Expo  
Expo Router  

### Backend
Node.js  
Express  

### AI
OpenAI API for language generation and resume optimization


---

## How It Works

1. User enters job title and raw experience
2. App sends request to backend
3. Backend calls the OpenAI API
4. AI generates structured resume bullets
5. Results are returned and displayed in the mobile app

---

## Future Improvements

• Resume PDF upload  
• Resume tailoring for job descriptions  
• ATS keyword analysis  
• Resume scoring system  
• Export optimized resume  

---

## Running the Project

### Install dependencies

Frontend:

npm install

Backend:

cd backend
npm install


---

### Start backend

node server.js

---
### Start the Expo app

npx expo start

Open the project using **Expo Go**.

---

## Purpose of the Project

This project was built as a portfolio application demonstrating:

• React Native mobile development  
• AI integration  
• backend API design  
• UX design for productivity tools  

---

## Author

Created by Evan Buchanan

Computer Science Student @ UOttawa
