import app from "firebase/app";
import "firebase/auth";
// import "firebase/database";
import "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APPID,
    measurementId: process.env.REACT_APP_MEASUREMENTID
};

class Firebase {
    constructor() {
        app.initializeApp(firebaseConfig);
        this.auth = app.auth();
        this.db = app.firestore();
        app.firestore().settings({
            cacheSizeBytes: app.firestore.CACHE_SIZE_UNLIMITED
        });

        app.firestore().enablePersistence();
    }

    doCreateUserWithEmailAndPassword = (email, password) =>
        this.auth.createUserWithEmailAndPassword(email, password);

    doSignInWithEmailAndPassword = (email, password) =>
        this.auth.signInWithEmailAndPassword(email, password);

    doSignOut = () => this.auth.signOut();

    doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

    doPasswordUpdate = password =>
        this.auth.currentUser.updatePassword(password);

    user = uid => this.db.doc(`users/${uid}`);
    users = () => this.db.collection("users");
    addUser = (uid, udata) => this.db.doc(`users/${uid}`).set(udata);
    expenses = () => this.db.collection("expenses");
    addExpense = expense => this.db.collection("expenses").add(expense);
    deleteExpense = key => this.db.doc(`expenses/${key}`).delete();

    deleteGroup = key => {
        this.db
            .collection("expenses")
            .where("gid", "==", key)
            .get()
            .then(querySnapshot => {
                let batch = this.db.batch();
                querySnapshot.forEach(function(doc) {
                    batch.delete(doc.ref);
                });
                return batch.commit();
            })
            .then(console.log("Deleted group expenses with id", key))
            .catch(error => {
                console.log(
                    "Error While deleting all Records for the Group",
                    error
                );
            });

        this.db
            .doc(`expense-group/${key}`)
            .delete()
            .then(console.log("Deleted group with id", key))
            .catch(error => {
                console.log("Error While deleting the Group", error);
            });
    };

    getExpenseByGroup = gid =>
        this.db
            .collection("expenses")
            .where("gid", "==", gid)
            .orderBy("date", "desc");

    getUserByUserName = username =>
        this.db
            .collection("users")
            .where("username", "==", username)
            .get();

    expGroupRef = () => this.db.collection("expense-group");

    addExpGroup = groupInfo =>
        this.db.collection("expense-group").add(groupInfo);

    addCategory = category => this.db.collection("categories").push(category);
}

export default Firebase;
