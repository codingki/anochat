import Expo from 'expo'
import React from 'react';
import * as firebase from 'firebase'
import { Container, Header, Left, Body, Right, Title, Content, Icon, List, ListItem, Thumbnail  } from 'native-base';
import { StyleSheet, StatusBar, KeyboardAvoidingView, YellowBox, TouchableOpacity, ListView, Text, View, Dimensions, ScrollView  } from 'react-native'
import { GiftedChat } from 'react-native-gifted-chat'
import Geocoder from 'react-native-geocoding';

import _ from 'lodash';
const {width, height} = Dimensions.get('window')


export default class ChatList extends React.Component {

  state= {

      bars:[]
    }



    componentWillMount() {
      Expo.Amplitude.logEvent("Chat List Screen")
      YellowBox.ignoreWarnings(['Setting a timer']);
      const _console = _.clone(console);
      console.warn = message => {
        if (message.indexOf('Setting a timer') <= -1) {
          _console.warn(message);
        }
      };

        this.watchBar()
      }



      watchBar = () => {
       firebase.database().ref('/users/' + this.props.navigation.state.params.user).child('chat').on('value', snap => {
        let bars = []
        snap.forEach(bar => {
          bars.push(bar.val())
        })
        bars.reverse()


        this.setState({bars})

      })

    }

    // lastMessage = (chatID) => {
    //
    //   firebase.database().ref('chat').child(chatID).limitToLast(1).on('value', snap => {
    //     let msgs = []
    //     snap.forEach(msg => {
    //       msgs.push(msg.val())
    //     })
    //
    //
    //     return msgs[0].text
    //
    //
    //   })
    // }



  render() {


    return (
      <Container style={{backgroundColor: '#fff',}}>
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
            <Title>People</Title>
          </Body>
          <Right/>
        </Header>
        <Content >
        <View style={{flex:1, flexDirection: 'row', flexWrap: 'wrap',justifyContent:'center'}}>

        {
          this.state.bars.map((item , i) => {
            return(
              <View key={i} style={{marginRight:10,marginLeft:10,marginTop:20}}>
              <TouchableOpacity onPress={() => {
                  this.props.navigation.navigate('Chat', {user:this.props.navigation.state.params.user, profile:item.uid, })
              }}>
              <Thumbnail source={{ uri: 'https://api.adorable.io/avatars/285/'+item.uid+'.png' }} />
              </TouchableOpacity>
              </View>

            )
          })
        }
        </View>
        </Content>


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
