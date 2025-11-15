# Woltie — AI-Powered Local Food Discovery

Wolt’s mission is to make cities better — but local commerce breaks down when customers can’t solve the menu mystery. Our team has experienced this firsthand while living abroad: menu names and photos often fail to convey what a dish actually tastes like, how it’s prepared, or how it compares to foods we already know. This gap leads to repetitive “safe choices,” limiting users from exploring the rich, authentic food culture around them.

Woltie is our solution: an AI-powered food-navigation companion that makes discovery intuitive, personal, and fun.

## 🔍 What Woltie Does
### Multi-modal dish intelligence

Woltie analyzes dish photos and descriptions on Wolt to break down flavors, textures, and ingredients. It then generates personalized taste profiles and “taste-a-like” comparisons (e.g., “This is similar to Korean bibimbap but creamier and mildly spicy”) — giving users the confidence to try something new.

### Reverse dish search

Users can describe a dish they’ve tried before — even if they forgot its name — and Woltie finds the closest match. A query like “cheesy baked eggplant dish” instantly connects them to Melanzane alla Parmigiana, transforming vague cravings into real orders.

## 👥 Team

This project was created by:
Annalina Wheeler, Ansley Fowler, Ruikang Tao, Shuaijie Peng, and Ting-Chen Yen — ranked alphabetically by first name.

## 🧰 Tech Stack
### ☁️ Google Cloud Platform (GCP) - **For best use of Google Cloud tech challenge**

Our solution makes extensive and purposeful use of Google Cloud services:

**Generative AI APIs & Services** — Powering Woltie’s multimodal dish analysis and natural-language food search.

**Cloud Run** — Containerized backend deployment with fully managed autoscaling.

**Firebase Hosting** — Fast and reliable static hosting for our frontend.

**Cloud DNS** — Custom domain management for a polished user experience.

**Cloud Build** — CI/CD pipeline for automated build & deployment.

**Artifact Registry** — Secure storage for backend container images.

**Secret Manager** — Secure storage of API keys, credentials, and sensitive environment variables.

**Cloud Storage** — Storing dish images and project-related assets.

For teamwork and productivity, we relied entirely on Google Docs and Google Slides for real-time collaboration throughout the hackathon.

### 💻 Frontend

**React + Vite + TypeScript** — Fast development environment and type-safe component logic

**Radix UI, Lucide React, Ant Design** — Flexible, accessible, and visually expressive UI components

**TailwindCSS** — Custom styling with utility-first CSS

### 🛠 Backend

**Python + FastAPI** — High-performance API layer for serving model responses

**Google Cloud SDK** — Full integration with Gemini API and other GCP services

### 📐 Design
Figma + Figma Make - Design and prototype

Figma Make was prompted to create the scan effect on the food imagery. Part of the image was highlighted and then cropped into a circle to simulate the ring simulation while the image loaded. This animation was then connected to the main chatbot screen, where Make was asked to create the smooth message transition within the chat and show the conversation. The code from Figma make was used for front end development.
