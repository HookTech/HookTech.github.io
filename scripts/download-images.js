const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

/**
 * 下载图片到指定目录
 * @param {string} url - 图片URL
 * @param {string} filepath - 保存路径
 * @returns {Promise}
 */
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https:') ? https : http;
    
    const file = fs.createWriteStream(filepath);
    
    protocol.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`✅ Downloaded: ${path.basename(filepath)}`);
        resolve();
      });
      
      file.on('error', (err) => {
        fs.unlink(filepath, () => {}); // 删除不完整的文件
        reject(err);
      });
    }).on('error', reject);
  });
}

/**
 * 从文章内容中提取图片URL
 * @param {string} content - 文章内容
 * @returns {Array} 图片URL数组
 */
function extractImageUrls(content) {
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  const urls = [];
  let match;
  
  while ((match = imageRegex.exec(content)) !== null) {
    const alt = match[1];
    const url = match[2];
    urls.push({ alt, url });
  }
  
  return urls;
}

/**
 * 主函数
 */
async function main() {
  const postsDir = path.join(__dirname, '../source/_posts');
  
  // 读取所有文章
  const posts = fs.readdirSync(postsDir).filter(file => file.endsWith('.md'));
  
  for (const post of posts) {
    const postPath = path.join(postsDir, post);
    const postName = path.basename(post, '.md');
    const postDir = path.join(postsDir, postName);
    
    // 创建文章图片目录
    if (!fs.existsSync(postDir)) {
      fs.mkdirSync(postDir, { recursive: true });
    }
    
    // 读取文章内容
    const content = fs.readFileSync(postPath, 'utf8');
    const images = extractImageUrls(content);
    
    console.log(`\n📝 Processing: ${post}`);
    console.log(`Found ${images.length} images`);
    
    // 下载图片
    for (let i = 0; i < images.length; i++) {
      const { alt, url } = images[i];
      
      // 跳过本地图片
      if (url.startsWith('/') || url.startsWith('./') || url.startsWith('../')) {
        console.log(`⏭️  Skipping local image: ${url}`);
        continue;
      }
      
      // 生成文件名
      const ext = path.extname(url) || '.jpg';
      const filename = `${postName}-${i + 1}${ext}`;
      const filepath = path.join(postDir, filename);
      
      try {
        await downloadImage(url, filepath);
      } catch (error) {
        console.error(`❌ Failed to download ${url}: ${error.message}`);
      }
    }
  }
}

// 运行脚本
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { downloadImage, extractImageUrls }; 