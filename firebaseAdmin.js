const admin = require("firebase-admin");
const serviceAccount = require("./e-nose-notifications-firebase-adminsdk-fbsvc-3e5745c414.json"); // Update with your actual path

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const messaging = admin.messaging();

const sendNotification = async (token, title, body) => {
    const message = {
        notification: { title, body },
        token
    };

    try {
        const response = await messaging.send(message);
        console.log("Notification sent successfully:", response);
    } catch (error) {
        console.error("Error sending notification:", error);
    }
};

module.exports = sendNotification;
