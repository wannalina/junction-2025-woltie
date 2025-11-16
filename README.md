# Juho — AI-Powered Local Food Discovery

Wolt’s mission is to make cities better — but local commerce breaks down when customers can’t solve the menu mystery. Our team has experienced this firsthand while living abroad: menu names and photos often fail to convey what a dish actually tastes like, how it’s prepared, or how it compares to foods we already know. This gap leads to repetitive “safe choices,” limiting users from exploring the rich, authentic food culture around them.

Juho is our solution: an AI-powered food-navigation companion that makes discovery intuitive, personal, and fun.

It not only benefits consumers who want to confidently explore their local food scene without, but it also surfaces small, authentic local restaurants that users might otherwise never find. And to Wolt,  

## 🔍 What Juho Does
### Multi-modal dish intelligence

Juho analyzes dish photos and descriptions on Wolt to break down flavors, textures, and ingredients. It then generates personalized taste profiles and “taste-a-like” comparisons (e.g., “This is similar to Korean bibimbap but creamier and mildly spicy”) — giving users the confidence to try something new.

### Reverse dish search

Users can describe a dish they’ve tried before — even if they forgot its name — and Juho finds the closest match. A query like “cheesy baked eggplant dish” instantly connects them to Melanzane alla Parmigiana, transforming vague cravings into real orders.

## 👥 Team

This project was created by:
Annalina Wheeler, Ansley Fowler, Ruikang Tao, Shuaijie Peng, and Ting-Chen Yen — ranked alphabetically by first name.

## 🧰 Tech Stack
### ☁️ Google Cloud Platform (GCP) - **For best use of Google Cloud tech challenge**

Our solution makes extensive and purposeful use of Google Cloud services:

**Generative AI APIs & Services** — Powering Juho's multimodal dish analysis and natural-language food search
- Multimodal analysis of dish photos and descriptions.  
- Natural-language understanding for “describe-to-find” queries.  
- Generation of taste profiles, allergen explanations, and “taste-a-like” recommendations.

**Cloud Run** — Containerized backend deployment with fully managed autoscaling
- Hosts our FastAPI backend as containerized services.  
- Autoscaling based on traffic — ideal for spiky hackathon-style demos and real-world usage.

**Firebase Hosting** — Fast and reliable static hosting for our frontend with automatic SSL and domain management
- Delivers the React + Vite frontend globally with minimal configuration.  
- Provides CDN-like performance without operational overhead  

**Cloud Build** — CI/CD pipeline for automated build & deployment.

**Artifact Registry** — Secure storage for backend container images.

**Secret Manager** — Secure storage of API keys, credentials, and sensitive environment variables.

**Cloud Storage** — Storage for dish images and project assets.

By leaning into serverless (Cloud Run, Firebase Hosting) and managed developer tooling (Cloud Build, Secret Manager, Artifact Registry), **we maximize time spent on:**
- refining food intelligence,
- improving user experience,
- and iterating on our “describe-to-find” and dish recognition flows...

…and *minimize* time spent worrying about servers, infrastructure, or manual deployment steps.

To worktogether efficiently as a distributed hackathon team, we also relied on Google Docs and Google Slides, and shared drives to keep product, design, and engineering in sync for real-time collaboration throughout the hackathon.

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

ElevenLabs - Voice

ElevenLabs was used to generate a voice-over for our demo video. We used multiple voices to test and decided on "Will" voice to get our message across in a clear and concise way. ElevenLabs helped bring our demo to the next level, using AI powered voice technology.
