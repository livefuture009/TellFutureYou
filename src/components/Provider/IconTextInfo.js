import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import Images from '../../theme/Images';
import Fonts from '../../theme/Fonts';

export default class IconTextInfo extends React.Component {
  render() {
    return (
	    <View style={styles.container}>
	    	{
	    		this.props.icon == "dollar"
	    		? <Image 
			        style={styles.dollarIcon}
			        source={Images.dollar_icon} 
			      />
			    : null
	    	}
	    	{
	    		this.props.icon == "time"
	    		? <Image 
			        style={styles.dollarIcon}
			        source={Images.timer_icon} 
			      />
			    : null
	    	}
	        
	        <View>
	          <View style={{flexDirection: 'row', alignItems: 'center'}}>
	            <Text style={styles.boldText}>{this.props.boldTitle}</Text>
	            <Text style={styles.semiBoldText}>{this.props.description}</Text>
	          </View>
	          <Text style={styles.extraText}>{this.props.extra}</Text>
	        </View>
	    </View>
    );
  }
}

const styles = StyleSheet.create({
	container: { 
		flexDirection: 'row', 
		'alignItems': 'center',
		marginBottom: 18,
	},

	dollarIcon: {
    	width: 26,
    	height: 26,
    	marginRight: 8,
  	},

  	boldText: {
    	fontFamily: Fonts.bold,
    	fontSize: 16,
  	},

  	semiBoldText: {
    	fontFamily: Fonts.regular,
    	fontSize: 16,
  	}, 

  	extraText: {
  		fontFamily: Fonts.regular,
  		color: '#6f6f6f',
    	fontSize: 13,
  	}
});