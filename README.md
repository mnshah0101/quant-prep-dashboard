
# Quant Prep Dashboard

A **Next.js** dashboard to track your quantitative preparation, featuring:

1. **Books** with page tracking and target finish dates (pie charts).
2. **LeetCode** daily solve tracking (line chart).
3. **QuantGuide** daily solve tracking (line chart).
4. **Zetamac** speed math tests (historical scores in a line chart).
5. **Notes** section.
6. **Editable Modal** where you can change or delete data in one place.
7. **Dark Mode** UI (Tailwind-based).

![Preview Screenshot](./screenshot.png)

## Features
1. **Pie Chart** per book showing pages read vs. remaining.
2. **Target Finish Date** for each book → auto-calculated pages per day.
3. **Daily Solves** for LeetCode & QuantGuide (accumulated by date).
4. **Zetamac** historical line chart to log your test runs over time.
5. **Notes** section for daily tasks or reminders.
6. **Edit Modal** to bulk-edit all data or delete items (like books).
7. **Local Storage** persistence — data remains on refresh.

## Prerequisites

- Node.js >= 16
- npm or yarn

## Getting Started

1. **Clone** this repository:
   ```bash
   git clone https://github.com/yourusername/quant-prep-dashboard.git
   ```
2. **Install Dependencies**:
   ```bash
   cd quant-prep-dashboard
   npm install
   ```
3. **Run Development Server**:
   ```bash
   npm run dev
   ```
   This starts the local dev server on [http://localhost:3000](http://localhost:3000).

## Project Structure

```bash
quant-prep-dashboard/
├─ app/
│  ├─ layout.js      # Global layout for Next.js App Router
│  ├─ page.js        # Main dashboard page (QuantPrepDashboard component)
│  ├─ globals.css    # Global Tailwind and CSS resets
│  └─ ...            
├─ components/ui/    # Reusable UI components (Card, Progress, etc.)
├─ package.json
└─ README.md
```

- **page.js** includes the entire dashboard (Books, LeetCode, QuantGuide, Zetamac, Notes, etc.).
- **Modal** logic is embedded in the same file for simplicity, but you can refactor to a dedicated component as needed.

## Key Dependencies

- **Next.js** (App Router)  
- **React & Recharts**: For charts (PieChart, LineChart, etc.).  
- **Tailwind CSS**: For utility-based styling (dark mode classes, layout).  
- **Lucide React**: For icons (book, code, calculator, etc.).  

## Usage

1. **Books**:  
   - Add a title, total pages, current page, and optional finish date.  
   - The pie chart updates to show read vs. remaining pages, and calculates pages/day if a finish date is set.

2. **LeetCode / QuantGuide**:  
   - Log daily solve counts. Each day’s solves accumulate in a line chart.  
   - Goals are set arbitrarily (200 for LeetCode, 100 for QuantGuide) in code.

3. **Zetamac**:  
   - Input each test’s final score. The line chart tracks your historical runs.

4. **Notes**:  
   - A simple textarea for daily tasks or reminders.

5. **Edit Modal**:  
   - Click **“Edit All Data”** to open a modal that shows ephemeral copies of your data.  
   - Add or delete books, or adjust your daily solves and Zetamac scores.  
   - **Save** commits changes, **Cancel** discards them.

## Customizing

- **Change Goals**:  
  Edit the `leetGoal` and `quantGoal` in the code if you want different daily or total goals.
- **Styling**:
  - Tweak Tailwind classes (`bg-gray-900`, `text-gray-100`) to fine-tune dark mode.  
  - Adjust chart stroke colors or tooltip backgrounds.
- **Data Persistence**:
  - Currently uses **localStorage**. If you need multi-device sync, consider a real backend or serverless DB.


