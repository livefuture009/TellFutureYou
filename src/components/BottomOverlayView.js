import React from 'react';
import { StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export default class BottomOverlayView extends React.Component {
  render() {
    return (
	    <LinearGradient 
	    	colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0)']} 
 	        start={{ x: 0, y: 1.0 }}
	        end={{ x: 0, y: 0.2 }}
 			style={styles.bottomOverlay}>
		</LinearGradient>

    );
  }
}

const styles = StyleSheet.create({
	bottomOverlay: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		width: '100%',
		height: 243,
		flex: 1
	},
});