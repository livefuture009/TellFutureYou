import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import Colors from '../theme/Colors';
import Images from '../theme/Images';
import Fonts from '../theme/Fonts';

const screenWidth = Dimensions.get('window').width;

export default class TopNavBar extends React.Component {
  render() {
	const { theme, rightLabel, rightButton, onBack, rightIcon, onRight} = this.props;
    return (
	    <View 
	    	style={[
	    		styles.container, 
	    		(rightLabel || rightButton || rightIcon) ? styles.containerWithRight : null
	    	]}
	    >
			<TouchableOpacity style={styles.closeButton} onPress={() => onBack()}>
				<Image
					style={styles.closeButtonIcon}
					source={theme=="black" ? Images.back_arrow : Images.back_arrow_white}
				/>
			</TouchableOpacity>	    	
			<Text numberOfLines={1} style={[styles.titleText, (theme == "black" ? {color: Colors.appColor} : {})]}>{this.props.title}</Text>	    	
			{
				rightButton === "schedule"
				? <TouchableOpacity style={styles.rightButton} onPress={() => onRight()}>
					<Image source={Images.icon_calendar} style={styles.rightIcon}/>
				  </TouchableOpacity>	    	
				: null
			}
			{
				rightButton == "remove"
				? <TouchableOpacity style={styles.rightButton} onPress={() => onRight()}>
					<Image source={Images.icon_trash} style={styles.trashIcon}/>
				</TouchableOpacity>
				: null
			}
	    </View>
    );
  }
}

const styles = StyleSheet.create({
	container: {
		paddingTop: 5,
		paddingBottom: 10,
		zIndex: 3,
	},

	containerWithRight: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},

	titleText: {
		width: '100%',
		textAlign: 'center',
		fontFamily: Fonts.bold,
		fontSize: 24,
		color: 'white',
		paddingHorizontal: 50,
		paddingVertical: 10,
	},

	closeButton: {
		position: 'absolute',
		width: 30,
		height: 30,
		left: 15,
		top: 18, 
		zIndex: 2
	},

	closeButtonIcon: {
		width: '100%',
		height: '100%',
	},

	rightButton: {
		position: 'absolute',
		right: 15,
	},

	rightButtonText: {
		color: 'white',
		fontFamily: Fonts.bold,
		fontSize: 16,
		textAlign: 'center',
	},

	rightIcon: {
		width: 30,
		height: 30,
		resizeMode: 'contain',
	},

	trashIcon: {
		width: 25,
		height: 25,
		resizeMode: 'contain',
	},
});