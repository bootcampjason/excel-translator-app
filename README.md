# 🌍 Excel Translator App    
**FileSpeak** translates spreadsheets in one step
Upload & download your translated excel file with its layout, merged cells, or embedded objects preserved.
👉 [Try the live version](https://filespeak.net) (SSL Certificate)
<br />
<br />
## What Makes This App Unique

**One-Step AI Translation**  
Upload any `.xls` or `.xlsx` file — and get a translated version in seconds using OpenAI GPT-4o.

**Preserves Layout & Formatting**  
Original fonts, merged cells, column widths, images, and sheet structure are all retained.

**Works With Multi-Sheet Files**  
Each sheet in the workbook is translated — not just the first one.

**Supports Multiple File Uploads**  
Translate many Excel files at once in parallel with clear per-file progress tracking.

**Character-Based Usage Limit**  
Free and paid plans intelligently enforce monthly character quotas using Firebase.

**Seamless Authentication**  
Google and Email login support out of the box.

**Paywall-Ready with Stripe**  
Users can upgrade their plan and pay securely through Stripe Checkout.

**Deployed & Scalable**  
Frontend on Vercel. Backend on Render.

---

## Tech Stack
| Layer       | Tools / Services                                 |
| ----------- | ------------------------------------------------ |
| Frontend    | React, Material UI, Firebase Auth, Stripe.js     |
| Backend     | Flask, OpenAI GPT-4o, Firebase Admin SDK, Stripe |
| Excel Tools | openpyxl, xlwings, SheetJS (XLSX.js)             |
| Hosting     | Vercel (Frontend), Render (Backend)              |

<br />  

## Getting Started

### 1. Clone the repo ###
```
git clone https://github.com/bootcampjason/excel-translator-app.git
cd excel-translator-app
```

### 2. Frontend ###
```
cd frontend
npm install
```
Create .env in frontend root directory (frontend/)
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_FIREBASE_API_KEY=...
REACT_APP_FIREBASE_AUTH_DOMAIN=...
REACT_APP_FIREBASE_PROJECT_ID=...
REACT_APP_FIREBASE_APP_ID=...
REACT_APP_FIREBASE_MEASUREMENT_ID=...
REACT_APP_STRIPE_PUBLISHABLE_KEY=...
REACT_APP_STRIPE_STARTER_PRICE_ID=...
REACT_APP_STRIPE_PRO_PRICE_ID=...
```
Then run:
```
npm start
```

### 3. Backend ###
```
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```
Create .env in root backend root directory (backend/)
```
OPENAI_API_KEY=your_openai_key
STRIPE_SECRET_KEY=your_stripe_secret_key
GOOGLE_APPLICATION_CREDENTIALS=path/to/firebase-adminsdk.json
```
Then run:
```
python app.py
```

---
## About the Developer
Hi, I’m Jason Cho — a full-stack engineer passionate about building real-world apps with AI, automation, and security.

**Website**: [Click](https://filespeak.net)  
**LinkedIn**: [Click](https://www.linkedin.com/in/jasoncho529/)  
**Email**: jcsungchan@gmail.com


