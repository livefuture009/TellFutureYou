import React from 'react';
import Modal from 'react-native-modal';
import { StyleSheet, View, Dimensions, TouchableOpacity, Image, Text } from 'react-native';
import Colors from '../theme/Colors'
import Images from '../theme/Images';
import Fonts from '../theme/Fonts';
import RoundButton from './RoundButton';
import DatePicker from 'react-native-date-picker'

export default class ScheduleDialog extends React.Component {
    constructor(props) {
        super(props)
        this.scheduleTime = null;
    }

    render() {
        const { value, isVisible, onClose, onSelect } = this.props;
        return (
        <Modal isVisible={isVisible}>
            <View style={styles.container}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Image source={Images.close_icon} style={styles.closeIcon} />
            </TouchableOpacity>

            <View style={styles.body}>
                <DatePicker
                    value={value}
                    date={new Date()}
                    mode="datetime"
                    onDateChange={(date) => this.scheduleTime = date}
                />
                <RoundButton 
                    title="Schedule" 
                    theme="blue" 
                    onPress={() => onSelect(this.scheduleTime)}
                    style={{marginTop: 20, width: '100%'}}
                />
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
    alignItems: 'center',
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