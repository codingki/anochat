import Expo from 'expo'
import React from 'react';
import * as firebase from 'firebase'
import { Container, Header, Left, Body, Right, Title, Content, Icon,ActionSheet  } from 'native-base';
import { StyleSheet, StatusBar, KeyboardAvoidingView, YellowBox, TouchableOpacity, View  } from 'react-native'
import { GiftedChat } from 'react-native-gifted-chat'
import Geocoder from 'react-native-geocoding';

import _ from 'lodash';



export default class App extends React.Component {
  state = {
      location: 'World',
      messages: [],
    }




    componentWillMount() {
      Expo.Amplitude.logEvent("Home Screen")

      YellowBox.ignoreWarnings(['Setting a timer']);
const _console = _.clone(console);
console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};

this.watchChat()






      }



      watchChat = () => {
        firebase.database().ref('messages').orderByChild("location").equalTo(this.state.location).limitToLast(100).on('value', snap => {
          let messages = []
          snap.forEach(message => {
            messages.push(message.val())
          })
          messages.reverse()
          this.setState({messages})
        })
      }
      changeLoc = (location) => {
        firebase.database().ref('messages').orderByChild("location").equalTo(location).limitToLast(100).on('value', snap => {
          let messages = []
          snap.forEach(message => {
            messages.push(message.val())
          })
          messages.reverse()
          this.setState({messages})
        })
      }

      onSend(messages) {
        Expo.Amplitude.logEventWithProperties("Home Message Sent", {
      city:this.props.navigation.state.params.user.city
    })
            firebase.database().ref('messages')
               .push({
                 ...messages[0],
                 createdAt: new Date().getTime(),
                 location: this.state.location,
                 city:this.props.navigation.state.params.user.city,
                 province:this.props.navigation.state.params.user.province,
                 country:this.props.navigation.state.params.user.country
               })



 }

  render() {


    return (
      <Container style={{backgroundColor: '#fff',}}>
        <View style={styles.statusBar} />
        <Header style={{backgroundColor: '#004cd8'}}>
        <Left>
        <TouchableOpacity
    onPress={() => {
        ActionSheet.show({
        options: [
          this.props.navigation.state.params.user.city, this.props.navigation.state.params.user.province,this.props.navigation.state.params.user.country, "World", "Cancel"
        ],
        cancelButtonIndex: 4,
        title: "Change channel"
      }, buttonIndex => {
        // this 'buttonIndex value is a string on android and number on ios :-(

        if (buttonIndex + "" === '0') {
          this.setState({location:this.props.navigation.state.params.user.city})
          this.changeLoc(this.props.navigation.state.params.user.city)
        } else if (buttonIndex + "" === '1') {
          this.setState({location:this.props.navigation.state.params.user.province})
          this.changeLoc(this.props.navigation.state.params.user.province)
        } else if (buttonIndex + "" === '2') {
          this.setState({location:this.props.navigation.state.params.user.country})
          this.changeLoc(this.props.navigation.state.params.user.country)
        }else if (buttonIndex + "" === '3') {
          this.setState({location:'World'})
          this.changeLoc('World')
        }else {
          console.log('nothing')
        }
      })
}
    }
    >
        <Icon type="Ionicons" name="md-globe" style={{color: 'white'}} />
        </TouchableOpacity>
        </Left>
          <Body>
            <Title>{this.state.location}</Title>
          </Body>
          <Right>
          <TouchableOpacity
      onPress={() => {

        this.props.navigation.navigate('ChatList', {user:this.props.navigation.state.params.user.uid})
      }}
      >
          <Icon type="Ionicons" name="md-chatbubbles" style={{color: 'white'}} />
          </TouchableOpacity>

          </Right>
        </Header>

        <GiftedChat
        onPressAvatar={(user) => {

          this.props.navigation.navigate('Chat', {user:this.props.navigation.state.params.user.uid, profile:user._id, })
        }}
        messages={this.state.messages}
          user={{_id: this.props.navigation.state.params.user.uid,avatar: 'https://api.adorable.io/avatars/285/'+this.props.navigation.state.params.user.uid+'.png'}}
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
  },
  statusBar: {
    backgroundColor: "#004cd8",
    height: Expo.Constants.statusBarHeight,
  },
});
