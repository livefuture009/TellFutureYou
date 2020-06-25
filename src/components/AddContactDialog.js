import React from 'react';
import Modal from 'react-native-modal';
import { StyleSheet, View, Dimensions, TouchableOpacity, Image, Text } from 'react-native';
import Colors from '../theme/Colors'
import Images from '../theme/Images';
import Fonts from '../theme/Fonts';
import RoundButton from './RoundButton';

export default class AddContactDialog extends React.Component {
  render() {
    const { isVisible, onClose, onSelect } = this.props;
    return (
      <Modal isVisible={isVisible}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Image source={Images.close_icon} style={styles.closeIcon} />
          </TouchableOpacity>

          <View style={styles.body}>
            <RoundButton title="Import From Contacts" theme="blue" onPress={() => onSelect(0)}/>
            <RoundButton title="Add New Contact" theme="blue" style={{marginTop: 15}} onPress={() => onSelect(1)}/>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 40,
    borderRadius: 10,
  },

  header: {

  },

  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },

  closeIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },

  body: {
    paddingTop: 10,
  },

  actionButton: {
    borderRadius: 30,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    marginBottom: 15,
  },

  actionButtonText: {
    fontFamily: Fonts.bold,
    textAlign: 'center',
    fontSize: 18,
    color: Colors.textColor,
    paddingVertical: 10,
  },

});