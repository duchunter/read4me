import React from 'react';
import { UIManager, AppState } from 'react-native';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { Root } from 'native-base';
import SplashScreen from 'react-native-splash-screen';
import OneSignal from 'react-native-onesignal';

import { ONESIGNAL_APPID, IS_IOS } from 'read4me/config/config';

import RootStack from './navigation';
import store from './reducers';

// Enable LayoutAnimtion
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

export default class App extends React.Component {
  // Setup OneSignal
  componentWillMount() {
    try {
      //OneSignal.init(ONESIGNAL_APPID);
      //OneSignal.inFocusDisplaying(2);
    } catch (e) {

    }

    OneSignal.addEventListener('received', () => {});
    OneSignal.addEventListener('opened', () => {});
  }

  // Hide SplashScreen
  componentDidMount() {
    // IOS SplashScreen
    if (IS_IOS) {
      SplashScreen.hide();
    }

    // Android SplashScreen
    else {
      setTimeout(SplashScreen.hide, 100);
    }
  }

  // Remove OneSignal event listener
  componentWillUnmount() {
    OneSignal.removeEventListener('received', this.onReceived);
    OneSignal.removeEventListener('opened', this.onOpened);
  }

  render() {
    return (
      <Provider store={store}>
        <Root>
          <RootStack />
        </Root>
      </Provider>
    );
  }
}
