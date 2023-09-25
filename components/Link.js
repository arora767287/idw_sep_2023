
import React from 'react';
import { Alert, StyleSheet, View, Button, Dimensions, TouchableOpacity, Text, Image, ImageBackground, ScrollView, Modal, SafeAreaView} from 'react-native';
import { customstyles } from '../customstyle';
import Icon from 'react-native-ionicons'
import TranItem from "./TranItem";
import {getBalance, transactionlist, commonPost, linkTokenCreation} from "./functions.js";
import { AntDesign } from '@expo/vector-icons'; 
import Dialog from "react-native-dialog";
import SearchBar from "react-native-dynamic-search-bar";
import Loader from "./Loader";
import Moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePlaidLink } from 'react-plaid-link';
interface LinkProps {
    linkToken: string | null;
  }
  const Link: React.FC<LinkProps> = (props: LinkProps) => {
    const onSuccess = React.useCallback((public_token, metadata) => {
      // send public_token to server
      const response = fetch('/api/set_access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ public_token }),
      });
      // Handle response ...
    }, []);
    const config: Parameters<typeof usePlaidLink>[0] = {
      token: props.linkToken,
      receivedRedirectUri: window.location.href,
      onSuccess,
    };
    const { open, ready } = usePlaidLink(config);
    return (
      <TouchableOpacity style ={{backgroundColor: "#662397", color: "white"}} onClick={() => open()} disabled={!ready}>
        <Text style={{color: "white"}}>Link Bank Accounts</Text>
      </TouchableOpacity>
    );
  };