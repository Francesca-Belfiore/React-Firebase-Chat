import { useEffect, useState } from 'react';
import { db } from './firebase';
import { addDoc, collection, onSnapshot } from "firebase/firestore";
//collection è la raccolta di informazioni che ho nel database (db)
//getDocs è l'utility che mi ritorna i dati della collection
// import { Scrollbars } from 'react-custom-scrollbars';
import './App.css';

function App() {
  const [ messages, setMessages ] = useState([]);
  const [ text, setText ] = useState("");
  const user = "User" + Math.floor(Math.random() * 100);  
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
      // VERSIONE "STATICA" - legge 1 sola volta i dati
      // const querySnapshot = await getDocs(collection(db, "messages"));
      // console.log(querySnapshot);
      // const currentMessages = querySnapshot.docs.map((doc) => {
      //   const obj = {
      //     id: doc.id,
      //     ...doc.data(),
      //   };
      //   return obj;
      // });
      // console.log(currentMessages);
      // setMessages(currentMessages);
    
    //firebase ritorna uno snapshot del database com'è in quel momento
    //perché è un database di documenti, non un database strutturato

    //il database non relazionale (no sql) sono disordinati ma concedono
    //l'accesso diretto al dato senza transpiling di tutti i dati prima
    //di esso che richiede tempo
    };
    getData();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const newMessage = { user, text, time };
    console.log(newMessage);
    addDoc(collection(db, "messages"), newMessage);
    setText("");
  };

  const sortedMessages = messages.sort(function(x, y){
    return  new Date(x.time) - new Date(y.time);
  })

  return (
    <div className="App">
      <h1>🔥 Fire Chat!</h1>

      {/* <Scrollbars style={{ width: 500, height: 300 }}> */}
        <ul>
          { sortedMessages.map((message, index) => (
            <li key={index}>
              <h4>{message.user}</h4>
              <p>{message.text}</p>
              <small>{new Date(message.time).getHours()}:{(new Date(message.time).getMinutes()<10?'0':'') + new Date(message.time).getMinutes()}</small>
            </li>
          ))}
        </ul>
      {/* </Scrollbars> */}

      <form onSubmit={handleSubmit}>
        <input
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
