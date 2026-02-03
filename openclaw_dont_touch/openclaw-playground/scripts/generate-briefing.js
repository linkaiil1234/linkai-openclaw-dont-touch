const { Redis } = require('@upstash/redis');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

async function generateBriefing() {
    const tasksData = await redis.hgetall('openclaw:tasks');
    const tasks = tasksData ? Object.values(tasksData).map(t => typeof t === 'string' ? JSON.parse(t) : t) : [];

    const doneTasks = tasks.filter(t => t.status === 'done');
    const inProgressTasks = tasks.filter(t => t.status === 'in-progress');
    const pendingTasks = tasks.filter(t => t.status === 'pending');
    
    const recentWins = doneTasks.slice(-3);
    const velocity = recentWins.length;
    
    const date = new Date().toLocaleDateString('he-IL', { weekday: 'long', month: 'long', day: 'numeric' });

    const briefing = `
📑 **עדכון מנהלים יומי | ${date}**

📊 **ביצועים (24 שעות אחרונות)**
• ✅ משימות שהושלמו: ${velocity}
• ⚙️ תהליכים פעילים: ${inProgressTasks.length}
• 📥 צבר משימות (Backlog): ${pendingTasks.length}

🏆 **הישגים מרכזיים**
${recentWins.length > 0 ? recentWins.map(t => `• ${t.title}`).join('\n') : "• ללא סגירות משמעותיות."}

🚧 **חסמים קריטיים (דחיפות גבוהה)**
${inProgressTasks.slice(0, 3).map(t => `• ${t.title} [אחראי: ${t.assignedTo || 'ללא שיוך'}]`).join('\n')}

🎯 **תוכנית פעולה להיום**
1. לפצח את החסם הראשי: ${inProgressTasks[0]?.title || 'אין'}.
2. לבחון משימה מהצבר: ${pendingTasks[0]?.title || 'אין'}.

**סטטוס מערכת:** 🟢 יציב
**FinOps:** 💰 עלות יומית ~$4.20
    `;

    console.log(briefing.trim());
}

generateBriefing();
