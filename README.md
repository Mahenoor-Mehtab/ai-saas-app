# 🚀 AI SaaS Platform

A full-stack AI SaaS application built with Next.js that provides multiple AI-powered tools like conversation, code generation, image creation, music, and video generation.

---

## ✨ Features

* 💬 AI Conversation (Chat)
* 💻 Code Generation
* 🖼️ Image Generation
* 🎵 Music Generation
* 🎥 Video Generation
* 🔐 Authentication (Clerk)
* 📊 API Usage Limits
* 💳 Stripe Subscription (Pro Plan)
* ⚡ Modern UI with Tailwind CSS & ShadCN
* 🧠 Powered by OpenAI & Replicate APIs

---

## 🛠️ Tech Stack

* **Framework:** Next.js (App Router)
* **Frontend:** React, Tailwind CSS, ShadCN UI
* **Backend:** Next.js API Routes
* **Authentication:** Clerk
* **AI APIs:** OpenAI, Replicate
* **Payments:** Stripe
* **Deployment:** Vercel

---

## 📂 Project Structure

app/
├── (auth)/
├── (dashboard)/
├── api/
├── components/
├── lib/
├── hooks/

---

## ⚙️ Environment Variables

Create a `.env` file in the root and add:

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

OPENAI_API_KEY=
REPLICATE_API_TOKEN=

STRIPE_API_KEY=
STRIPE_WEBHOOK_SECRET=

NEXT_PUBLIC_APP_URL=http://localhost:3000

---

## 🚀 Getting Started

### 1. Clone the repository

git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name

### 2. Install dependencies

npm install

### 3. Run the development server

npm run dev

App will run at:
👉 http://localhost:3000

---

## 💳 Stripe Setup

* Create products & pricing in Stripe Dashboard
* Add webhook endpoint
* Update environment variables

---

## 🔐 Authentication Setup

* Create account on Clerk
* Add API keys in `.env`
* Enable authentication providers

---

## 📊 API Limit System

* Free users have limited usage
* Pro users get extended/unlimited access
* Usage is tracked and shown in UI

---

## 🌐 Deployment

Build the project:

npm run build

Or connect your GitHub repo to Vercel for automatic deployment.

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!