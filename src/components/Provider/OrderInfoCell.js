import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Rate from '../Rate'
import { JOB_STATUS } from '../../constants.js'
import Colors from '../../theme/Colors';
import Fonts from '../../theme/Fonts';

class OrderInfoCell extends Component {
    render() {
        const { label, type, value, subValue, userType} = this.props;

        return (
            <View style={[this.props.style, styles.container]} onPress={() => this.props.onChoose(this.props.data)}>
                <Text style={styles.labelText}>{this.props.label}</Text>
                {
                    type == "status"
                    ? <View>
                        {
                            value == JOB_STATUS.NEW
                            ? <Text style={[styles.statusText, styles.newText]}>New</Text>
                            : null
                        }
                        {
                            value == JOB_STATUS.OFFER_SENT
                            ? <Text style={[styles.statusText, styles.newText]}>{userType == "customer" ? "Offer Sent" : "Get Offer" }</Text>
                            : null
                        }
                        {
                            value == JOB_STATUS.PROGRESSING
                            ? <Text style={[styles.statusText, styles.workingText]}>In Progress</Text>
                            : null
                        }
                        {
                            value == JOB_STATUS.COMPLETED
                            ? <Text style={[styles.statusText, styles.completedText]}>Completed</Text>
                            : null
                        }
                        {
                            value == JOB_STATUS.CANCELLED
                            ? <Text style={[styles.statusText, styles.cancelledText]}>Cancelled</Text>
                            : null
                        }
                      </View>
                    : null
                }

                {
                    type == "rating"
                    ? <Rate rate={value} />
                    : null
                }

                {
                    type == "textview"
                    ? <Text style={[styles.contentText, styles.textView]}>{value}</Text>
                    : null
                }

                {
                    type == "service"
                    ? <View>
                        <Text style={[styles.serviceText]}>{value}</Text>
                        {
                            (subValue && subValue.length > 0) &&
                            <Text style={styles.subText}>{subValue.join("\r\n")}</Text>
                        }                        
                    </View>
                    
                    : null
                }
                {
                    type == null
                    ? <Text style={[styles.contentText, styles.textField, this.props.textAlign == "left" ? styles.leftText : null]}>{this.props.value}</Text>
                    : null
                }
            </View>
        );
    }
}

export default OrderInfoCell;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        paddingLeft: 14,
        paddingRight: 14,
        paddingTop: 17,
        paddingBottom: 17,
        backgroundColor: 'white',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: '#f3f3f3',
    },

    labelText: {
        fontFamily: Fonts.bold,
        width: '35%',
    },

    contentText: {
        fontFamily: Fonts.regular,
        width: '60%',
    },

    textView: {
        textAlign: 'right',  
    },

    textField: {
      textAlign: 'right',    
    },

    statusText: {
        fontFamily: Fonts.bold,
        fontSize: 16,     
        textTransform: 'uppercase',   
    },

    paidText: {
        color: Colors.paidJobTextColor,
    },

    newText: {
        color: Colors.newJobTextColor,
    },

    appliedText: {
        color: Colors.appliedJobTextColor,
    },

    workingText: {
        color: Colors.workingJobTextColor,
    },

    completedText: {
        color: Colors.completedJobTextColor,
    },
    cancelledText: {
        color: Colors.cancelTextColor,
    },

    serviceText: {
        textAlign: 'right',
        fontFamily: Fonts.regular,
        fontSize: 14,
    },

    subText: {
        textAlign: 'right',
        fontFamily: Fonts.light,
        fontSize: 11,
    },

    leftText: {
        textAlign: 'left',
    },
});