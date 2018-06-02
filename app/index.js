import Expo from 'expo'
import React from 'react';
import * as firebase from 'firebase'
import {StackNavigator} from 'react-navigation'
import Home from './screens/home'
import Loading from './screens/loading'
import Chat from './screens/chat'
import ChatList from './screens/chatList'

const firebaseConfig = {
	apiKey: "AIzaSyA68mmZE5SKC2x2EQ30NZMgdJntyKb9p_o",
	authDomain: "anon-ffef4.firebaseapp.com",
	databaseURL: "https://anon-ffef4.firebaseio.com",
	projectId: "anon-ffef4",
	storageBucket: "anon-ffef4.appspot.com",
	messagingSenderId: "310908482373"
}

firebase.initializeApp(firebaseConfig)

const apiKey = "cf21678861fc8d8c06f59e04c0768262"
Expo.Amplitude.initialize(apiKey)

const RouteConfigs = {
	Loading: {screen:Loading},
	Home: {screen:Home},
	Chat: {screen:Chat},
	ChatList: {screen:ChatList},
}

const StackNavigatorConfig = {
  headerMode:'none',
}

export default StackNavigator(RouteConfigs, StackNavigatorConfig)
