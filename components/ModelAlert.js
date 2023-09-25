import React from 'react';
import { Alert, Button, Modal, View, StyleSheet, Text, TouchableOpacity, SafeAreaView, ScrollView, StatusBar, Pressable } from 'react-native';
import { customstyles } from "../customstyle";

export default class ModelAlert extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {

        return (
            <View>
                 <Modal
          visible={this.props.Alert_Visibility}
          transparent={false}
          animationType={"fade"}
          onRequestClose={() => { this.props.cancelAlertBox }} >

          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

            <View style={customstyles.MainAlertView}>

              <Text style={customstyles.AlertTitle}>{this.props.title}</Text>
              <View style={{ width: '100%', height: 0.5, backgroundColor: '#fff' }} />

              <Text style={customstyles.AlertMessage}> {this.props.body} </Text>

              <View style={{ width: '100%', height: 0.5, backgroundColor: '#fff' }} />

              <View style={{ flexDirection: 'row', height: '30%' }}>
                <TouchableOpacity style={customstyles.buttonStyle} onPress={this.props.confirmalert} activeOpacity={0.7} >
                  <Text style={customstyles.TextStyle}> OK </Text>
                </TouchableOpacity>

                <View style={{ width: 0.5, height: '100%', backgroundColor: '#fff' }} />

                <TouchableOpacity style={customstyles.buttonStyle} onPress={this.props.cancelAlertBox} activeOpacity={0.7} >
                  <Text style={customstyles.TextStyle}> CANCEL </Text>
                </TouchableOpacity>
              </View>

            </View>
          </View>
        </Modal>
            </View>
        )
    }

}