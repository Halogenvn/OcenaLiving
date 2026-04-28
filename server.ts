import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import admin from "firebase-admin";
import { initializeApp as initializeClientApp } from "firebase/app";
import { getFirestore as getClientFirestore, collection, addDoc, serverTimestamp, getDocs, limit, query } from "firebase/firestore";
import fs from "fs";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin
const configPath = path.join(process.cwd(), "firebase-applet-config.json");
const firebaseConfig = JSON.parse(fs.readFileSync(configPath, "utf8"));

// Explicitly set the projectId from config to avoid pointing to the internal Cloud Run project
process.env.GOOGLE_CLOUD_PROJECT = firebaseConfig.projectId;

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: firebaseConfig.projectId,
});

// Use the specific database ID from config
const databaseId = firebaseConfig.firestoreDatabaseId || "(default)";

// Initialize Firebase Client SDK for Firestore (to bypass Service Account IAM issues)
const clientApp = initializeClientApp(firebaseConfig);
const firestore = getClientFirestore(clientApp, databaseId);

console.log(`[Firebase] Initialized Client SDK for Firestore. Project: ${firebaseConfig.projectId}, Database: ${databaseId}`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Test Firestore connectivity on startup
  try {
    console.log(`[Firebase] Testing connectivity to database: ${databaseId} (Client SDK)...`);
    const docRef = await addDoc(collection(firestore, "_startup_test"), {
      timestamp: serverTimestamp(),
      message: "Server starting up",
      databaseId: databaseId
    });
    console.log(`[Firebase] Startup connectivity test successful! Doc ID: ${docRef.id}`);
  } catch (err: any) {
    console.error("[Firebase] Startup connectivity test failed.");
    console.error(`[Firebase] Error Message: ${err.message}`);
  }

  app.use(express.json());

  // Diagnostic endpoint
  app.get("/api/debug-db", async (req, res) => {
    try {
      console.log(`[Debug] Checking Firestore connection (Client SDK) for database: ${databaseId}`);
      
      let testWriteResult = null;
      try {
        const docRef = await addDoc(collection(firestore, "_test_connection"), {
          timestamp: new Date().toISOString(),
          message: "Connectivity test"
        });
        testWriteResult = { success: true, docId: docRef.id };
      } catch (e) {
        console.error(`[Debug] Failed writing to ${databaseId}:`, e);
        testWriteResult = { success: false, error: e instanceof Error ? e.message : String(e) };
      }

      res.json({ 
        status: testWriteResult.success ? "connected" : "error", 
        currentDatabase: {
          id: databaseId,
          ...testWriteResult
        },
        projectId: firebaseConfig.projectId,
        method: "Client SDK (Browser-like connection from server)"
      });
    } catch (error) {
      res.status(500).json({ 
        status: "error", 
        message: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // API Route for Booking Confirmation Email & Saving to Database
  app.post("/api/booking-confirmation", async (req, res) => {
    const { 
      email, 
      fullName, 
      phone,
      roomType, 
      checkIn, 
      checkOut, 
      adults, 
      children, 
      pets,
      type,
      lang,
      houseRules 
    } = req.body;

    if (!email || !fullName || !phone) {
      return res.status(400).json({ error: "Missing required fields: email, fullName, or phone" });
    }

    try {
      console.log(`[Booking] Processing request for ${fullName} (${email})`);
      
      // 1. Save to Firestore
      try {
        const bookingRef = await addDoc(collection(firestore, "bookings"), {
          fullName,
          email,
          phone,
          roomType,
          checkIn,
          checkOut,
          adults: Number(adults) || 0,
          children: Number(children) || 0,
          pets: !!pets,
          type: type || "Short term",
          createdAt: serverTimestamp()
        });
        console.log(`[Booking] Data saved to Firestore with ID: ${bookingRef.id}`);
      } catch (dbError) {
        console.error("[Booking] Firestore Error details:", dbError);
        // Fail the request if we can't save to the database, to ensure user knows it failed
        return res.status(500).json({ 
          error: "Failed to save booking to database",
          details: dbError instanceof Error ? dbError.message : String(dbError)
        });
      }

      // 2. Send Email Confirmation
      if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn("SMTP credentials not configured. Skipping email send.");
        return res.json({ 
          success: true, 
          message: "Booking saved to database! (Email not sent because SMTP is not configured)" 
        });
      }

      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: process.env.SMTP_PORT === "465",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const isVi = lang === 'vi';
      
      const subject = isVi 
        ? `Xác nhận đặt phòng tại Ocena Apartment - ${fullName}`
        : `Booking Confirmation at Ocena Apartment - ${fullName}`;

      const htmlContent = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #334155; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
          <div style="background-color: #003d4d; padding: 24px; text-align: center;">
            <h1 style="color: white; margin: 0;">Ocena Apartment</h1>
          </div>
          <div style="padding: 32px;">
            <h2 style="color: #003d4d; border-bottom: 2px solid #EFE9E1; padding-bottom: 12px;">${isVi ? 'Xác nhận đơn đặt hàng' : 'Booking Confirmation'}</h2>
            <p>${isVi ? `Xin chào <strong>${fullName}</strong>,` : `Hello <strong>${fullName}</strong>,`}</p>
            <p>${isVi ? 'Cảm ơn bạn đã lựa chọn Ocena Apartment. Dưới đây là chi tiết yêu cầu đặt phòng của bạn:' : 'Thank you for choosing Ocena Apartment. Here are the details of your booking request:'}</p>
            
            <div style="background-color: #FBF9F6; pading: 20px; border-radius: 8px; margin: 24px 0;">
              <ul style="list-style: none; padding: 20px; margin: 0;">
                <li style="margin-bottom: 8px;"><strong>${isVi ? 'Loại phòng' : 'Room Type'}:</strong> ${roomType}</li>
                <li style="margin-bottom: 8px;"><strong>${isVi ? 'Ngày đến' : 'Check-in'}:</strong> ${checkIn}</li>
                <li style="margin-bottom: 8px;"><strong>${isVi ? 'Ngày đi' : 'Check-out'}:</strong> ${checkOut}</li>
                <li style="margin-bottom: 8px;"><strong>${isVi ? 'Khách' : 'Guests'}:</strong> ${adults} ${isVi ? 'Người lớn' : 'Adults'}${children > 0 ? `, ${children} ${isVi ? 'Trẻ em' : 'Children'}` : ''}</li>
              </ul>
            </div>

            <h3 style="color: #003d4d; margin-top: 32px;">${isVi ? 'Nội quy phòng' : 'House Rules'}</h3>
            <ul style="padding-left: 20px;">
              ${houseRules.map((rule: string) => `<li style="margin-bottom: 4px; font-style: italic; color: #64748b;">${rule}</li>`).join('')}
            </ul>

            <p style="margin-top: 32px; font-size: 0.9em; color: #64748b;">
              ${isVi 
                ? 'Chúng tôi sẽ liên hệ lại với bạn trong vòng 60 phút để hoàn tất quy trình thanh toán và xác nhận phòng trống.' 
                : 'We will get back to you within 60 minutes to finalize the payment process and confirm availability.'}
            </p>
          </div>
          <div style="background-color: #F1F5F9; padding: 20px; text-align: center; font-size: 0.8em; color: #94a3b8;">
            <p>© 2026 Ocena Apartment. 52/2 Lam Hoanh Street, An Hai, Da Nang 550000, Vietnam.</p>
          </div>
        </div>
      `;

      await transporter.sendMail({
        from: process.env.SMTP_FROM || '"Ocena Apartment" <booking@ocena.vn>',
        to: email,
        subject: subject,
        html: htmlContent,
      });

      res.json({ success: true, message: "Email sent successfully!" });
    } catch (error) {
      console.error("Email sending error:", error);
      res.status(500).json({ error: "Failed to send email confirmation" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
