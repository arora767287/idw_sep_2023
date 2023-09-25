import { registerRootComponent } from 'expo';

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
import { AppRegistry } from 'react-native';
try{
    AppRegistry.registerComponent('main',() => App);
}
catch(error){
    console.log(error.stack)
}

