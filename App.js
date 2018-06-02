import React from 'react';
import Expo from 'expo';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { AppLoading, Asset, Font } from 'expo';
import { Root } from "native-base";
import { Ionicons } from '@expo/vector-icons';
import Navigator from './app/index'


export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
  };

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <Root>


          <Navigator/>

        </Root>
      );
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('./assets/logo.png'),
        require('./assets/icon.png'),
      ]),

      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Ionicons.font,
        'Roboto_medium': require("native-base/Fonts/Roboto_medium.ttf"),
        'Ionicons': require("@expo/vector-icons/fonts/Ionicons.ttf"),
        'FontAwesome': require("@expo/vector-icons/fonts/FontAwesome.ttf")
      }),
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

});



Expo.registerRootComponent(App);
