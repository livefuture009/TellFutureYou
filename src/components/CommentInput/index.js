import React, { useState, useEffect } from 'react';
import {
  View, StyleSheet, Text, TextInput, TouchableOpacity, Image,
} from 'react-native';
import Colors from '../../theme/Colors';
import Images from '../../theme/Images';

export default class CommentInput extends React.Component{
  constructor(props){
    super(props)
    this.state={ value: '' }
  }
  render() {
  const { props }= this;
  return (
    <View style={[styles.wrapper, props.style]}>
      <TouchableOpacity style={{marginTop: 3}} onPress={props.onImagePress}>
        <Image source={Images.image_record_icon} style={{ width: 34, height: 34, marginRight: 12 }} resizeMode="contain" />
      </TouchableOpacity>
      <TouchableOpacity style={{marginTop: 3}} onPress={props.onAudioPress}>
        <Image source={Images.audio_record_icon} style={{ width: 34, height: 34, marginRight: 12 }} resizeMode="contain" />
      </TouchableOpacity>
      <View style={styles.container}>
        <TextInput
          {...props}
          value={this.state.value}
          onChangeText={(value) => {
            this.setState({value});
            props.onChangeText && props.onChangeText(value);
          }}
          ref={props.textRef ? props.textRef : () => {}}
          style={[styles.textInput, props.inputStyle]}
          multiline
          maxLength={1000}
          onSubmitEditing={props.onBlur}
          placeholderTextColor="#888888"
        />
      </View>
      <TouchableOpacity style={{marginTop: 3}} onPress={props.onPost}>
        <Image source={Images.send_icon} style={[{ width: 34, height: 34, marginLeft: 5 }, this.state.value.length === 0 && { opacity: 0.2 }]} resizeMode="contain" />
      </TouchableOpacity>
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
    minHeight: 40,
  },
  textInput: {
    flex: 1,
    // height: 33,
    fontSize: 16,
    fontFamily: 'OpenSans',
    color: Colors.text,
  },
  postBtn: {
    marginLeft: 10,
    marginTop: 7,
    fontSize: 19,
    fontFamily: 'OpenSans-Bold',
    color: Colors.appColor,
    alignSelf: 'flex-end',
  },
});
