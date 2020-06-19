import React from 'react';
import { StyleSheet, View } from 'react-native';
import Slideshow from 'react-native-image-slider-show';
import OrderInfoCell from './Provider/OrderInfoCell';
import Moment from 'moment';
import { JOB_STATUS } from '../constants'
import Fonts from '../theme/Fonts';

export default class JobInfoCell extends React.Component {
    getFullAddress(location, zipcode) {
        return location + ", " + zipcode
    }

    getStatus(job) {
        if (job && job.offer && job.offer.user) {
          return JOB_STATUS.OFFER_SENT;
        }
        return job.status;
    }

    getImages(photos) {
        let images = [];
        if (photos) {
          for (var i = 0; i < photos.length; i++) {
            images.push({url: photos[i]});
          }  
        }    
    
        return images;
    }

  	render() {
        const { job } = this.props;
        const status = this.getStatus(job);

    	return (
	   		<View>
                {
                    (job.photos && job.photos.length > 0) &&
                    <Slideshow 
                        arrowSize={0}
                        dataSource={this.getImages(job.photos)}
                    />
                }                   

                <OrderInfoCell label="Job Status" value={status} type="status" userType="customer" />
                <OrderInfoCell label="Job ID" value={job._id} userType="customer" />
                <OrderInfoCell label="Job Title" value={job.title} userType="customer"/>
                <OrderInfoCell label="Job Description" type="textview" value={job.description} userType="customer"/>
                {
                    (status >= JOB_STATUS.PROGRESSING) &&
                    <OrderInfoCell label="Started At" value={Moment(job.createdAt).format('ddd DD, MMM YYYY')} userType="customer" />
                }
                {
                    (status === JOB_STATUS.COMPLETED) &&
                    <OrderInfoCell label="Completed At" value={Moment(job.completedAt).format('ddd DD, MMM YYYY')} userType="customer" />
                }
                {
                    (status === JOB_STATUS.CANCELED) &&
                    <OrderInfoCell label="Cancelled At" value={Moment(job.completedAt).format('ddd DD, MMM YYYY')} userType="customer" />
                }
                <OrderInfoCell label="Service" value={job.service} userType="customer" />
                <OrderInfoCell label="Location" value={this.getFullAddress(job.location, job.zipcode)} userType="customer"/>
                <OrderInfoCell label="Hourly Rate" value={'$' + job.rate} userType="customer"/>
                <OrderInfoCell label="Duration" value={job.duration + ' / hrs'} userType="customer"/>
            </View>
        );
  }
}

const styles = StyleSheet.create({
	textLabel: {
		fontFamily: Fonts.regular,
		fontSize: 15,
		color: 'white',
	}
});