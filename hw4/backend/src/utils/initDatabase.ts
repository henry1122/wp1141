import { Database } from 'sqlite3';
import { promisify } from 'util';
import path from 'path';

const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '../../database.sqlite');

// Create database connection
const db = new Database(dbPath);

// Promisify database methods
export const dbRun = (sql: string, params?: any[]): Promise<any> => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ lastID: this.lastID, changes: this.changes });
      }
    });
  });
};
export const dbGet = promisify(db.get.bind(db)) as (sql: string, params?: any[]) => Promise<any>;
export const dbAll = promisify(db.all.bind(db)) as (sql: string, params?: any[]) => Promise<any[]>;

export const initDatabase = async (): Promise<void> => {
  try {
    console.log('🔄 Initializing database...');

    // Create users table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create trails table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS trails (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        difficulty TEXT CHECK(difficulty IN ('easy', 'medium', 'hard', 'expert')) DEFAULT 'medium',
        distance REAL,
        duration INTEGER,
        elevation_gain INTEGER,
        coordinates TEXT,
        start_location TEXT,
        end_location TEXT,
        tags TEXT,
        rating REAL DEFAULT 0,
        review_count INTEGER DEFAULT 0,
        user_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);

    console.log('✅ Database tables created successfully');

    // Insert sample users
    const existingUsers = await dbGet('SELECT COUNT(*) as count FROM users');
    if (existingUsers.count === 0) {
      await dbRun(
        'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
        ['john_doe', 'john@example.com', '$2a$10$6XEeoAy..NyEwYrsmQsq6.Yih4VQvDMrK2rh0XEjMJyyjuvB3d7J.']
      );
      await dbRun(
        'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
        ['jane_smith', 'jane@example.com', '$2a$10$6XEeoAy..NyEwYrsmQsq6.Yih4VQvDMrK2rh0XEjMJyyjuvB3d7J.']
      );
    }

    // Insert sample trails
    const existingTrails = await dbGet('SELECT COUNT(*) as count FROM trails');
    if (existingTrails.count === 0) {
      const sampleTrails = [
        {
          name: '玉山主峰',
          description: '台灣最高峰，海拔3952公尺，是台灣百岳之首。登頂可俯瞰台灣群山美景，是登山者的聖地。',
          difficulty: 'expert',
          distance: 10.9,
          duration: 480,
          elevation_gain: 1200,
          coordinates: JSON.stringify([
            { lat: 23.4700, lng: 120.9570 },
            { lat: 23.4710, lng: 120.9580 },
            { lat: 23.4720, lng: 120.9590 }
          ]),
          start_location: '塔塔加登山口',
          end_location: '玉山主峰',
          tags: JSON.stringify(['百岳', '高山', '挑戰', '日出', '雲海', '玉山']),
          rating: 4.8,
          review_count: 8,
          user_id: 1
        },
        {
          name: '雪山主峰',
          description: '台灣第二高峰，海拔3886公尺，擁有壯麗的冰河地形和豐富的高山生態。',
          difficulty: 'expert',
          distance: 10.9,
          duration: 480,
          elevation_gain: 1200,
          coordinates: JSON.stringify([
            { lat: 24.3820, lng: 121.2320 },
            { lat: 24.3830, lng: 121.2330 },
            { lat: 24.3840, lng: 121.2340 }
          ]),
          start_location: '武陵農場',
          end_location: '雪山主峰',
          tags: JSON.stringify(['百岳', '高山', '冰河', '雪山', '挑戰']),
          rating: 4.7,
          review_count: 12,
          user_id: 2
        },
        {
          name: '合歡山主峰',
          description: '台灣最容易親近的百岳之一，可欣賞高山杜鵑和壯闊的山景。',
          difficulty: 'hard',
          distance: 8.2,
          duration: 240,
          elevation_gain: 600,
          coordinates: JSON.stringify([
            { lat: 24.1420, lng: 121.2800 },
            { lat: 24.1430, lng: 121.2810 },
            { lat: 24.1440, lng: 121.2820 }
          ]),
          start_location: '合歡山莊',
          end_location: '合歡山主峰',
          tags: JSON.stringify(['百岳', '杜鵑', '高山', '雪景', '合歡山']),
          rating: 4.4,
          review_count: 12,
          user_id: 1
        },
        {
          name: '陽明山步道',
          description: '台北市最受歡迎的健行步道之一，沿途風景優美，適合初學者。春天可賞櫻花，秋天有芒草美景。',
          difficulty: 'easy',
          distance: 3.2,
          duration: 90,
          elevation_gain: 200,
          coordinates: JSON.stringify([
            { lat: 25.1820, lng: 121.5654 },
            { lat: 25.1830, lng: 121.5664 },
            { lat: 25.1840, lng: 121.5674 }
          ]),
          start_location: '陽明山國家公園',
          end_location: '小油坑',
          tags: JSON.stringify(['台北', '國家公園', '溫泉', '櫻花', '芒草']),
          rating: 4.5,
          review_count: 15,
          user_id: 1
        },
        {
          name: '象山步道',
          description: '台北市最受歡迎的夜景步道，可俯瞰台北101和整個台北盆地。',
          difficulty: 'easy',
          distance: 1.5,
          duration: 45,
          elevation_gain: 150,
          coordinates: JSON.stringify([
            { lat: 25.0320, lng: 121.5720 },
            { lat: 25.0330, lng: 121.5730 },
            { lat: 25.0340, lng: 121.5740 }
          ]),
          start_location: '象山登山口',
          end_location: '象山六巨石',
          tags: JSON.stringify(['台北', '夜景', '台北101', '象山', '市區']),
          rating: 4.3,
          review_count: 25,
          user_id: 1
        },
        {
          name: '阿里山森林步道',
          description: '世界知名的阿里山森林鐵路沿線步道，可欣賞神木群、雲海和日出美景。',
          difficulty: 'medium',
          distance: 7.5,
          duration: 180,
          elevation_gain: 400,
          coordinates: JSON.stringify([
            { lat: 23.5120, lng: 120.8020 },
            { lat: 23.5130, lng: 120.8030 },
            { lat: 23.5140, lng: 120.8040 }
          ]),
          start_location: '阿里山森林遊樂區',
          end_location: '祝山觀日平台',
          tags: JSON.stringify(['嘉義', '神木', '雲海', '日出', '森林鐵路']),
          rating: 4.6,
          review_count: 23,
          user_id: 1
        },
        {
          name: '太魯閣步道',
          description: '世界級峽谷景觀，沿著立霧溪而建的步道，可欣賞大理石峽谷的壯麗景色。',
          difficulty: 'medium',
          distance: 5.8,
          duration: 150,
          elevation_gain: 300,
          coordinates: JSON.stringify([
            { lat: 24.1580, lng: 121.6220 },
            { lat: 24.1590, lng: 121.6230 },
            { lat: 24.1600, lng: 121.6240 }
          ]),
          start_location: '太魯閣國家公園',
          end_location: '燕子口',
          tags: JSON.stringify(['花蓮', '峽谷', '大理石', '立霧溪', '國家公園']),
          rating: 4.7,
          review_count: 18,
          user_id: 2
        },
        {
          name: '草嶺古道',
          description: '台灣最著名的古道之一，連接台北和宜蘭，沿途可欣賞東北角海岸美景。',
          difficulty: 'medium',
          distance: 8.5,
          duration: 200,
          elevation_gain: 500,
          coordinates: JSON.stringify([
            { lat: 25.0120, lng: 121.8920 },
            { lat: 25.0130, lng: 121.8930 },
            { lat: 25.0140, lng: 121.8940 }
          ]),
          start_location: '貢寮',
          end_location: '大里天公廟',
          tags: JSON.stringify(['新北', '宜蘭', '古道', '海岸', '歷史']),
          rating: 4.3,
          review_count: 16,
          user_id: 2
        },
        {
          name: '七星山步道',
          description: '台北市最高峰，海拔1120公尺，可俯瞰整個台北盆地和淡水河。',
          difficulty: 'hard',
          distance: 6.2,
          duration: 180,
          elevation_gain: 600,
          coordinates: JSON.stringify([
            { lat: 25.1720, lng: 121.5620 },
            { lat: 25.1730, lng: 121.5630 },
            { lat: 25.1740, lng: 121.5640 }
          ]),
          start_location: '小油坑',
          end_location: '七星山主峰',
          tags: JSON.stringify(['台北', '最高峰', '火山', '溫泉', '挑戰']),
          rating: 4.6,
          review_count: 28,
          user_id: 1
        },
        {
          name: '大屯山步道',
          description: '陽明山國家公園內的重要步道，可欣賞硫磺噴氣孔和火山地形。',
          difficulty: 'medium',
          distance: 4.8,
          duration: 120,
          elevation_gain: 400,
          coordinates: JSON.stringify([
            { lat: 25.1820, lng: 121.5120 },
            { lat: 25.1830, lng: 121.5130 },
            { lat: 25.1840, lng: 121.5140 }
          ]),
          start_location: '二子坪',
          end_location: '大屯山主峰',
          tags: JSON.stringify(['台北', '火山', '硫磺', '國家公園', '地質']),
          rating: 4.4,
          review_count: 22,
          user_id: 1
        },
        {
          name: '觀音山步道',
          description: '新北市八里區的觀音山，可俯瞰淡水河口和台北港美景。',
          difficulty: 'medium',
          distance: 5.5,
          duration: 150,
          elevation_gain: 350,
          coordinates: JSON.stringify([
            { lat: 25.1320, lng: 121.4320 },
            { lat: 25.1330, lng: 121.4330 },
            { lat: 25.1340, lng: 121.4340 }
          ]),
          start_location: '觀音山遊客中心',
          end_location: '硬漢嶺',
          tags: JSON.stringify(['新北', '觀音山', '淡水河', '港口', '夜景']),
          rating: 4.2,
          review_count: 19,
          user_id: 2
        },
        {
          name: '劍潭山步道',
          description: '台北市最受歡迎的夜景步道，可俯瞰台北101和整個台北盆地。',
          difficulty: 'easy',
          distance: 2.8,
          duration: 60,
          elevation_gain: 200,
          coordinates: JSON.stringify([
            { lat: 25.0820, lng: 121.5320 },
            { lat: 25.0830, lng: 121.5330 },
            { lat: 25.0840, lng: 121.5340 }
          ]),
          start_location: '劍潭捷運站',
          end_location: '劍潭山',
          tags: JSON.stringify(['台北', '夜景', '台北101', '市區', '輕鬆']),
          rating: 4.1,
          review_count: 35,
          user_id: 1
        },
        {
          name: '內湖碧湖步道',
          description: '內湖區的親水步道，沿著碧湖而建，適合全家大小健行。',
          difficulty: 'easy',
          distance: 1.8,
          duration: 45,
          elevation_gain: 50,
          coordinates: JSON.stringify([
            { lat: 25.0820, lng: 121.5920 },
            { lat: 25.0830, lng: 121.5930 },
            { lat: 25.0840, lng: 121.5940 }
          ]),
          start_location: '碧湖公園',
          end_location: '碧湖步道',
          tags: JSON.stringify(['台北', '內湖', '親水', '公園', '家庭']),
          rating: 3.9,
          review_count: 12,
          user_id: 2
        },
        {
          name: '天母古道',
          description: '連接天母和陽明山的古道，沿途有豐富的生態和歷史遺跡。',
          difficulty: 'medium',
          distance: 3.5,
          duration: 90,
          elevation_gain: 300,
          coordinates: JSON.stringify([
            { lat: 25.1220, lng: 121.5320 },
            { lat: 25.1230, lng: 121.5330 },
            { lat: 25.1240, lng: 121.5340 }
          ]),
          start_location: '天母',
          end_location: '陽明山',
          tags: JSON.stringify(['台北', '天母', '古道', '生態', '歷史']),
          rating: 4.0,
          review_count: 15,
          user_id: 1
        },
        {
          name: '新店碧潭步道',
          description: '新店區的親水步道，沿著新店溪而建，可欣賞碧潭美景。',
          difficulty: 'easy',
          distance: 2.2,
          duration: 50,
          elevation_gain: 80,
          coordinates: JSON.stringify([
            { lat: 24.9620, lng: 121.5320 },
            { lat: 24.9630, lng: 121.5330 },
            { lat: 24.9640, lng: 121.5340 }
          ]),
          start_location: '碧潭吊橋',
          end_location: '新店溪步道',
          tags: JSON.stringify(['新北', '新店', '碧潭', '親水', '吊橋']),
          rating: 3.8,
          review_count: 18,
          user_id: 2
        },
        {
          name: '烏來瀑布步道',
          description: '烏來區的瀑布步道，可欣賞壯觀的烏來瀑布和溫泉。',
          difficulty: 'easy',
          distance: 1.5,
          duration: 30,
          elevation_gain: 100,
          coordinates: JSON.stringify([
            { lat: 24.8620, lng: 121.5520 },
            { lat: 24.8630, lng: 121.5530 },
            { lat: 24.8640, lng: 121.5540 }
          ]),
          start_location: '烏來老街',
          end_location: '烏來瀑布',
          tags: JSON.stringify(['新北', '烏來', '瀑布', '溫泉', '原住民']),
          rating: 4.3,
          review_count: 25,
          user_id: 1
        },
        {
          name: '坪林茶園步道',
          description: '坪林區的茶園步道，可欣賞茶園風光和品茶文化。',
          difficulty: 'easy',
          distance: 3.0,
          duration: 75,
          elevation_gain: 150,
          coordinates: JSON.stringify([
            { lat: 24.9320, lng: 121.7120 },
            { lat: 24.9330, lng: 121.7130 },
            { lat: 24.9340, lng: 121.7140 }
          ]),
          start_location: '坪林茶業博物館',
          end_location: '茶園步道',
          tags: JSON.stringify(['新北', '坪林', '茶園', '文化', '品茶']),
          rating: 4.1,
          review_count: 14,
          user_id: 2
        },
        {
          name: 'O型聖稜線',
          description: '台灣最經典的長程縱走路線，連接雪山和大霸尖山，沿途經過12座3000公尺以上的山峰，包含品田斷崖和素密達斷崖等危險地形。',
          difficulty: 'expert',
          distance: 33.0,
          duration: 960,
          elevation_gain: 3700,
          coordinates: JSON.stringify([
            { lat: 24.3820, lng: 121.2320 },
            { lat: 24.3830, lng: 121.2330 },
            { lat: 24.3840, lng: 121.2340 }
          ]),
          start_location: '武陵山莊',
          end_location: '大水池登山口',
          tags: JSON.stringify(['百岳', '聖稜線', '長程縱走', '斷崖', '挑戰']),
          rating: 4.9,
          review_count: 5,
          user_id: 1
        },
        {
          name: '南湖大山',
          description: '台灣五嶽之一，海拔3742公尺，擁有壯麗的冰河地形和豐富的高山生態。',
          difficulty: 'expert',
          distance: 12.5,
          duration: 480,
          elevation_gain: 1500,
          coordinates: JSON.stringify([
            { lat: 24.3620, lng: 121.4320 },
            { lat: 24.3630, lng: 121.4330 },
            { lat: 24.3640, lng: 121.4340 }
          ]),
          start_location: '思源埡口',
          end_location: '南湖大山主峰',
          tags: JSON.stringify(['百岳', '五嶽', '冰河', '高山', '挑戰']),
          rating: 4.8,
          review_count: 12,
          user_id: 1
        },
        {
          name: '奇萊主北峰',
          description: '台灣最著名的山難路線之一，擁有壯麗的草原和險峻的地形。',
          difficulty: 'expert',
          distance: 15.2,
          duration: 600,
          elevation_gain: 1800,
          coordinates: JSON.stringify([
            { lat: 24.1020, lng: 121.3320 },
            { lat: 24.1030, lng: 121.3330 },
            { lat: 24.1040, lng: 121.3340 }
          ]),
          start_location: '奇萊登山口',
          end_location: '奇萊主峰',
          tags: JSON.stringify(['百岳', '奇萊', '山難', '草原', '挑戰']),
          rating: 4.7,
          review_count: 8,
          user_id: 2
        },
        {
          name: '能高安東軍',
          description: '台灣最長的縱走路線之一，連接能高山和安東軍山，沿途經過多座百岳。',
          difficulty: 'expert',
          distance: 45.0,
          duration: 1200,
          elevation_gain: 2500,
          coordinates: JSON.stringify([
            { lat: 23.9820, lng: 121.2320 },
            { lat: 23.9830, lng: 121.2330 },
            { lat: 23.9840, lng: 121.2340 }
          ]),
          start_location: '屯原登山口',
          end_location: '奧萬大',
          tags: JSON.stringify(['百岳', '縱走', '長程', '能高', '挑戰']),
          rating: 4.6,
          review_count: 6,
          user_id: 1
        },
        {
          name: '中央尖山',
          description: '台灣三尖之首，海拔3705公尺，擁有尖銳的山形和險峻的地形。',
          difficulty: 'expert',
          distance: 18.5,
          duration: 720,
          elevation_gain: 2000,
          coordinates: JSON.stringify([
            { lat: 24.2820, lng: 121.3820 },
            { lat: 24.2830, lng: 121.3830 },
            { lat: 24.2840, lng: 121.3840 }
          ]),
          start_location: '南湖溪山屋',
          end_location: '中央尖山主峰',
          tags: JSON.stringify(['百岳', '三尖', '中央尖', '險峻', '挑戰']),
          rating: 4.8,
          review_count: 4,
          user_id: 2
        },
        {
          name: '大霸尖山',
          description: '台灣三尖之一，海拔3492公尺，擁有獨特的酒桶形山形。',
          difficulty: 'expert',
          distance: 20.0,
          duration: 600,
          elevation_gain: 1200,
          coordinates: JSON.stringify([
            { lat: 24.4520, lng: 121.1820 },
            { lat: 24.4530, lng: 121.1830 },
            { lat: 24.4540, lng: 121.1840 }
          ]),
          start_location: '大霸尖山登山口',
          end_location: '大霸尖山主峰',
          tags: JSON.stringify(['百岳', '三尖', '大霸', '酒桶', '挑戰']),
          rating: 4.7,
          review_count: 10,
          user_id: 1
        },
        {
          name: '畢祿山',
          description: '台灣百岳之一，海拔3371公尺，擁有開闊的視野和豐富的箭竹林。',
          difficulty: 'hard',
          distance: 8.5,
          duration: 360,
          elevation_gain: 1000,
          coordinates: JSON.stringify([
            { lat: 24.1820, lng: 121.2820 },
            { lat: 24.1830, lng: 121.2830 },
            { lat: 24.1840, lng: 121.2840 }
          ]),
          start_location: '畢祿山登山口',
          end_location: '畢祿山主峰',
          tags: JSON.stringify(['百岳', '畢祿', '箭竹', '視野', '挑戰']),
          rating: 4.5,
          review_count: 15,
          user_id: 2
        },
        {
          name: '羊頭山',
          description: '台灣百岳之一，海拔3035公尺，擁有獨特的羊頭形山形。',
          difficulty: 'hard',
          distance: 6.8,
          duration: 300,
          elevation_gain: 800,
          coordinates: JSON.stringify([
            { lat: 24.2220, lng: 121.3220 },
            { lat: 24.2230, lng: 121.3230 },
            { lat: 24.2240, lng: 121.3240 }
          ]),
          start_location: '羊頭山登山口',
          end_location: '羊頭山主峰',
          tags: JSON.stringify(['百岳', '羊頭', '獨特', '視野', '挑戰']),
          rating: 4.4,
          review_count: 18,
          user_id: 1
        },
        {
          name: '白姑大山',
          description: '台灣百岳之一，海拔3341公尺，擁有開闊的草原和豐富的高山植物。',
          difficulty: 'hard',
          distance: 12.0,
          duration: 480,
          elevation_gain: 1200,
          coordinates: JSON.stringify([
            { lat: 24.1620, lng: 121.1620 },
            { lat: 24.1630, lng: 121.1630 },
            { lat: 24.1640, lng: 121.1640 }
          ]),
          start_location: '白姑大山登山口',
          end_location: '白姑大山主峰',
          tags: JSON.stringify(['百岳', '白姑', '草原', '植物', '挑戰']),
          rating: 4.3,
          review_count: 12,
          user_id: 2
        },
        {
          name: '北大武山',
          description: '台灣五嶽之一，海拔3092公尺，擁有豐富的雲海和日出美景。',
          difficulty: 'hard',
          distance: 10.5,
          duration: 420,
          elevation_gain: 1400,
          coordinates: JSON.stringify([
            { lat: 22.6820, lng: 120.7820 },
            { lat: 22.6830, lng: 120.7830 },
            { lat: 22.6840, lng: 120.7840 }
          ]),
          start_location: '北大武山登山口',
          end_location: '北大武山主峰',
          tags: JSON.stringify(['百岳', '五嶽', '雲海', '日出', '挑戰']),
          rating: 4.6,
          review_count: 20,
          user_id: 1
        },
        {
          name: '南大武山',
          description: '台灣百岳之一，海拔2841公尺，擁有開闊的視野和豐富的生態。',
          difficulty: 'hard',
          distance: 8.0,
          duration: 360,
          elevation_gain: 1000,
          coordinates: JSON.stringify([
            { lat: 22.6220, lng: 120.7220 },
            { lat: 22.6230, lng: 120.7230 },
            { lat: 22.6240, lng: 120.7240 }
          ]),
          start_location: '南大武山登山口',
          end_location: '南大武山主峰',
          tags: JSON.stringify(['百岳', '南大武', '視野', '生態', '挑戰']),
          rating: 4.2,
          review_count: 14,
          user_id: 2
        },
        {
          name: '關山',
          description: '台灣百岳之一，海拔3668公尺，擁有開闊的視野和豐富的高山植物。',
          difficulty: 'expert',
          distance: 15.0,
          duration: 600,
          elevation_gain: 1800,
          coordinates: JSON.stringify([
            { lat: 23.1820, lng: 120.8820 },
            { lat: 23.1830, lng: 120.8830 },
            { lat: 23.1840, lng: 120.8840 }
          ]),
          start_location: '關山登山口',
          end_location: '關山主峰',
          tags: JSON.stringify(['百岳', '關山', '視野', '植物', '挑戰']),
          rating: 4.7,
          review_count: 8,
          user_id: 1
        },
        {
          name: '向陽山',
          description: '台灣百岳之一，海拔3603公尺，擁有開闊的視野和豐富的高山植物。',
          difficulty: 'expert',
          distance: 12.0,
          duration: 480,
          elevation_gain: 1500,
          coordinates: JSON.stringify([
            { lat: 23.2820, lng: 120.9820 },
            { lat: 23.2830, lng: 120.9830 },
            { lat: 23.2840, lng: 120.9840 }
          ]),
          start_location: '向陽山登山口',
          end_location: '向陽山主峰',
          tags: JSON.stringify(['百岳', '向陽', '視野', '植物', '挑戰']),
          rating: 4.5,
          review_count: 10,
          user_id: 2
        },
        {
          name: '三叉山',
          description: '台灣百岳之一，海拔3496公尺，擁有開闊的視野和豐富的高山植物。',
          difficulty: 'expert',
          distance: 14.0,
          duration: 540,
          elevation_gain: 1600,
          coordinates: JSON.stringify([
            { lat: 23.3820, lng: 121.0820 },
            { lat: 23.3830, lng: 121.0830 },
            { lat: 23.3840, lng: 121.0840 }
          ]),
          start_location: '三叉山登山口',
          end_location: '三叉山主峰',
          tags: JSON.stringify(['百岳', '三叉', '視野', '植物', '挑戰']),
          rating: 4.4,
          review_count: 7,
          user_id: 1
        }
      ];

      for (const trail of sampleTrails) {
        await dbRun(`
          INSERT INTO trails (
            name, description, difficulty, distance, duration, elevation_gain,
            coordinates, start_location, end_location, tags, rating, review_count, user_id
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          trail.name, trail.description, trail.difficulty, trail.distance,
          trail.duration, trail.elevation_gain, trail.coordinates,
          trail.start_location, trail.end_location, trail.tags,
          trail.rating, trail.review_count, trail.user_id
        ]);
      }
    }

    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
};
