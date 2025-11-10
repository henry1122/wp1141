/**
 * 查看資料庫內容的腳本
 * 使用方法: node scripts/view-db.js
 */

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function viewDatabase() {
  try {
    // 連接資料庫
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      console.error('❌ MONGODB_URI 未設定');
      process.exit(1);
    }

    await mongoose.connect(MONGODB_URI);
    console.log('✅ 已連接到 MongoDB\n');

    const db = mongoose.connection.db;

    // 查看 Users
    console.log('📊 === Users ===');
    const usersCollection = db.collection('users');
    const users = await usersCollection.find({}).toArray();
    console.log(`總共 ${users.length} 個使用者`);
    users.forEach((user, index) => {
      console.log(`\n${index + 1}. ${user.name || 'N/A'} (@${user.userID || 'N/A'})`);
      console.log(`   Provider: ${user.provider || 'N/A'}`);
      console.log(`   Email: ${user.email || 'N/A'}`);
      console.log(`   Created: ${user.createdAt || 'N/A'}`);
    });

    // 查看 Posts
    console.log('\n\n📝 === Posts ===');
    const postsCollection = db.collection('posts');
    const posts = await postsCollection.find({}).toArray();
    console.log(`總共 ${posts.length} 篇文章`);
    posts.slice(0, 5).forEach((post, index) => {
      console.log(`\n${index + 1}. ${post.content?.substring(0, 50) || 'N/A'}...`);
      console.log(`   Created: ${post.createdAt || 'N/A'}`);
      console.log(`   Hashtags: ${post.hashtags?.length || 0}`);
    });
    if (posts.length > 5) {
      console.log(`\n... 還有 ${posts.length - 5} 篇文章`);
    }

    // 查看 Likes
    console.log('\n\n❤️  === Likes ===');
    const likesCollection = db.collection('likes');
    const likes = await likesCollection.find({}).toArray();
    console.log(`總共 ${likes.length} 個讚`);

    // 查看 Follows
    console.log('\n\n👥 === Follows ===');
    const followsCollection = db.collection('follows');
    const follows = await followsCollection.find({}).toArray();
    console.log(`總共 ${follows.length} 個關注關係`);

    // 統計資訊
    console.log('\n\n📈 === 統計資訊 ===');
    console.log(`使用者: ${users.length}`);
    console.log(`文章: ${posts.length}`);
    console.log(`讚: ${likes.length}`);
    console.log(`關注: ${follows.length}`);

    // 列出所有 Collections
    console.log('\n\n📁 === 所有 Collections ===');
    const collections = await db.listCollections().toArray();
    collections.forEach((collection) => {
      console.log(`- ${collection.name}`);
    });

  } catch (error) {
    console.error('❌ 錯誤:', error.message);
    if (error.code === 'ENOTFOUND') {
      console.error('💡 請檢查 MongoDB URI 是否正確');
    }
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ 已斷開連接');
  }
}

viewDatabase();
