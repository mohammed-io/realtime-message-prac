import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import firebase from "firebase";

firebase.initializeApp({
  apiKey: "AIzaSyAsKbsjPKuH4MCWbfcFgq10UtafKdYzSFo",
  authDomain: "nyan-4be65.firebaseapp.com",
  databaseURL: "https://nyan-4be65.firebaseio.com",
  projectId: "nyan-4be65",
  storageBucket: "",
  messagingSenderId: "1080099173418"
});

firebase.firestore().settings({ timestampsInSnapshots: true });


Array.prototype.groupBy = function(key) {
  return this.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
}


const FireStore = firebase.firestore();

class App extends Component {
  state = {
    messages: [],
    users: [],
    username: "mohammed"
  };

  componentDidMount() {

    FireStore.collection('users')
      .onSnapshot(snap => {
        this.setState({users: snap.docs.map(d => d.data())
          .filter(u => u.username != this.state.username)})
      })

    FireStore.collection("nyanise")
      .where("to", "==", this.state.username)
      .onSnapshot(snap => {
        this.setState({
          messages: snap.docs.map(d => ({ ...d.data(), id: d.id }))
        }, () => console.log(this.state.messages.groupBy('to')));
      });
  }

  render() {
    const grouped = this.state.messages.groupBy('from');

    return (<div>
      <p>Users:</p>
      <ul>
        {
          this.state.users.map(u => <li>{u.username}</li>)
        }
      </ul>

      {Object.keys(grouped).map(k => (
        <div>
          <p>Messages from {k}</p>
          <ul>
            {grouped[k].map(x => (<li>{x.text}</li>))}
          </ul>
        </div>
      ))}
    </div>);
  }
}

export default App;
