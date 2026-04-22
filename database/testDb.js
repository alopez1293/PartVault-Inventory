// database/testDb.js
require("dotenv").config();
const { testConnection } = require("./connection");
const { getAllUsers, getUserById } = require("./queries/users");

(async () => {
  try {
    await testConnection();

    const users = await getAllUsers(5);
    console.log("✅ Sample users:", users);

    if (users.length > 0) {
      const u = await getUserById(users[0].user_id);
      console.log("✅ getUserById(first user):", u);
    } else {
      console.log("ℹ️ No users returned. (That’s okay if your seed data didn’t insert.)");
    }

    process.exit(0);
  } catch (err) {
    console.error("❌ DB test failed:", err.message);
    process.exit(1);
  }
})();
