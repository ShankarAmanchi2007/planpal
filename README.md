# ⚡ PlanPal — Intent-First Social Discovery & Matchmaking

> **Final Project Submission**  
> *A direct-interaction friend discovery web app built with Next.js, Framer Motion, Tailwind CSS, and Neon Serverless PostgreSQL.*

---

## 🎯 1. Problem Statement & Motivation
Traditional dating and social apps are plagued by **"The Pen-Pal Fallacy"**:
1. **Passive Browsing:** Users swipe purely on static, curated headshots without shared immediate intent.
2. **Text Fatigue:** Over **85%** of matches fizzle out into weeks of dry text exchanges (*"Hey, how are you?"*) that never convert into real-world hangouts.
3. **Flake & Ghosting Epidemic:** Without an anchored time, activity, or public venue, people hesitate to take the initiative.

### The Solution:
**PlanPal** flips the discovery model from **Identity-First** to **Intent-First**:
* Users swipe on **real-world activity invitations** (*"Padel doubles @ 6 PM"*, *"Live Jazz & Drinks tonight"*, *"Specialty coffee & coworking"*, *"Weekend ridge hike"*).
* Direct interaction is built into the match: the moment both parties agree on a plan, a chat room opens with the **activity details pinned at the top** and an **RSVP status button**.

---

## 🏗️ 2. System Architecture & Tech Stack

| Layer | Technology | Role |
| :--- | :--- | :--- |
| **Frontend Framework** | **Next.js 16 (React 19, TypeScript)** | High-performance full-stack web application |
| **Styling** | **Tailwind CSS v4** | Clean, responsive modern UI with dark/light adaptability |
| **Animation Engine** | **Framer Motion** | Tinder-style card physics, drag gestures, stamps, and transitions |
| **Celebration FX** | **Canvas-Confetti** | Dopamine celebration effects on match events |
| **Database** | **Neon PostgreSQL** | Serverless PostgreSQL with auto-scaling connection pooling |
| **DB Client** | **`@neondatabase/serverless`** | Low-latency edge & serverless SQL driver |

---

## 📊 3. Relational Database Schema (PostgreSQL on Neon)

The schema is structured into 5 normalized relational tables:

```mermaid
erDiagram
    USERS ||--o{ ACTIVITIES : creates
    USERS ||--o{ SWIPES : performs
    USERS ||--o{ MATCHES : joins
    USERS ||--o{ MESSAGES : sends
    ACTIVITIES ||--o{ SWIPES : receives
    ACTIVITIES ||--o{ MATCHES : triggers
    MATCHES ||--o{ MESSAGES : contains

    USERS {
        varchar id PK
        varchar name
        int age
        text avatar
        varchar occupation
        varchar city
        text bio
        text_array badges
        boolean verified
    }
    ACTIVITIES {
        varchar id PK
        varchar title
        varchar category
        text description
        timestamp date_time
        varchar time_display
        varchar location
        int max_participants
        int current_participants
        text_array tags
        varchar host_id FK
        boolean is_urgent
    }
    SWIPES {
        varchar id PK
        varchar activity_id FK
        varchar user_id FK
        varchar action
        timestamp created_at
    }
    MATCHES {
        varchar id PK
        varchar activity_id FK
        varchar user_id FK
        varchar status
        timestamp created_at
    }
    MESSAGES {
        varchar id PK
        varchar match_id FK
        varchar sender_id FK
        text text
        timestamp created_at
    }
```

---

## 🚀 4. How to Run Locally

### Step 1: Navigate to the directory
```bash
cd C:\Users\manim\.gemini\antigravity\scratch\planpal
```

### Step 2: Start Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser!

---

## 🗄️ 5. Connecting Neon PostgreSQL

1. Go to [https://neon.tech](https://neon.tech) and create a free project.
2. Copy your PostgreSQL connection string from the Neon dashboard:
   ```env
   DATABASE_URL="postgresql://username:password@ep-xxxxxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
   ```
3. Create a `.env.local` file inside the `planpal` directory and paste your string:
   ```bash
   DATABASE_URL=your_connection_string_here
   ```
4. Click the **"Neon DB"** pill in the top navbar inside the app and click **"Test & Initialize Neon Schema"** — this will create all 5 tables and seed them with initial social activities automatically!

> **Note:** If `DATABASE_URL` is not provided, PlanPal automatically runs in **Resilient Demo Mode** using in-memory state, ensuring that presentations never crash even without internet or database credentials.

---

## 🎓 6. Project Presentation & Viva Talking Points

1. **Why Activity-First?** Discuss the psychology of lower anxiety when an interaction has a defined objective (e.g. playing padel, bouldering, or catching a jazz set) vs. a vague "meet a stranger" prompt.
2. **Swipe Physics:** Explain how `framer-motion`'s `useMotionValue` and `useTransform` map horizontal drag delta to angular rotation (`[-18deg, 18deg]`) and badge stamp opacity.
3. **Database Scalability:** Mention that Neon separates compute from storage, enabling instant auto-scaling and branching.
