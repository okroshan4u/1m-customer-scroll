# 🧾 Customers List UI — React + Vite

A performant **Customers List UI** built with **React + Vite**, capable of handling **1 million records** smoothly with **infinite scroll**, **search**, and **sorting** functionality.

---

## 🚀 Features

✅ **1 Million Records** — Generated locally (no API calls).  
✅ **Infinite Scroll** — Loads more rows dynamically as you scroll.  
✅ **Search** — Debounced (250ms) search by **name, email, or phone**.  
✅ **Sorting** — Click on column headers to toggle **ascending / descending** order.  
✅ **Filters Dropdown** — Static filters (non-functional) for demonstration.  
✅ **Sticky Header** — Table header remains visible while scrolling.  
✅ **Smooth Performance** — Efficient rendering with React’s virtualization techniques.  
✅ **Plain CSS Only** — No Tailwind, Bootstrap, or UI libraries.

---

## 🧩 Tech Stack

- **React 18+**
- **Vite**
- **Node.js 22+**
- **Plain CSS**
- **In-Memory / IndexedDB Storage**

---

## 📊 Data Schema

Each record includes:

| Field          | Description                 | Example                          |
|----------------|-----------------------------|----------------------------------|
| `id`           | Unique ID                   | 1                                |
| `name`         | Customer name               | John Doe                         |
| `phone`        | Phone number                | +1-555-123-4567                  |
| `email`        | Email address               | john.doe@email.com               |
| `score`        | Customer score (1–100)      | 87                               |
| `lastMessageAt`| Last message timestamp      | 2025-10-25 14:32:10              |
| `addedBy`      | Who added the record        | Admin                            |
| `avatar`       | Profile image (randomized)  | https://randomuser.me/...        |

---

## 🖥️ UI Overview

- **Table View** — Displays customer data (30 rows per page).
- **Sticky Header** — Always visible on scroll.
- **Hover Effect** — Highlighted row on hover.
- **Filters Dropdown** — Opens a dummy filter menu (non-functional).

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/<your-username>/<your-repo-name>.git
cd <your-repo-name>
```

### 2️⃣ Install Dependencies
```bash
npm install
```
### 3️⃣ Run the App
```bash
npm run dev
```

Then open http://localhost:5173
 in your browser.

### 🔍 Search & Sort Behavior

- Search:

  - Filters records by name, email, or phone.

  - Debounced by 250ms to improve performance.

- Sort:

  - Click a column header to toggle ascending / descending order.

  - Sorting works client-side.
 
 ### 🧠 Implementation Details

- Data Generation:

 - 1M mock records generated locally on startup.

 - Uses in-memory data or IndexedDB for persistence.

### Infinite Scrolling:

- Renders only visible rows using window-based rendering to avoid DOM overload.

- Loads additional pages (30 rows each) as user scrolls.

- Performance Optimization:

- React memoization & efficient state updates.
  
- Lazy loading for smooth experience even with 1M records.

### 🧪 Testing Checklist

  - Can scroll through all 1M records without lag

  - Search filters records (partial match supported)
 
  - Sorting toggles ASC / DESC correctly

  - Filters dropdown opens (dummy functionality)

  - Sticky header remains visible while scrolling

  - Smooth and responsive UI

   ### 📁 Folder Structure
src/
├── components/
│   ├── Table.jsx
│   ├── TableHeader.jsx
│   ├── TableRow.jsx
│   ├── FiltersDropdown.jsx
│
├── utils/
│   ├── generateData.js
│   ├── debounce.js
│   ├── sortUtils.js
│
├── App.jsx
├── main.jsx
├── index.css
