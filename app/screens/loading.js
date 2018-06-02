import Expo from 'expo'
import Geocoder from 'react-native-geocoding';
import { Permissions, Notifications } from 'expo'

import { NavigationActions } from 'react-navigation'
import React, { Component } from 'react';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon,Animated } from 'native-base';
import {View, StyleSheet, ActivityIndicator,Text,Image,Dimensions,StatusBar,TouchableOpacity, Alert, YellowBox, Linking
} from 'react-native'
import * as firebase from 'firebase'
const {width, height} = Dimensions.get('window')

export default class Loading extends Component {
  state= {
    loading: "Loading...",

  }

  loading = (a) => {

      return(
      <Text style={{justifyContent:'center',
      alignItems:'center',}}>{a}</Text>
      )

  }

  componentWillMount() {
    console.disableYellowBox = true;


    firebase.auth().onAuthStateChanged(auth => {
      if (auth) {
        this.setState({
          uid:auth.uid
        })
        this._getLocationAsync()






      } else {
        Alert.alert(
          'License Agreement',
          'by pressing ok you agree to our privacy policy',
          [
            {text: 'Read Privacy policy', onPress: () => { Linking.openURL('http://kanebat.com/codingki/anochat/privacypolicy.html')
            this.setState({loading:'Please restart the app'})
          }
          },

            {text: 'OK', onPress: () => {
              firebase.auth().signInAnonymously().catch(function(error) {
              // Handle Errors here.
              var errorCode = error.code;
              var errorMessage = error.message;
              // ...
              });
            }},
          ],
          { cancelable: true }
        )

      }
    })


  }


  goHome(user) {
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'Home', params:{user}}),
      ],
    })
    this.props.navigation.dispatch(resetAction)
  }

  _getLocationAsync = async () => {
 let { status } = await Expo.Permissions.askAsync(Expo.Permissions.LOCATION);
 if (status !== 'granted') {
   this.setState({
     errorMessage: 'Permission to access location was denied',
   });
 }
 let gps = await Expo.Location.getProviderStatusAsync()

 if (gps.locationServicesEnabled == false) {
   this.setState({loading:'Location disabled, please turn on the location then restart the app'})
   Alert.alert(
       'Location Disabled',
       'Turn on your location then restart the app',

     )
 }



 let location = await Expo.Location.getCurrentPositionAsync({enableHighAccuracy: false})
 this.setState({ location });

 Geocoder.init('AIzaSyCUzrRtSVn8ysEaE_-aaecKpNTqGhbsD4M');
 Geocoder.from(this.state.location.coords.latitude, this.state.location.coords.longitude).then(json => {
   var addressComponent = json.results[0].address_components[4].long_name;
   var state = json.results[0].address_components[5].long_name;
   var country = json.results[0].address_components[6].long_name;

     this.setState({city:addressComponent})
     const user = {
       uid:this.state.uid,
       city:addressComponent,
       province:state,
       country:country
     }


         Expo.Amplitude.setUserId(this.state.uid)
         Expo.Amplitude.setUserProperties(user)
         Expo.Amplitude.logEvent("Log in")
         this.goHome(user)

 }).catch(error => console.warn(error));

};





render() {
  return (

<View style={styles.container}>

<Image style={styles.logo} source={require('../../assets/logo.png')}/>
    <Text style={styles.status}>{this.loading(this.state.loading)}</Text>
</View>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    backgroundColor: '#004cd8',
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  },
  logo:{
    resizeMode: 'contain',
    width: width/2
  },
  status:{

    color:'#fff', fontSize:16,
  }

})
