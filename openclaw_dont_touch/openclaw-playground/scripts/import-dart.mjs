import { Redis } from '@upstash/redis';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// The raw JSON data from the successful curl (truncated for brevity in script, normally would fetch live)
// Since I already have the output, I'll process the structure I saw.
// The structure is: results[].text.root.children[].children[].listitem...
// Actually, looking at the JSON, it seems to be a list of "Docs" (Standup, Changelog, ENV) which contain lists of tasks inside their `text` body.

// Let's re-fetch it dynamically to be robust
const DART_URL = "https://app.dartai.com/api/v0/public/docs/dsa_7b01f2d4356279970db3ce3e798f9dfa01dc61f4cd119bbf6070beb47bcede8b/tasks";

async function run() {
    console.log('📥 Fetching Dart Backlog...');
    const response = await fetch(DART_URL);
    if (!response.ok) {
        console.error('Failed to fetch:', response.status);
        return;
    }
    
    const data = await response.json();
    const tasks = [];

    // Parse Dart's specific structure (Task List inside Doc)
    // The previous output showed a list of docs. Let's look for "title" inside the text nodes.
    // Actually, the endpoint `/tasks` returned a list of "results".
    // Let's iterate and extract.
    
    // Based on the log, it seems to be a list of "Standups" and "Changelogs", which contain bullet points.
    // Let's try to extract bullet points from the `text` field if possible.
    
    if (data.results) {
        for (const doc of data.results) {
            // Traverse the rich text structure
            if (doc.text && doc.text.root && doc.text.root.children) {
                for (const block of doc.text.root.children) {
                    if (block.type === 'list') {
                        for (const item of block.children) {
                            // Extract text from list item
                            let taskTitle = '';
                            if (item.children) {
                                for (const textNode of item.children) {
                                    // Sometimes nested paragraph
                                    if (textNode.type === 'paragraph' && textNode.children) {
                                        taskTitle += textNode.children.map(c => c.text).join(' ');
                                    } else if (textNode.text) {
                                        taskTitle += textNode.text;
                                    }
                                }
                            }
                            
                            if (taskTitle) {
                                // Clean up
                                taskTitle = taskTitle.trim();
                                // Determine status based on keywords or default to backlog
                                let status = 'pending';
                                if (taskTitle.toLowerCase().includes('done') || taskTitle.toLowerCase().includes('completed')) {
                                    status = 'done';
                                } else if (taskTitle.toLowerCase().includes('urgent') || taskTitle.toLowerCase().includes('ongoing')) {
                                    status = 'in-progress';
                                }

                                tasks.push({
                                    id: `dart-${Math.random().toString(36).substr(2, 9)}`,
                                    title: taskTitle,
                                    status,
                                    tags: ['Dart Import'],
                                    assignedTo: 'Link' // Assign to me for now
                                });
                            }
                        }
                    }
                }
            }
        }
    }

    console.log(`🔍 Found ${tasks.length} tasks.`);
    
    // Save to Redis
    // We want to KEEP existing tasks, so we hset individually
    for (const task of tasks) {
        await redis.hset('openclaw:tasks', { [task.id]: JSON.stringify(task) });
    }
    
    console.log('✅ Import Complete.');
}

run();
