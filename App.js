import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { StackNavigator } from 'react-navigation';

import {
    HomeScreen,
    CameraScreen,
    CameraScreen2,
    CameraPreviewScreen,
    LoginScreen
} from './app/screens';

const Routes = {
    Login: {
      screen: LoginScreen,
    },
    Home: {
        screen: HomeScreen,
    },
    Camera: {
      screen: CameraScreen2,
    },
    Preview: {
      screen: CameraPreviewScreen
    }
};

const RoutesConfig = {
    headerMode: 'none'
}

const RootNavigator = StackNavigator(Routes, RoutesConfig);

export default class App extends React.Component {
    render() {
        return <RootNavigator />;
    }
}