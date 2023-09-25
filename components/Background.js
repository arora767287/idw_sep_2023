import React, { Component } from 'react';
import { SafeAreaView, Image, StatusBar } from 'react-native';
import { customstyles } from "../customstyle";
const page_bg = require('../assets/Images/page_bg.jpg');
class Background extends Component {
    render() {
        return (
            <Image source={page_bg} style={customstyles.pagebg} />
        );
    }
}
export default Background;