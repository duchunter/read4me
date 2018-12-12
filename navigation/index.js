import { createStackNavigator, createAppContainer } from 'react-navigation';

import AppScreen from 'read4me/containers/AppScreen';

const AppNavigator = createStackNavigator(
  {
    App: AppScreen,
  },
  {
    initialRouteName: 'App',
    defaultNavigationOptions: {
      header: null
    }
  }
);

export default createAppContainer(AppNavigator);
