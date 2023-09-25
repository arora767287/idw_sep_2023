import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {Provider} from 'react-native-paper';
import { useFonts } from 'expo-font';
import HomeScreen from './components/HomeScreen';
import LoginScreen from './components/LoginScreen';
import Forgot from './components/Forgot';
import Signup from './components/Signup';
import ProfileScreen from './components/ProfileScreen';
import EditProfile from './components/EditProfile';
import Category from './components/Category';
import MyTabs from './components/MyTabs';
import Offer from './components/Offer';
import Wallet from './components/Wallet';
import Question from './components/Question';
import ShowDocs from './components/ShowDocs';
import Info from './components/Info';
import RetriveWallet from './components/RetriveWallet';
import ViewCard from './components/ViewCard';
import Address from './components/Address';
import Notification from './components/Notification';
import NewWallet from "./components/NewWallet";
import Transactions from "./components/Transactions";
import Account from "./components/Account";
import AllCards from "./components/AllCards";
import Facereaction from "./components/Facereaction";
import Uncomplete_Question from "./components/Uncomplete_Question";
import Transactionplist from "./components/Transactionplist";
import Cardtransactionlist from "./components/Cardtransactionlist";
import Couponllist from "./components/Couponllist";
import Slideshow from "./components/Slideshow";
import {PlaidProvider} from 'react-native-use-plaid';
export default function App() {
  const Stack = createNativeStackNavigator();
  
  return (

    <Provider>
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          initialRouteName="HomeScreen"
          name='HomeScreen'
          component={HomeScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Forgot"
          component={Forgot}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Signup"
          component={Signup}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="ProfileScreen"
          component={ProfileScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="EditProfile"
          component={EditProfile}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          options={{ headerShown: false }}
          name="MyTabs" component={MyTabs} />

        <Stack.Screen
          name="Question"
          component={Question}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Offer"
          component={Offer}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="ShowDocs"
          component={ShowDocs}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Info"
          component={Info}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="RetriveWallet"
          component={RetriveWallet}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="ViewCard"
          component={ViewCard}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Address"
          component={Address}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Notification"
          component={Notification}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Transactions"
          component={Transactions}
          options={{headerShown: false}}
        />

        <Stack.Screen
        name="Account"
        component = {Account}
        options={{headerShown: false}}
        />

        <Stack.Screen
          name="Category"
          component={Category}
          options={{ headerShown: false }}
        />
      
        <Stack.Screen
          name="Facereaction"
          component={Facereaction}
          options={{ headerShown: false }}
        />

      <Stack.Screen
          name="Transactionplist"
          component={Transactionplist}
          options={{ headerShown: false }}
        />

      <Stack.Screen
          name="Cardtransactionlist"
          component={Cardtransactionlist}
          options={{ headerShown: false }}
        />

    <Stack.Screen
          name="Couponllist"
          component={Couponllist}
          options={{ headerShown: false }}
        />

<Stack.Screen
          name="Slideshow"
          component={Slideshow}
          options={{ headerShown: false }}
        />


      </Stack.Navigator>
    </NavigationContainer>
    </Provider>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
