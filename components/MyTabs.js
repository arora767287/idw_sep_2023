import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Button, TouchableOpacity, Text, Image, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProfileScreen from "./ProfileScreen.js";
import Info from './Info.js';
import Wallet from './Wallet.js';
import Question from './Question.js';
import Offer from './Offer.js';
import ShowDocs from './ShowDocs.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { customstyles } from '../customstyle.js';
import { commonPost } from './functions.js';
import NewWallet from './NewWallet.js';
import AllCards from './AllCards.js';
import ViewBeneficaryAcc from './ViewBeneficaryAcc.js';
import TransferAmt from './TransferAmt.js';
import ViewVirtual from './ViewVirtual.js';
import AddBeneficaryAcc from "./AddBeneficaryAcc"
import RetriveWallet from "./RetriveWallet"
import Category from "./Category.js";
import Cardtransactionlist from "./Cardtransactionlist";
import Transactionplist from "./Transactionplist";
import Couponllist from "./Couponllist";
import Transactions from "./Transactions";
import Messages from "./Messages";
import Uncomplete_Question from "./Uncomplete_Question"

const Tab = createBottomTabNavigator();
function MyTabs({ navigation, route }) {

    const [userId, setUserId] = useState('');
    const [userData, setUserData] = useState('');

    useEffect(() => {
        const value = AsyncStorage.getItem('userInfo')
            .then((value) => {
                let userData = JSON.parse(value);
                setUserData(userData);
                setUserId(userData.id);
            });
    }, []);

    return (
        <View style={styles.screenContainer}>
            <Tab.Navigator screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === "Info") {
                        iconName = focused ? 'pencil' : 'pencil-outline'
                    }
                    else if (route.name === "Profile") {
                        iconName = focused ? 'account-circle' : 'account-circle-outline'
                    }
                    else if (route.name === "Wallet") {
                        iconName = focused ? 'wallet' : 'wallet-outline'
                    }
                    else if (route.name === "Question") {
                        iconName = focused ? 'format-list-bulleted-square' : 'format-list-checkbox'
                    }
                    else if (route.name === "Offer") {
                        iconName = focused ? 'storefront' : 'storefront-outline'
                    }
                    return <MaterialCommunityIcons name={iconName} size={20} color={"#663792"} style={{ height: 20 }} />;
                },
                tabBarStyle: { position: 'absolute', zIndex: 2, bottom: 0, borderTopLeftRadius: 40, borderTopRightRadius: 40, overflow: "hidden", height: "10%"},
                tabBarLabelStyle: {
                    fontSize: 12,
                    marginBottom: 10,
                },
                tabBarInactiveTintColor: "#663792",
                //tabBarInactiveTintColor:{ "#fff"},
                tabBarActiveTintColor: '#663792',
                tabBarActiveBackgroundColor: "rgba(255, 255, 255, .2)",
                tabBarBackground: () => (
                    <LinearGradient colors={['#fff', '#fff', '#fff']} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} style={{ height: "100%" }} >
                    </LinearGradient>
                ),
            })
            }
            >
                <Tab.Screen 
                    name='Profile' 
                    component={ProfileScreen} 
                    initialRouteName={ProfileScreen} 
                    options={({ navigation }) => ({
                        headerShown: false,
                        tabBarButton: (props) => (
                            <TouchableOpacity
                                {...props}
                                onPress={() =>
                                    navigation.push('MyTabs', { user_id: userId })
                                }
                            />
                        ),
                    })}/>
                <Tab.Screen
                    name="Info"
                    component={Info}
                    options={({ navigation }) => ({
                        headerShown: false,
                        tabBarButton: (props) => (
                            <TouchableOpacity
                                {...props}
                                onPress={() =>
                                    navigation.navigate('Info', { user_id: userId })
                                }
                            />
                        ),
                    })}
                />
                
                <Tab.Screen
                    name="Wallet"
                    component={NewWallet}
                    options={({ navigation }) => ({
                        headerShown: false,
                        tabBarButton: (props) => (
                            <TouchableOpacity
                                {...props}
                                onPress={() =>
                                    navigation.navigate('Wallet', { user_id: userId })
                                }
                            />
                        ),
                    })}
                />
                <Tab.Screen
                    name="Question"
                    component={Question}
                    options={({ navigation }) => ({
                        headerShown: false,
                        tabBarButton: (props) => (
                            <TouchableOpacity
                                {...props}
                                onPress={() =>
                                    navigation.navigate('Question', { user_id: userId })
                                }
                            />
                        ),
                    })}
                />
                <Tab.Screen
                    name="Offer"
                    component={Offer}
                    options={({ navigation }) => ({
                        headerShown: false,
                        tabBarButton: (props) => (
                            <TouchableOpacity
                                {...props}
                                onPress={() =>
                                    {
                                        console.log("Navigating");
                                        navigation.navigate('Offer', { user_id: userId, userDetails: userData })
                                    }
                                }
                            />
                        ),
                    })}
                />


                <Tab.Screen
                    name="AllCards"
                    component={AllCards}
                    options={({ navigation }) => ({
                        tabBarButton: () => null,
                        tabBarVisible:false, //hide tab bar on this screen
                        headerShown: false
                    })}
                />

                <Tab.Screen
                    name="TransferAmt"
                    component={TransferAmt}
                    options={({ navigation }) => ({
                        tabBarButton: () => null,
                        tabBarVisible:false, //hide tab bar on this screen
                        headerShown: false
                    })}
                />
                <Tab.Screen
                    name="ViewVirtual"
                    component={ViewVirtual}
                    options={({ navigation }) => ({
                        tabBarButton: () => null,
                        tabBarVisible:false, //hide tab bar on this screen
                        headerShown: false
                    })}
                />
                <Tab.Screen
                    name="ViewBeneficaryAcc"
                    component={ViewBeneficaryAcc}
                    options={({ navigation }) => ({
                        tabBarButton: () => null,
                        tabBarVisible:false, //hide tab bar on this screen
                        headerShown: false
                    })}
                />

                <Tab.Screen
                    name="RetriveWallet"
                    component={RetriveWallet}
                    options={({ navigation }) => ({
                        tabBarButton: () => null,
                        tabBarVisible:false, //hide tab bar on this screen
                        headerShown: false
                    })}
                />

                <Tab.Screen
                    name="AddBeneficaryAcc"
                    component={AddBeneficaryAcc}
                    options={({ navigation }) => ({
                        tabBarButton: () => null,
                        tabBarVisible:false, //hide tab bar on this screen
                        headerShown: false
                    })}
                />

                <Tab.Screen
                    name="Transactions"
                    component={Transactions}
                    options={({ navigation }) => ({
                        tabBarButton: () => null,
                        tabBarVisible:false, //hide tab bar on this screen
                        headerShown: false
                    })}
                />

                <Tab.Screen
                    name="Cardtransactionlist"
                    component={Cardtransactionlist}
                    options={({ navigation }) => ({
                        tabBarButton: () => null,
                        tabBarVisible:false, //hide tab bar on this screen
                        headerShown: false
                    })}
                />
                
                <Tab.Screen
                    name="Transactionplist"
                    component={Transactionplist}
                    options={({ navigation }) => ({
                        tabBarButton: () => null,
                        tabBarVisible:false, //hide tab bar on this screen
                        headerShown: false
                    })}
                />

                <Tab.Screen
                    name="Couponllist"
                    component={Couponllist}
                    options={({ navigation }) => ({
                        tabBarButton: () => null,
                        tabBarVisible:false, //hide tab bar on this screen
                        headerShown: false
                    })}
                />
                
                <Tab.Screen
                    name="Messages"
                    component={Messages}
                    options={({ navigation }) => ({
                        tabBarButton: () => null,
                        tabBarVisible:false, //hide tab bar on this screen
                        headerShown: false
                    })}
                />


                <Tab.Screen
                    name="Uncomplete_Question"
                    component={Uncomplete_Question}
                    options={({ navigation }) => ({
                        tabBarButton: () => null,
                        tabBarVisible:false, //hide tab bar on this screen
                        headerShown: false
                    })}
                />

                

            </Tab.Navigator>

        </View>
    )
}
const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
    },
    linearGradient: {
        height: 55,
        justifyContent: "center",
        zIndex: 1,
        position: "absolute",
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    }
})
export default MyTabs;