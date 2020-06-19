import { View, StyleSheet, Text } from 'react-native';
import React from 'react';
import Colors  from '../../theme/Colors';

const EmptySpaceDecoration = (props) => (
  <View style={[props.style, styles.container, props.full ? { flex: 1, height: '100%' } : false]}>
    <Text style={styles.icon}>{props.icon || props.loading ? '⏱️' : '👯'}</Text>
    <Text style={styles.text}>{props.loading ? 'Loading...' : props.children}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  icon: {
    alignSelf: 'center',
    fontSize: 50,
  },
  text: {
    color: Colors.grey,
    fontSize: 17,
    marginHorizontal: 95,
    fontFamily: 'OpenSans-Bold',
    fontWeight: 'normal',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default EmptySpaceDecoration;
