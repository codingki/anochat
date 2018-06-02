import Expo from 'expo'
import React from 'react';
import * as firebase from 'firebase'
import { Container, Header, Left, Body, Right, Title, Content, Icon  } from 'native-base';
import { StyleSheet, StatusBar, KeyboardAvoidingView, YellowBox, TouchableOpacity, View  } from 'react-native'
import { GiftedChat } from 'react-native-gifted-chat'
import Geocoder from 'react-native-geocoding';

import _ from 'lodash';



export default class Chat extends React.Component {
  state = {

      messages: [],
    }




    componentWillMount() {
      Expo.Amplitude.logEvent("Private Chat Screen")
      YellowBox.ignoreWarnings(['Setting a timer']);
      const _console = _.clone(console);
      console.warn = message => {
        if (message.indexOf('Setting a timer') <= -1) {
          _console.warn(message);
        }
      };

      const user = this.props.navigation.state.params.user
      const profile = this.props.navigation.state.params.profile
      this.chatID = user > profile ? user + '-' + profile : profile + '-' + user
      firebase.database().ref('users').child(this.props.navigation.state.params.user+'/chat/'+this.chatID).update({chatID:this.chatID, uid:this.props.navigation.state.params.profile})
      this.watchChat()







      }

      watchChat = () => {
        firebase.database().ref('chat').child(this.chatID).on('value', snap => {
          let messages = []
          snap.forEach(message => {
            messages.push(message.val())
          })
          messages.reverse()
          this.setState({messages})
        })
      }

      onSend(messages) {
        Expo.Amplitude.logEvent("Log in")
        firebase.database().ref('chat').child(this.chatID)
  .push({
    ...messages[0],
    createdAt: new Date().getTime(),
  })



 }

  render() {


    return (
      <Container style={{backgroundColor: '#fff', }}>
      <View style={styles.statusBar} />
        <Header style={{backgroundColor: '#004cd8'}}>
          <Left>
          <TouchableOpacity
      onPress={() => {

        this.props.navigation.goBack()
      }}
      >
          <Icon type="Ionicons" name="ios-arrow-back" style={{color: 'white'}} />
          </TouchableOpacity>
          </Left>
          <Body>
            <Title>Private Chat</Title>
          </Body>
          <Right/>
        </Header>

        <GiftedChat

        messages={this.state.messages}
          user={{_id: this.props.navigation.state.params.user,avatar: 'https://api.adorable.io/avatars/285/'+this.props.navigation.state.params.user.uid+'.png'}}
          onSend={messages => this.onSend(messages)}
    />
    <KeyboardAvoidingView behavior="padding">

</KeyboardAvoidingView>

      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },statusBar: {
    backgroundColor: "#004cd8",
    height: Expo.Constants.statusBarHeight,
  },
});
