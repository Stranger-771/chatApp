import React, { useState } from 'react';
import './App.css';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import {useAuthState } from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyBAKk2jNqqqL378K9UkcR77iEYugPrvbmY",
  authDomain: "superchat-6a8b8.firebaseapp.com",
  projectId: "superchat-6a8b8",
  storageBucket: "superchat-6a8b8.appspot.com",
  messagingSenderId: "1049559738058",
  appId: "1:1049559738058:web:c91182bdcddeb205b0b633"

})
const auth = firebase.auth();
const firestore= firebase.firestore();

function App() {
  const [user] =useAuthState(auth);
  return (
    <div className="App">
      <header>
        <h1>⚛️🔥💬 </h1>
        <signOut/>
       
      </header>
      <section>
        {user ? <ChatRoom/> :<SignIn/>}
      </section>
    </div>
  );
}

function SignIn(){

  const signInWithGoogle =() => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  return(
    <>
    <button className='sign-in' onClick ={signInWithGoogle}>Sign In With Google</button>
    <p>Do not violate the community guidelines or else you will be banned</p>
      </>
  )
}

function ChatRoom(){
  const dummy = useRef();
  const messageRef = firestore.collection('messages');
  const query = messageRef.orderBy('createdAt').limit(25);

  const [messages ] = useCollectionData(query, {idField: 'id'});
  const [formValue, setFormValue] = useState('');

  const sendMessage =async(e) => {
    e.preventDefault();

    const {uid, photoURL} = auth.currentUser;

    await messageRef.add({
      text:formValue,
      createdAt: firebase.firestore.FieldValue.serverTimeStamp(),
      uid,
      photoURL
    })
    setFormValue('');
    dummy.current.scrollIntoView({behaviour: 'smooth'});
  }
  return(
    <>
    <main>
      {messages && messages.map(msg => <ChatMessage key ={msg.id} message={msg}/>)}
      <span ref={dummy}> </span>
    </main>
    <form>
      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="say something nice" />

      <button type= "submit" disabled ={!formValue}>🕊️</button>

    </form>
    </>)
}

function ChatMessage(props) {
  const{text, uid, photoURL} = props.message;

  const messageClass =uid === auth.currentUser.uid ? 'sent' : 'received';
  return(<>
  <div className={'message ${messageClass}'}>
    <img src={photoURL || "https://api.adorable.io/avatars/23/abott@adorable.png"}/>
    <p>{text}</p>

  </div>
  </>)
}

export default App;
