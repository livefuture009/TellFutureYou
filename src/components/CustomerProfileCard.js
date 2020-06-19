import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Text, ScrollView } from 'react-native';
import Avatar from './Avatar'
import ReviewCell from './ReviewCell'
import Rate from './Rate'
import RoundButton from './RoundButton';
import Colors from '../theme/Colors'
import { kFormatter } from '../functions'

export default class CustomerProfileCard extends React.Component {
    renderHistory() {
        const { totalPaid, avgRate, totalJobs } = this.props;
        return (
          <View style={styles.historyBox}>
            <View style={styles.historyItem}>
              <Text style={styles.historyValueText}>${kFormatter(totalPaid)}</Text>
              <Text style={styles.historyLabelText}>Total Paid</Text>
            </View>
    
            <View style={styles.historyItem}>
              <Text style={styles.historyValueText}>{totalJobs}</Text>
              <Text style={styles.historyLabelText}>Jobs</Text>
            </View>
    
            <View style={styles.historyItem}>
              <Text style={styles.historyValueText}>$ {kFormatter(avgRate)} / hr</Text>
              <Text style={styles.historyLabelText}>Avg. Rate</Text>
            </View>
          </View>
        )
    }
      
    renderReviews() {
        const { jobHistory} = this.props;
        return (
            <View style={{width: '100%'}}>
            {
                jobHistory.map((job, index) => {
                  return <ReviewCell job={job} key={index} />
                })
            }
            </View>
        )
    }

  	render() {
      const { customer, reviewScore, onSendMessage } = this.props;
    	return (
		   	<ScrollView>
		   		<View style={{alignItems: 'center', backgroundColor: 'white'}}>
            <Avatar 
              avatar={customer.avatar} 
              style={{marginTop: 20}}
            />
            <Text style={styles.nameText}>{customer.firstName} {customer.lastName}</Text>
            <Rate rate={reviewScore} size="large" style={{marginBottom: 20}}/>
            <RoundButton 
              title="SEND MESSAGE" 
              theme="blue" 
              style={styles.chatButton} 
              onPress={() => onSendMessage(customer)} 
            />
            { this.renderHistory() }
            { this.renderReviews() }
          </View>
	    	</ScrollView>
    );
  }
}

const styles = StyleSheet.create({
	nameText: {
        fontFamily: 'OpenSans',
        fontWeight: 'bold',
        fontSize: 26,
        marginTop: 7,
        color: Colors.textColor
      },
    
      historyBox: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: Colors.borderColor,
        paddingVertical: 15,
      },
    
      historyItem: {
        width: '33%',
      },
    
      historyValueText: {
        fontFamily: 'OpenSans',
        textAlign: 'center',
        fontWeight: 'bold', 
        fontSize: 20,   
      },
    
      historyLabelText: {
        fontFamily: 'OpenSans',
        textAlign: 'center',
      },

      chatButton: {
        width: '50%',
        marginBottom: 25,
      },
});