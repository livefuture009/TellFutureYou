import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import PropTypes from "prop-types";
import Images from '../theme/Images';

export default class Rate extends React.Component {

  getStarSize() {
    if (this.props.size == "large") {
      return styles.starLargeImage;
    } else if (this.props.size == "xlarge") {
      return styles.starXLargeImage;
    }
    return styles.starImage;
  }

	render() {
		return (
			<View style={[this.props.style]}>
      {
        this.props.touchable
        ? <View style={{flexDirection: 'row', alignItems: 'center'}} >
            <TouchableOpacity onPress={() => this.props.onChangeRate(1)} style={this.getStarSize()}>
              <Image style={styles.image100} source={this.props.rate >= 1 ? Images.star_selected : Images.star_icon} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => this.props.onChangeRate(2)} style={this.getStarSize()}>
              <Image style={styles.image100} source={this.props.rate >= 2 ? Images.star_selected : Images.star_icon} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => this.props.onChangeRate(3)} style={this.getStarSize()}>
              <Image style={styles.image100} source={this.props.rate >= 3 ? Images.star_selected : Images.star_icon} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => this.props.onChangeRate(4)} style={this.getStarSize()}>
              <Image style={styles.image100} source={this.props.rate >= 4 ? Images.star_selected : Images.star_icon} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => this.props.onChangeRate(5)} style={this.getStarSize()}>
              <Image style={styles.image100} source={this.props.rate >= 5 ? Images.star_selected : Images.star_icon} />
            </TouchableOpacity>
          </View>

        : <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              style={this.getStarSize()}
              source={this.props.rate >= 1 ? Images.star_selected : Images.star_icon}
            />
            <Image
              style={this.getStarSize()}
              source={this.props.rate >= 2 ? Images.star_selected : Images.star_icon}
            />
            <Image
              style={this.getStarSize()}
              source={this.props.rate >= 3 ? Images.star_selected : Images.star_icon}
            />
            <Image
              style={this.getStarSize()}
              source={this.props.rate >= 4 ? Images.star_selected : Images.star_icon}
            />
            <Image
              style={this.getStarSize()}
              source={this.props.rate >= 5 ? Images.star_selected : Images.star_icon}
            />
          </View>
      }          
      </View>
	    );
  	}
}

const styles = StyleSheet.create({
	starImage: {
    width: 15,
    height: 15,
    marginRight: 3,
  },

  starLargeImage: {
    width: 20,
    height: 20,
    marginRight: 5,
  },

  starXLargeImage: {
    width: 35,
    height: 35,
    marginRight: 10,
  },

  image100: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  }
});