import { useEffect, useState, useRef, useCallback } from 'react';
import { db } from './firebase';
import { addDoc, collection, onSnapshot } from "firebase/firestore";
import './App.css';

function App() {
  const [ messages, setMessages ] = useState([]);
  const [ text, setText ] = useState("");
  const [ user, setUser ] = useState("User" + Math.floor(Math.random() * 100));  
  const time = new Date().toISOString();

  //VERSIONE REALTIME - ripete la callback ogni volta che la collection cambia
  useEffect(() => {
    const getData = async () => {
      onSnapshot(collection(db, "messages"), (collection) => {
        const currentMessages = collection.docs.map((doc) => {
          const obj = {
            id: doc.id,
            ...doc.data(),
          };
          return obj;
        });
        setMessages(currentMessages);
      });
    };
    getData();
  }, []);

  const handleSubmit = useCallback((event) => {
      event.preventDefault();
      const newMessage = { user, text, time };
      console.log(newMessage);
      addDoc(collection(db, "messages"), newMessage);
      setText("");
    }, [text, time, user]
  );

  const sortedMessages = messages.sort(function(x, y){
    return  new Date(x.time) - new Date(y.time);
  })

  const messageRef = useRef();

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView(
        {
          behavior: 'smooth',
          block: 'end',
          inline: 'nearest'
        })
    }
  }, [handleSubmit]);

  return (
    <div className="App">

      <label htmlFor="nameInput">Username:</label>
      <input className="nameInput"
        name="nameInput"
        placeholder="Write your name"
        type="text"
        value={user}
        onChange={(e) => setUser(e.target.value)}
      />

      <h1>🔥 Fire Chat!</h1>

      <ul>
        { sortedMessages.map((message, index) => (
          <li ref={messageRef} key={index} className={user === message.user ? "currentUser" : ""}>
            <h4>{message.user}</h4>
            <p>{message.text}</p>
            <small>{new Date(message.time).getHours()}:{(new Date(message.time).getMinutes()<10?'0':'') + new Date(message.time).getMinutes()}</small>
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit}>
        <input className="msgInput"
          placeholder="Write a message"
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </form>

    </div>
  );
}

export default App;