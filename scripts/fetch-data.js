const fs = require('fs');
const path = require('path');

const API_URL = process.env.DATA_API_URL;
const API_TOKEN = process.env.API_TOKEN || '';
const TARGET = path.resolve(process.env.TARGET_JSON || 'source/_data/data.json');

async function main() {
  if (!API_URL) throw new Error('未配置 DATA_API_URL');

  const res = await fetch(API_URL, {
    headers: {
      'User-Agent': 'hexo-data-sync',
      ...(API_TOKEN ? { Authorization: `Bearer ${API_TOKEN}` } : {}),
    },
  });
  if (!res.ok) throw new Error(`接口返回 ${res.status}`);

  // 如果你的接口直接返回的就是要写入的 JSON 内容，这行就够
  const data = await res.json();

  // 如需清洗/映射，可在下面处理，例如：
  // const data = { updatedAt: new Date().toISOString(), items: raw.items };

  fs.mkdirSync(path.dirname(TARGET), { recursive: true });
  fs.writeFileSync(TARGET, JSON.stringify(data, null, 2) + '\n');
  console.log(`已写入 ${TARGET}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
