import React, { Component } from 'react';
import { Text, View, StyleSheet, Image, Dimensions } from 'react-native';
import Rate from './Rate'
import Colors from '../theme/Colors'
import Fonts from '../theme/Fonts'
import Moment from 'moment';
import { DATE_FORMAT } from '../constants';

class ReviewCell extends Component {
    render() {
        const { job } = this.props;
        const score = job.review ? job.review.score : 0;
        const createdAt = job.review ? Moment(job.review.createdAt).format(DATE_FORMAT) : '';
        const text = job.review ? job.review.text : '';

        return (
            <View style={[this.props.style, styles.container]}>
                <Text style={styles.titleText}>{job.title}</Text>
                {
                    job.review 
                    ?<View>
                        <View style={{flexDirection: 'row', alignItems: 'center', paddingVertical: 3}}>
                            <Rate rate={score}/>
                            <Text style={styles.timeText}>{createdAt}</Text>
                        </View>                
                        <Text style={styles.reviewText}>{text}</Text>
                    </View>
                    : <Text style={styles.noFeedbackText}>No feedback given yet.</Text>
                }
                
            </View>
        );
    }
}

export default ReviewCell;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderColor,
        padding: 10,
    },

    titleText: {
        fontFamily: Fonts.bold,
        fontSize: 14,
        marginRight: 7,
    },

    reviewText: {
       fontFamily: Fonts.italic,
       marginTop: 2,
       fontSize: 12,
    },

    timeText: {
        fontFamily: Fonts.regular,
        fontSize: 12,
        color: Colors.subTextColor,
        marginLeft: 7,
    },

    noFeedbackText: {
        fontFamily: Fonts.italic,
        fontSize: 12,
        color: Colors.subTextColor,
    }

});