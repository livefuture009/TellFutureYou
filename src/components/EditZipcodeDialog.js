import React from 'react';
import { StyleSheet, View, Dimensions, TouchableOpacity, Image, Text, TextInput } from 'react-native';
import Colors from '../theme/Colors'
import Images from '../theme/Images';
import Fonts from '../theme/Fonts';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default class EditZipcodeDialog extends React.Component {
  render() {
    const { zipcode, error, onChange, onClose, onApply } = this.props;

    return (
	    <View style={styles.indicatorOverlay}>
          <View style={styles.indicatorBackground}></View>
          <View style={styles.dialogBox}>
            <View style={styles.headerView}>
              <Text style={styles.headerText}>Edit Zip Code</Text>
              <TouchableOpacity style={styles.closeButton} onPress={() => onClose()}>
                <Image style={styles.closeIcon} source={Images.close_icon}/>
              </TouchableOpacity>
            </View>

            <View style={styles.contentView}>
              <TextInput
                style={styles.textInput}
                placeholderTextColor="#939393"
                underlineColorAndroid='transparent'
                maxLength={10}
                onChangeText={(text) => onChange(text)} 
                value={zipcode}
                textAlign="center"
                placeholder="Zip Code"
                returnKeyType="done"
              />
            {
              error &&
              <Text style={styles.errorMessage}>{error}</Text>              
            }
            </View>


            <TouchableOpacity style={styles.bottomButton} onPress={() => onApply()}>
              <Text style={styles.bottomButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
	indicatorOverlay: {
    position: 'absolute',
    left: 0,
    top: -100,
    width: width,
    height: height + 100,
    zIndex: 10000,
    alignItems: 'center',
    justifyContent: 'center',
  },

  indicatorBackground: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  dialogBox: {
    backgroundColor: 'white',
    width: '85%',
    borderRadius: 15,
  },

  headerView: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.borderColor,
  },

  headerText: {
    fontFamily: Fonts.bold,
    textAlign: 'center',
    textTransform: 'uppercase',
    fontSize: 17,
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 30,
    paddingRight: 30,
    width: '100%',
  },

  closeButton: {
    position: 'absolute',
    right: 15,
    top: 15,
  },

  closeIcon: {
    width: 30,
    height: 30,
  },

  contentView: {
    paddingTop: 30,
    paddingBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderBottomColor: Colors.borderColor, 
  },

  bottomButton: { 
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },

  bottomButtonText: {
    fontFamily: Fonts.bold,
    textAlign: 'center',
    textTransform: 'uppercase',
    fontSize: 16, 
  },

  textInput: {
    width: '80%', 
    borderColor: Colors.borderColor, 
    borderWidth: 1, 
    borderRadius: 25,
    color: 'black',
    paddingVertical: 12,
    fontFamily: Fonts.regular,
  },

  errorMessage: {
    marginTop: 5,
    fontFamily: Fonts.italic,
    color: 'red',
    fontSize: 12,
  },
});