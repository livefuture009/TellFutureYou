import React from 'react';
import Modal from 'react-native-modal';
import { StyleSheet, View, Dimensions, TouchableOpacity, Image, Text } from 'react-native';
import Colors from '../theme/Colors'
import Images from '../theme/Images';
import Fonts from '../theme/Fonts';
import Messages from '../theme/Messages';
import RoundButton from './RoundButton';
import DatePicker from 'react-native-date-picker'
import {Calendar} from 'react-native-calendars';
import Moment from 'moment';
import { NetInfoCellularGeneration } from '@react-native-community/netinfo';

export default class ScheduleDialog extends React.Component {
    constructor() {
        super()
        this.state = {
          scheduleDate: null,
          scheduleTime: null,
          dateError: null,

          dateSelected: '',
        }        
    }

    componentDidMount() {
      this.setState({scheduleDate: Moment(new Date()).format('YYYY-MM-DD')});
    }

    onSchedule() {
      const { scheduleDate, scheduleTime } = this.state;
      console.log("scheduleDate: ", scheduleDate);
      console.log("scheduleTime: ", scheduleTime);

      const { onSelect } = this.props;
      const today = new Date();
      if (scheduleDate && scheduleTime) {
        const dateString = scheduleDate + " " + Moment(scheduleTime).format("hh:mm a");
        const selectedDate = Moment(dateString, "YYYY-MM-DD hh:mm a");
        if (selectedDate == null || selectedDate <= today) {
          this.setState({dateError: Messages.InvalidScheduleTime});
          return;
        }
        onSelect(selectedDate);
      } 
      else {
        this.setState({dateError: Messages.InvalidScheduleTime});
        return;
      }
    }

    render() {
      const { dateError, scheduleDate, scheduleTime, dateSelected } = this.state;
      const { value, isVisible, onClose, onSelect } = this.props;
      const now = Moment(new Date()).format('YYYY-MM-DD');
      const current = scheduleDate ? scheduleDate : now;
      return (
        <Modal isVisible={isVisible}>
            <View style={styles.container}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Image source={Images.close_icon} style={styles.closeIcon} />
            </TouchableOpacity>

            <View style={styles.body}>
              <Calendar
                current={current}
                minDate={now}
                onDayPress={(day) => 
                  this.setState({
                    scheduleDate: day.dateString,
                    dateSelected: {[day.dateString]: {selected: true, selectedColor: '#466A8F'}}
                  })
                }
                monthFormat={'yyyy MM'}
                hideDayNames={true}
                showWeekNumbers={true}
                markedDates={dateSelected}
              />
              <View style={styles.timeContainer}>
                <DatePicker
                  value={value}
                  date={scheduleTime ? scheduleTime : new Date()}
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
                  style={{marginTop: 20, width: '100%'}}
              />
              {
                dateError && 
                <Text style={styles.errorText}>{dateError}</Text>
              }
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

  timeContainer: {
    marginTop: 10,
    alignItems: 'center',
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

  errorText: {
    fontFamily: Fonts.regular,
    fontStyle: 'italic',
    color: 'red',
    fontSize: 11,
    marginTop: 5,
    textAlign: 'center',
  },

});