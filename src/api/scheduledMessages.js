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
    const body = JSON.stringify(data);

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

//////////////////////////////////////////////////////////////////
////////////////////// Get Self Messages. ////////////////////////
//////////////////////////////////////////////////////////////////

export const getSelfMessages = (data) => {
    const method = 'POST';
    const request_url = `${url}/scheduled_message/get_my_self_messages`
    const headers = {
        'Content-Type': 'application/json',
    }
    const body = JSON.stringify(data);
    return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

export const getScheduledSelfMessages = (data) => {
    const method = 'POST';
    const request_url = `${url}/scheduled_message/get_scheduled_my_self`
    const headers = {
        'Content-Type': 'application/json',
    }
    const body = JSON.stringify(data);
    return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

//////////////////////////////////////////////////////////////////
////////////////////// Create Self Message. //////////////////////
//////////////////////////////////////////////////////////////////

export const createSelfMessage = (data) => {
    const method = 'POST';
    const request_url = `${url}/scheduled_message/create_self`
    const headers = {
        'Content-Type': 'application/json',
    }
    const body = JSON.stringify(data);
    return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};
