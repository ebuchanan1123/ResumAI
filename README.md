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



# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
