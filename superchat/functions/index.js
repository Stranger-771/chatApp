const functions = require('firebase-functions');
const Filter = require('bad-words');
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

exports.detectEvilUsers = functions.firestore.document('messages/{msgId}').onCreate(async (snapshot, context) => {
  const filter = new Filter();
  const { text, uid } = snapshot.data();

  if (filter.isProfane(text)) {
    const cleaned = filter.clean(text);
    await snapshot.ref.update({ text: `🤐 I got BANNED for life for saying... ${cleaned}` });

    await db.collection('banned').doc(uid).set({});
  }

  const userRef = db.collection('users').doc(uid);
  const userSnapshot = await userRef.get();
  const userData = userSnapshot.data();

  if (userData && userData.msgCount >= 7) {
    await db.collection('banned').doc(uid).set({});
  } else {
    await userRef.set({ msgCount: (userData && userData.msgCount) || 0 + 1 });
  }
});
