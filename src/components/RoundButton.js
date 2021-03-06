import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { Text, StyleSheet, TouchableOpacity, View } from 'react-native';
import Colors from "../theme/Colors"
import Fonts from "../theme/Fonts"

export default class RoundButton extends React.Component {
  render() {
	const { theme, title, onPress } = this.props;
    return (
	    <TouchableOpacity style={this.props.style} onPress={() => onPress()}>
	    	{
	    		theme == "blue" 
	    		?  <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#0d3758', '#02213b']} style={styles.buttonContainer}>
					<Text style={[styles.buttonText, styles.whiteText]}>{title}</Text>
				</LinearGradient>
	    		: null
	    	}
	    	{	
	    		theme == "red" 
	    		? <View style={[styles.buttonContainer, styles.redButton]}>
					<Text style={[styles.buttonText, styles.whiteText]}>{title}</Text>
	    		  </View>
	    		: null
	    	}
	    	{
	    		theme == "outline" 
	    		? <View style={[styles.buttonContainer, styles.outlineButton]}>
					<Text style={[styles.buttonText, styles.outlineText]}>{title}</Text>
	    		  </View>
	    		: null	
	    	}

	    	{
	    		theme == "white" 
	    		? <View style={[styles.buttonContainer, styles.whiteButton]}>
					<Text style={[styles.buttonText, styles.whiteText]}>{title}</Text>
	    		  </View>
	    		: null
	    	}

	    	{ 
	    		theme == "orange"
	    		? <View style={[styles.buttonContainer, styles.orangeButton]}>
					<Text style={[styles.buttonText, styles.blackText]}>{title}</Text>
	    		  </View>
	    		: null
	    	}

	    	{ 
	    		theme == "black"
	    		? <View style={[styles.buttonContainer, styles.blackButton]}>
					<Text style={[styles.buttonText, styles.whiteText]}>{title}</Text>
	    		  </View>
	    		: null
	    	}

	    	{
	    		this.props.theme == "no-border"
	    		? <View style={[styles.buttonContainer, styles.noBorderButton]}>
					<Text style={[styles.buttonText, styles.whiteText]}>{this.props.title}</Text>
	    		  </View>
	    		: null
	    	}

	    	{
	    		this.props.theme == "no-border-gray"
	    		? <View style={[styles.buttonContainer, styles.noBorderButton]}>
					<Text style={[styles.buttonText, styles.grayText]}>{this.props.title}</Text>
	    		  </View>
	    		: null
	    	}
    		
	    </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({

	buttonContainer: {
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 25,
		elevation: 3,
		height: 50,
	}, 

	outlineButton: {
		backgroundColor: 'white',
		borderWidth: 2,
		borderColor: Colors.appColor,
	},

	mainButton: {
		backgroundColor: Colors.appColor,
		borderWidth: 2,
		borderColor: Colors.appColor,
	},

	blueButton: {
		backgroundColor: '#2357f7',
		borderWidth: 2,
		borderColor: '#2357f7',
	},

	redButton: {
		backgroundColor: Colors.redColor,
		borderWidth: 2,
		borderColor: Colors.redColor,	
	},

	whiteButton: {
		backgroundColor: 'transparent',
		borderWidth: 2,
		borderColor: 'white',
	},

	orangeButton: {
		backgroundColor: '#F5C723',
		borderWidth: 2,
		borderColor: '#F5C723',
	},

	blackButton: {
		backgroundColor: '#000',
		borderWidth: 2,
		borderColor: '#000',
	},

	noBorderButton: {

	},

	buttonText: {
		fontFamily: Fonts.bold,
		fontSize: 17,
		letterSpacing: 1,
		textTransform: 'uppercase',
	},

	outlineText: {
		color: Colors.appColor,
	},

	whiteText: {
		color: 'white',
	},

	blackText: {
		color: 'black',	
	},

	grayText: {
		color: '#939393',
	},
});