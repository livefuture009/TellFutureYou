import React from 'react';
import Modal from 'react-native-modal';
import { StyleSheet, View, TouchableOpacity, Image, Text } from 'react-native';
import Colors from '../theme/Colors'
import Images from '../theme/Images';
import Fonts from '../theme/Fonts';
import Messages from '../theme/Messages';
import RoundButton from './RoundButton';
import DatePicker from 'react-native-date-picker'
import {Calendar} from 'react-native-calendars';
import { ifIphoneX } from 'react-native-iphone-x-helper'
import Moment from 'moment';

export default class ScheduleDialog extends React.Component {
    constructor() {
        super()
        this.state = {
          scheduleDate: null,
          scheduleTime: null,
          dateError: null,
          dateSelected: null,
        }        
    }

    componentDidMount() {
      this.resetDialog();  
    }

    resetDialog() {
      const today = new Date();
      const dateString = Moment(today).format('YYYY-MM-DD');
      var dateSelected = {[dateString]: {selected: true, selectedColor: '#466A8F'}};
      this.setState({scheduleDate: dateString, scheduleTime: today, dateSelected, dateError: null});
    }

    onSchedule() {
      const { scheduleDate, scheduleTime } = this.state;
      const { onSelect } = this.props;
      const today = new Date();

      if (scheduleDate && scheduleTime) {
        const dateString = scheduleDate + " " + Moment(scheduleTime).format("hh:mm a");
        const selectedDate = Moment(dateString, "YYYY-MM-DD hh:mm a");
        if (selectedDate == null || selectedDate < today) {
          this.setState({dateError: Messages.InvalidScheduleTime});
          return;
        }
        this.resetDialog();
        onSelect(selectedDate);
      } 
      else {
        this.setState({dateError: Messages.InvalidScheduleTime});
        return;
      }
    }

    render() {
      const { dateError, scheduleDate, scheduleTime, dateSelected } = this.state;
      const { value, isVisible, onClose, onSendNow } = this.props;
      const now = Moment(new Date()).format('YYYY-MM-DD');
      const current = scheduleDate ? scheduleDate : null;
      return (
        <Modal isVisible={isVisible}>
            <View style={styles.container}>
              <View style={styles.header}>
                <Text style={styles.titleText}>Choose a Date & Time</Text>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                  <Image source={Images.close_icon} style={styles.closeIcon} />
                </TouchableOpacity>
              </View>
              <View style={styles.body}>
                <Calendar
                  current={current}
                  minDate={now}
                  onDayPress={(day) => {
                    this.setState({
                      scheduleDate: day.dateString,
                      dateSelected: {[day.dateString]: {selected: true, selectedColor: '#466A8F'}}
                    })
                  }}
                  monthFormat={'MMMM, yyyy'}
                  hideDayNames={true}
                  showWeekNumbers={true}
                  markedDates={dateSelected}
                />
                <View style={styles.timeContainer}>
                  <DatePicker
                    value={value}
                    date={scheduleTime}
                    mode="time"
                    onDateChange={(date) => {
                      this.setState({scheduleTime: date})
                    }}
                  />
                </View>
                <RoundButton 
                    title="Schedule" 
                    theme="blue" 
                    onPress={() => this.onSchedule()}
                    style={{width: '100%'}}
                />
                {
                  dateError && 
                  <Text style={styles.errorText}>{dateError}</Text>
                }
                <TouchableOpacity style={styles.cancelBtn} onPress={() => onSendNow()}>
                  <Text style={styles.cancelBtnText}>Send Now</Text>
                </TouchableOpacity>
              </View>
          </View>
        </Modal>
      );
    }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingBottom: 10,
    paddingTop: 0,
    borderRadius: 10,
  },

  timeContainer: {
    alignItems: 'center',
  },

  header: {
    position: 'relative',
  },

  titleText: {
    fontFamily: Fonts.regular,
    textAlign: 'center',
    paddingTop: 12,
    ...ifIphoneX({
      fontSize: 20,
    }, {
      fontSize: 17,
    }),
  },

  closeButton: {
    position: 'absolute',
    right: 0,
    ...ifIphoneX({
      top: 12,
    }, {
      top: 10,
    }),
  },

  closeIcon: {
    resizeMode: 'contain',
    ...ifIphoneX({
      width: 30,
      height: 30,
    }, {
      width: 25,
      height: 25,
    }),
  },

  body: {
    
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

  errorText: {
    fontFamily: Fonts.regular,
    fontStyle: 'italic',
    color: 'red',
    fontSize: 11,
    marginTop: 5,
    textAlign: 'center',
  },

  cancelBtn: {
    marginTop: 10,
    ...ifIphoneX({
      marginBottom: 10,
    }, {
      marginBottom: 5,
    }),
  },

  cancelBtnText: {
    textAlign: 'center',
    fontFamily: Fonts.regular,
    color: '#60b8c3',
    ...ifIphoneX({
      fontSize: 18,
    }, {
      fontSize: 16,
    }),
  },
});