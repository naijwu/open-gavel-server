
const { getStorage } = require('firebase-admin/storage');
const { initializeApp, cert, getApps } = require("firebase-admin/app");

function initializeFirebase() {
  if (getApps().length === 0) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY,
      }),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET
    });
  }
}


async function uploadImage (committeeId, countryName, file) {
  try {
    const bucket = getStorage().bucket();
    const fileName = `committee/${committeeId}/${countryName}`;
    
    const fileRef = bucket.file(fileName);
    await fileRef.save(file.buffer, {
      metadata: {
        contentType: file.mimetype,
      },
    });
    
    const [downloadURL] = await fileRef.getSignedUrl({
      action: 'read',
      expires: '03-01-2500',
    });
    
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image", committeeId, countryName, error);
    return null;
  }
};

module.exports = {
  initializeFirebase,
  uploadImage
};