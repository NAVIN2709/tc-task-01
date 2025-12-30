const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const dotenv = require("dotenv");

dotenv.config();

const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), // important!
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
};

const app = express();
app.use(cors());
app.use(express.json());

/* ================= Firebase Admin ================= */
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
console.log("initialized")

const db = admin.firestore();

/* ================= Send Notification ================= */
app.post("/notify-new-item", async (req, res) => {
  try {
    const { title, type } = req.body;

    if (!title || !type) {
      return res.status(400).json({ error: "Missing data" });
    }

    // 1️⃣ Get all users with notifications enabled
    const usersSnap = await db
      .collection("users")
      .where("notificationsEnabled", "==", true)
      .get();

    const tokens = usersSnap.docs
      .map((doc) => doc.data().fcmToken)
      .filter(Boolean);

    if (tokens.length === 0) {
      return res.json({ message: "No tokens found" });
    }

    // 2️⃣ Notification payload
    const message = {
      notification: {
        title:
          type === "lost"
            ? "🔴 New Lost Item Reported"
            : "🟢 New Found Item Posted",
        body: title,
      },
      webpush: {
        fcmOptions: {
          link: "https://yourwebsite.com/items",
        },
      },
      tokens,
    };

    // 3️⃣ Send push
    const response = await admin.messaging().sendEachForMulticast(message);

    res.json({
      success: true,
      sent: response.successCount,
      failed: response.failureCount,
    });
  } catch (err) {
    console.error("Push error:", err);
    res.status(500).json({ error: "Notification failed" });
  }
});

app.get("/ping",(req,res)=>{
    res.send("working")
})

/* ================= Server ================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
