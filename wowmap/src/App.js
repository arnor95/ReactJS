import React, { Component } from "react";

import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import Joi from "joi";
import {
  Card,
  Button,
  CardTitle,
  CardText,
  Form,
  FormGroup,
  Label,
  Input
} from "reactstrap";
import userLocationURL from "./user-icon.png";
import messageLocationURL from "./user.png";
import planeIconURL from "./plane.png";

import "./App.css";

const myIcon = L.icon({
  iconUrl: userLocationURL,
  iconSize: [25, 41],
  iconAnchor: [12.5, 41],
  popupAnchor: [0, -41]
});

const messageIcon = L.icon({
  iconUrl: messageLocationURL,
  iconSize: [45, 45],
  iconAnchor: [22.5, 45],
  popupAnchor: [0, -40]
});

const planeIcon = L.icon({
  iconUrl: planeIconURL,
  iconSize: [70, 70],
  iconAnchor: [22.5, 45],
  popupAnchor: [0, -40]
});

const schema = Joi.object().keys({
  name: Joi.string()
    .min(1)
    .max(500)
    .required(),
  message: Joi.string()
    .min(1)
    .max(500)
    .required()
});

const API_URL =
  window.location.hostname === "localhost"
    ? "https://api.wowkort.fun/api/v1/messages"
    : "https://api.wowkort.fun/api/v1/messages";

class App extends Component {
  state = {
    location: {
      lat: 51.505,
      lng: -0.09
    },
    haveUsersLocation: false,
    zoom: 2,
    userMessage: {
      name: "",
      message: ""
    },
    sendingMessage: false,
    sentMessage: false,
    messages: [],
    KEF: {
      lat: 63.9786,
      lng: -22.635
    },
    LGW: {
      lat: 51.1537,
      lng: -0.1821
    },
    ARN: {
      lat: 59.6498,
      lng: 17.9238
    },
    CPH: {
      lat: 55.618,
      lng: 12.6508
    },
    BCN: {
      lat: 41.2974,
      lng: 2.0833
    },
    CDG: {
      lat: 49.0097,
      lng: 2.5479
    }
  };

  componentDidMount() {
    document.title = "WOW kort";
    fetch(API_URL)
      .then(res => res.json())
      .then(messages => {
        const alreadySentMessage = {};
        messages = messages.reduce((all, message) => {
          const key = `${message.latitude.toFixed(
            4
          )}${message.longitude.toFixed(4)}`;
          if (alreadySentMessage[key]) {
            alreadySentMessage[key].other = alreadySentMessage[key].other || [];
            alreadySentMessage[key].other.push(message);
          } else {
            alreadySentMessage[key] = message;
            all.push(message);
          }
          return all;
        }, []);
        this.setState({
          messages
        });
      });

    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({
          location: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          },
          haveUsersLocation: true,
          zoom: 7
        });
      },
      () => {
        console.log("OH OH");
        fetch("https://ipapi.co/json")
          .then(res => res.json())
          .then(location => {
            console.log(location);
            this.setState({
              location: {
                lat: location.latitude,
                lng: location.longitude
              },
              haveUsersLocation: true,
              zoom: 13
            });
          });
      }
    );
  }

  formIsValid = () => {
    const userMessage = {
      name: this.state.userMessage.name,
      message: this.state.userMessage.message
    };
    const result = Joi.validate(userMessage, schema);

    return !result.error && this.state.haveUsersLocation ? true : false;
  };

  formSubmitted = event => {
    event.preventDefault();
    console.log(this.state.userMessage);
    if (this.formIsValid()) {
      this.setState({
        sendingMessage: true
      });
      fetch(API_URL, {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          name: this.state.userMessage.name,
          message: this.state.userMessage.message,
          latitude: this.state.location.lat,
          longitude: this.state.location.lng
        })
      })
        .then(res => res.json())
        .then(message => {
          console.log(message);
          setTimeout(() => {
            this.setState({
              sendingMessage: false,
              sentMessage: true
            });
          }, 4000);
        });
    }
  };

  valueChanged = event => {
    const { name, value } = event.target;
    this.setState(prevState => ({
      userMessage: {
        ...prevState.userMessage,
        [name]: value
      }
    }));
  };

  render() {
    const position = [this.state.location.lat, this.state.location.lng];
    const KEFposition = [this.state.KEF.lat, this.state.KEF.lng];
    const LGWposition = [this.state.LGW.lat, this.state.LGW.lng];
    const ARNposition = [this.state.ARN.lat, this.state.ARN.lng];
    const CPHposition = [this.state.CPH.lat, this.state.CPH.lng];
    const BCNposition = [this.state.BCN.lat, this.state.BCN.lng];
    const CDGposition = [this.state.CDG.lat, this.state.CDG.lng];

    return (
      <div className="map">
        <Map className="map" center={position} zoom={this.state.zoom}>
          <TileLayer
            attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={KEFposition} icon={planeIcon}>
            <Popup>
              Take a flight to Keflavik and see the northern lights in Iceland!
            </Popup>
          </Marker>
          <Marker position={LGWposition} icon={planeIcon}>
            <Popup>
              Take a trip to London and shop all of your christmas presents!
            </Popup>
          </Marker>
          <Marker position={ARNposition} icon={planeIcon}>
            <Popup>Hej allihoopa!</Popup>
          </Marker>
          <Marker position={CPHposition} icon={planeIcon}>
            <Popup>Jeg spiste flødeskum for morgenmad!</Popup>
          </Marker>
          <Marker position={BCNposition} icon={planeIcon}>
            <Popup>Hola amigo, tengo mucho dinero? Muy bien!</Popup>
          </Marker>
          <Marker position={CDGposition} icon={planeIcon}>
            <Popup>Vive la France!</Popup>
          </Marker>

          {this.state.haveUsersLocation ? (
            <Marker position={position} icon={myIcon} />
          ) : (
            ""
          )}
          {this.state.messages.map(message => (
            <Marker
              key={message._id}
              position={[message.latitude, message.longitude]}
              icon={messageIcon}
            >
              <Popup>
                <p>
                  <em>{message.name}:</em> {message.message}
                </p>
                {message.other
                  ? message.other.map(message => (
                      <p key={message._id}>
                        <em>{message.name}:</em> {message.message}
                      </p>
                    ))
                  : ""}
              </Popup>
            </Marker>
          ))}
        </Map>
        <Card body className="message-form">
          <CardTitle>Welcome to WOW Departures!</CardTitle>
          <CardText>
            Leave a message with your dream get away destination along with your
            location.
          </CardText>
          <CardText>Have a WOW trip!</CardText>
          {!this.state.sendingMessage && !this.state.sentMessage ? (
            <Form onSubmit={this.formSubmitted}>
              <FormGroup>
                <Label for="name">Name</Label>
                <Input
                  onChange={this.valueChanged}
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Enter your name"
                />
              </FormGroup>
              <FormGroup>
                <Label for="message">Enter a message</Label>
                <Input
                  onChange={this.valueChanged}
                  type="textarea"
                  name="message"
                  id="message"
                  placeholder="Enter your message"
                />
              </FormGroup>
              <Button type="submit" color="info" disabled={!this.formIsValid()}>
                Send
              </Button>{" "}
            </Form>
          ) : this.state.sendingMessage ? (
            <img
              alt="nice plane"
              src="https://media.giphy.com/media/5UA7aySzCggLsaQaEA/giphy.gif"
            />
          ) : (
            <CardText>Thanks for submitting your dream location!</CardText>
          )}
        </Card>
      </div>
    );
  }
}

export default App;
