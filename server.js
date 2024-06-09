const express = require('express');
const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } = require('firebase/auth');
const { getFirestore, collection, doc, setDoc } = require('firebase/firestore');

const app = express();
const port = 3000;

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBA-XRsyU_HZJkWrBh3KW4mz_U4shWWOa0",
    authDomain: "capstone-project-401.firebaseapp.com",
    projectId: "capstone-project-401",
    storageBucket: "capstone-project-401.appspot.com",
    messagingSenderId: "1054273692155",
    appId: "1:1054273692155:web:d1c30d59a3c5c90932eb5e",
    measurementId: "G-MBW2T7ZX88"
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

// Set view engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

// Routes
app.get('/signup', (req, res) => {
    res.render('signup');
});

app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update user profile
        await updateProfile(user, { displayName: username });

        // Add user data to Firestore
        const userRef = doc(collection(db, 'users'), user.uid);
        await setDoc(userRef, { username, email, uid: user.uid });

        console.log('User signed up:', user);
        res.redirect('/signin');
    } catch (error) {
        console.error('Error signing up:', error);
        res.send('Error signing up');
    }
});

app.get('/signin', (req, res) => {
    res.render('signin');
});

app.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log('User signed in:', user);
        res.redirect('/index');
    } catch (error) {
        console.error('Error signing in:', error);
        res.send('Error signing in');
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
