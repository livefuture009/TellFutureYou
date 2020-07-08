import { url } from '../constants';

//////////////////////////////////////////////////////////////////
//////////////////// GET Scheduled Messages. /////////////////////
//////////////////////////////////////////////////////////////////

export const getScheduledMessages = (userId, channelId) => {
    const method = 'POST';
    const request_url = `${url}/scheduled_message/get_list`
    const headers = {
        'Content-Type': 'application/json',
    }
    const body = JSON.stringify({ 
        userId, 
        channelId, 
    });

    return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

//////////////////////////////////////////////////////////////////
////////////////// Create Scheduled Message. /////////////////////
//////////////////////////////////////////////////////////////////

export const createScheduledMessage = (data) => {
    const method = 'POST';
    const request_url = `${url}/scheduled_message/create`
    const headers = {
        'Content-Type': 'application/json',
    }
    const body = JSON.stringify({ 
        message: data.message,
        creator: data.creator, 
        type: data.type,
        scheduledAt: data.scheduledAt,
        channelId: data.channelId, 
        channelURL: data.channelURL,
    });

    return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

//////////////////////////////////////////////////////////////////
///////////////// Send Now Scheduled Message. ////////////////////
//////////////////////////////////////////////////////////////////

export const sendNowScheduledMessage = (id) => {
    const method = 'POST';
    const request_url = `${url}/scheduled_message/send_now`
    const headers = {
        'Content-Type': 'application/json',
    }
    const body = JSON.stringify({ 
        id
    });

    return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

//////////////////////////////////////////////////////////////////
////////////////// Reschedule Message. /////////////////////
//////////////////////////////////////////////////////////////////

export const rescheduleMessage = (id, scheduledAt) => {
    const method = 'POST';
    const request_url = `${url}/scheduled_message/reschedule`
    const headers = {
        'Content-Type': 'application/json',
    }
    const body = JSON.stringify({ 
        id,
        scheduledAt
    });

    return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

//////////////////////////////////////////////////////////////////
////////////////// Delete Scheduled Message. /////////////////////
//////////////////////////////////////////////////////////////////

export const deleteScheduledMessage = (id) => {
    const method = 'POST';
    const request_url = `${url}/scheduled_message/delete`
    const headers = {
        'Content-Type': 'application/json',
    }
    const body = JSON.stringify({ 
        id
    });

    return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};