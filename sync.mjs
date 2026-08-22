import fs from 'fs';
import path from 'path';
const url = 'https://www.youtube.com/feeds/videos.xml?channel_id=UCjBeBu8gQM0p9aParvL3FFQ';
const res = await fetch(url);
const xml = await res.text();
console.log('Fetched', xml.length);
const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)];
console.log('Entries', entries.length);
let dir = 'src/pages/posts';
if (fs.existsSync('src/content')) dir = 'src/content/posts';
if (!fs.existsSync(dir)) fs.mkdirSync(dir,{recursive:true});
let created=0;
for (const m of entries) {
  const entry = m[1];
  const title = (entry.match(/<title>(.*?)<\/title>/)||[])[1]||'video';
  const id = (entry.match(/<yt:videoId>(.*?)<\/yt:videoId>/)||[])[1]||'';
  const published = (entry.match(/<published>(.*?)<\/published>/)||[])[1]||new Date().toISOString();
  const link = `https://www.youtube.com/watch?v=${id}`;
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,60) || id;
  const file = path.join(dir, slug + '.md');
  if (!fs.existsSync(file) && id) {
    const date = published.split('T')[0];
    const safeTitle = title.replace(/"/g,'').replace(/:/g,' -');
    const content = `---\ntitle: "${safeTitle}"\ndate: ${date}\n---\n\n<iframe width="100%" height="400" src="https://www.youtube.com/embed/${id}" frameborder="0" allowfullscreen></iframe>\n\n${safeTitle}\n\nOriginal: ${link}\n`;
    fs.writeFileSync(file, content);
    console.log('Created', file);
    created++;
  }
}
console.log('Done created', created);
