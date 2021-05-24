import React, { useState, useEffect } from 'react';
import {
  View, StyleSheet, Text, TextInput, TouchableOpacity, Image,
} from 'react-native';
import Colors from '../../theme/Colors';
import Images from '../../theme/Images';
import Fonts from '../../theme/Fonts';

export default class CommentInput extends React.Component{
  constructor(){
    super()
    this.state={ value: '' }
  }
  render() {
    const { 
      placeholder,
      disabled,
      textRef,
      onBlur,
      onPost,
      onSchedule,
      onImagePress,
      onChangeText,
    } = this.props;

    const { value } = this.state;

    return (
      <View style={[styles.wrapper, this.props.style]}>
        <TouchableOpacity style={{marginTop: 3}} onPress={onImagePress}>
          <Image source={Images.image_record_icon} style={{ width: 34, height: 34, marginRight: 12 }} resizeMode="contain" />
        </TouchableOpacity>
        <View style={styles.container}>
          <TextInput
            value={value}
            onChangeText={(value) => {
              this.setState({value});
              onChangeText && onChangeText(value);
            }}
            placeholder={placeholder}
            ref={textRef ? textRef : () => {}}
            style={[styles.textInput]}
            multiline
            maxLength={1000}
            onSubmitEditing={onBlur}
            placeholderTextColor="#888888"
          />
        </View>
        {
          disabled
          ? <View style={styles.scheduleButton}>
              <Image source={Images.icon_clock} style={[styles.schedlueIcon, disabled && { opacity: 0.2 }]} resizeMode="contain" />
            </View>
          : <TouchableOpacity style={styles.scheduleButton} onPress={() => onSchedule()}>
              <Image source={Images.icon_clock} style={[styles.schedlueIcon, disabled && { opacity: 0.2 }]} resizeMode="contain" />
            </TouchableOpacity>
        }
        {
          disabled
          ? <View style={styles.scheduleButton} onPress={onPost}>
            <Image source={Images.send_icon} style={[styles.schedlueIcon, disabled && { opacity: 0.2 }]} resizeMode="contain" />
          </View>

          : <TouchableOpacity style={styles.scheduleButton} onPress={onPost}>
            <Image source={Images.send_icon} style={[styles.schedlueIcon, disabled && { opacity: 0.2 }]} resizeMode="contain" />
          </TouchableOpacity>
        }
      </View>
    );
  };
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    width: '100%',
  },

  container: {
    flex: 1,
    paddingHorizontal: 17,
    borderRadius: 20,
    backgroundColor: '#F4F4F4',
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 100,
  },

  textInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: Colors.text,
    maxHeight: 150,
    marginBottom: 6,
  },

  scheduleButton: {
    marginTop: 3,
    marginLeft: 7,
  },

  schedlueIcon: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
});
