import React, { Component } from "react";
import { View } from "react-native";
import { Header, Button, Spinner } from "./components/common";
import LoginForm from "./components/LoginForm";
import firebase from "@firebase/app";
import "@firebase/auth";

class App extends Component {
  state = { loggedIn: null };

  componentWillMount() {
    firebase.initializeApp({
      apiKey: "AIzaSyARgFu7QppEhVLZC7vKsGAjsWCBbBqaKr0",
      authDomain: "authentication-cc2f3.firebaseapp.com",
      databaseURL: "https://authentication-cc2f3.firebaseio.com",
      projectId: "authentication-cc2f3",
      storageBucket: "authentication-cc2f3.appspot.com",
      messagingSenderId: "597468724643"
    });

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({ loggedIn: true });
      } else {
        this.setState({ loggedIn: false });
      }
    });
  }

  renderContent() {
    switch (this.state.loggedIn) {
      case true:
        return (
          <Button onPress={() => firebase.auth().signOut()}>Log Out</Button>
        );
      case false:
        return <LoginForm />;
      default:
        return <Spinner />;
    }
  }

  render() {
    return (
      <View>
        <Header headerText="Authentication" />
        {this.renderContent()}
      </View>
    );
  }
}

export default App;
