import React, { Component } from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import Colors from '../theme/Colors'
import Images from '../theme/Images';
import Fonts from '../theme/Fonts';

class SubServicesBox extends Component {
    render() {
      const { services } = this.props;
      return (
        <View style={[this.props.style, styles.rowView]}>
            <Text style={styles.labelText}>Services: </Text>
            <View style={styles.serviceListView}>
            {
              services.map((item, index) => {
                return <View style={styles.serviceItem} key={index}>
                  <Image
                    style={styles.checkImage}
                    source={Images.checkbox_selected}
                  />
                  <Text style={styles.serviceText}>{item}</Text>
                  </View>
              })
            }
            </View>
        </View>
      );
    }
}

export default SubServicesBox;

const styles = StyleSheet.create({ 
  rowView: {
    flex: 1,    
    marginTop: 10,
    marginBottom: 10,
  },

  labelText: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    marginBottom: 10,
    color: Colors.textColor
  },

  serviceListView: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    marginTop: 5,
  },

  serviceItem: {
    width: '43%',
    flexDirection: 'row',
    marginBottom: 15,
    marginRight: 15,
  },

  serviceText: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    color: Colors.textColor,
    width: '90%',
  },

  checkImage: {
    width: 20,
    height: 20,
    marginRight: 7,
    marginTop: 2,
  },
});