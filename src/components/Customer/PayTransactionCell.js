import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Dimensions, TextInput } from 'react-native';
import PropTypes from "prop-types";
import Colors from '../../theme/Colors'
import Images from '../../theme/Images';

export default class PayTransactionCell extends React.Component {
  render() {
    const provider = this.props.provider;
    const job = this.props.job;

    return (
	    <View style={[this.props.style, styles.container]}>
	    	<View style={{flexDirection: 'row', alignItems: 'center'}}>
	    		<Image
	              style={styles.avatarImage}
	              source={provider.avatar ? {uri: provider.avatar} : Images.account_icon}
	            />

	            <View style={{marginRight: 10}}>
	            	<Text style={styles.nameText}>{provider.firstName} {provider.lastName}</Text>
	            	<Text style={styles.serviceText}>{provider.service}</Text>
	            </View>
	    	</View>    	
			
			<View style={{flexDirection: 'row', alignItems: 'center'}}>
				<Text style={styles.rateText}>{job.rate}</Text>
	            <Text style={styles.separateText}>x</Text>
	            <TextInput
                    style={styles.textInput}
                    underlineColorAndroid='transparent'
                    onChangeText={(text) => this.props.onChangeLimit(text, this.props.index)}
                    value={provider.limit}
                />
                <Text style={styles.separateText}>=</Text>
				<Text style={styles.priceText}>${provider.total}</Text>                
			</View>

	    </View>
    );
  }
}

const styles = StyleSheet.create({
	container: { 
		borderRadius: 10,
		borderWidth: 1,
		borderColor: Colors.borderColor,
		flex: 1,
		backgroundColor: 'white',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',		
	    marginTop: 5,		
	    marginBottom: 5,
		padding: 10,
		backgroundColor: 'white',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
	},

	avatarImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
        backgroundColor: Colors.placeholderColor,
    },
    
    separateText: {
    	marginLeft: 5,
    	marginRight: 5,
    	fontFamily: 'OpenSans',
    	fontWeight: 'bold',
    	fontSize: 16,
    },

    textInput: {
    	fontFamily: 'OpenSans',
    	fontSize: 16,
    	borderWidth: 1,
    	borderColor: Colors.borderColor,
    	width: 30,
    	height: 30,
    	borderRadius: 3,
    	textAlign: 'center',
    },

  	nameText: {
  		fontFamily: 'OpenSans',
  		fontWeight: 'bold',
  		fontSize: 16,
  	},

  	serviceText: {
  		fontFamily: 'OpenSans',
  		fontSize: 12,
  		fontStyle: 'italic',
  		color: Colors.subTextColor
  	},

  	rateText: {
  		fontFamily: 'OpenSans',
  		fontSize: 16,	
  	},

  	priceText: {
  		fontFamily: 'OpenSans',
  		fontWeight: 'bold',
  		fontSize: 17,		
  	}

});