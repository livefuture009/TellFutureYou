import { createReducer } from 'reduxsauce';
import Types from '../actions/actionTypes';
import { Status } from '../constants';

export const initialState = {
  messages: [],
  selfMessages: [],
  errorMessage: '',

  getScheduledMessagesStatus: Status.NONE,
  createScheduledMessageStatus: Status.NONE,
  deleteScheduledMessageStatus: Status.NONE,
  rescheduleMessageStatus: Status.NONE,
  sendNowScheduledMessageStatus: Status.NONE,
  createSelfMessageStatus: Status.NONE,
};

//////////////////////////////////////////////////////////////////
////////////////// Get Scheduled Messages. ///////////////////////
//////////////////////////////////////////////////////////////////
const getScheduledMessagesRequest = (state) => ({
  ...state,
  getScheduledMessagesStatus: Status.REQUEST,
});

const getScheduledMessagesSuccess = (state, action) => ({
  ...state,
  messages: action.payload,
  getScheduledMessagesStatus: Status.SUCCESS,
});

const getScheduledMessagesFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  getScheduledMessagesStatus: Status.FAILURE,
});

//////////////////////////////////////////////////////////////////
////////////////// Create Schedule Message. //////////////////////
//////////////////////////////////////////////////////////////////
const createScheduledMessageRequest = (state) => ({
    ...state,
    createScheduledMessageStatus: Status.REQUEST,
});
  
const createScheduledMessageSuccess = (state, action) => {
    state.createScheduledMessageStatus = Status.SUCCESS;
    const message = action.payload;
    const messages = state.messages;
    messages.push(message);
    state.messages = messages;
    return {
      ...state,
    };
};

const createScheduledMessageFailure = (state, action) => ({
    ...state,
    errorMessage: action.error,
    createScheduledMessageStatus: Status.FAILURE,
});

//////////////////////////////////////////////////////////////////
////////////////// Delete Schedule Message. //////////////////////
//////////////////////////////////////////////////////////////////
const deleteScheduledMessageRequest = (state) => ({
  ...state,
  deleteScheduledMessageStatus: Status.REQUEST,
});

const deleteScheduledMessageSuccess = (state, action) => {
  state.deleteScheduledMessageStatus = Status.SUCCESS;
  const message_id = action.payload;
  const messages = state.messages;
  if (messages && messages.length > 0) {
    for (var i = 0; i < messages.length; i++) {
      if (messages[i]._id == message_id) {
        messages.splice(i, 1);
        break;
      }
    }
  }
  state.messages = messages;
  return {
    ...state,
  };
};

const deleteScheduledMessageFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  deleteScheduledMessageStatus: Status.FAILURE,
});

//////////////////////////////////////////////////////////////////
////////////////// Send Now Schedule Message. //////////////////////
//////////////////////////////////////////////////////////////////
const sendNowScheduledMessageRequest = (state) => ({
  ...state,
  sendNowScheduledMessageStatus: Status.REQUEST,
});

const sendNowScheduledMessageSuccess = (state, action) => {
  state.sendNowScheduledMessageStatus = Status.SUCCESS;
  const message_id = action.payload;
  const messages = state.messages;
  if (messages && messages.length > 0) {
    for (var i = 0; i < messages.length; i++) {
      if (messages[i]._id == message_id) {
        messages.splice(i, 1);
        break;
      }
    }
  }
  state.messages = messages;
  return {
    ...state,
  };
};

const sendNowScheduledMessageFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  sendNowScheduledMessageStatus: Status.FAILURE,
});

//////////////////////////////////////////////////////////////////
////////////////// Reschedule Message. //////////////////////
//////////////////////////////////////////////////////////////////
const rescheduleMessageRequest = (state) => ({
  ...state,
  rescheduleMessageStatus: Status.REQUEST,
});

const rescheduleMessageSuccess = (state, action) => {
  state.rescheduleMessageStatus = Status.SUCCESS;
  const message = action.payload;
  const messages = state.messages;
  if (messages && messages.length > 0) {
    for (var i = 0; i < messages.length; i++) {
      if (messages[i]._id == message._id) {
        messages[i] = message;
        break;
      }
    }
  }
  state.messages = messages;
  return {
    ...state,
  };
};

const rescheduleMessageFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  rescheduleMessageStatus: Status.FAILURE,
});

//////////////////////////////////////////////////////////////////
/////////////////// Create Self Message. /////////////////////////
//////////////////////////////////////////////////////////////////
const createSelfMessageRequest = (state) => ({
  ...state,
  createSelfMessageStatus: Status.REQUEST,
});

const createSelfMessageSuccess = (state, action) => {
  const { message } = action.payload;
  var messages = [...state.selfMessages];
  messages.push(message);
  state.selfMessages = messages;
  state.createSelfMessageStatus = Status.SUCCESS;
  return {
    ...state,
  };
};

const createSelfMessageFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  createSelfMessageStatus: Status.FAILURE,
});


//////////////////////////////////////////////////////////////////
////////////////////// RESET /////////////////////////////////////
//////////////////////////////////////////////////////////////////
const resetScheduledMessages = (state, action) => {
  state.messages = [];
  state.selfMessages = [];
  return {
    ...state,
  };
};


const actionHandlers = {
  [Types.GET_SCHEDULED_MESSAGES_REQUEST]: getScheduledMessagesRequest,
  [Types.GET_SCHEDULED_MESSAGES_SUCCESS]: getScheduledMessagesSuccess,
  [Types.GET_SCHEDULED_MESSAGES_FAILURE]: getScheduledMessagesFailure,

  [Types.CREATE_SCHEDULED_MESSAGE_REQUEST]: createScheduledMessageRequest,
  [Types.CREATE_SCHEDULED_MESSAGE_SUCCESS]: createScheduledMessageSuccess,
  [Types.CREATE_SCHEDULED_MESSAGE_FAILURE]: createScheduledMessageFailure,

  [Types.DELETE_SCHEDULED_MESSAGE_REQUEST]: deleteScheduledMessageRequest,
  [Types.DELETE_SCHEDULED_MESSAGE_SUCCESS]: deleteScheduledMessageSuccess,
  [Types.DELETE_SCHEDULED_MESSAGE_FAILURE]: deleteScheduledMessageFailure,

  [Types.SEND_NOW_SCHEDULED_MESSAGE_REQUEST]: sendNowScheduledMessageRequest,
  [Types.SEND_NOW_SCHEDULED_MESSAGE_SUCCESS]: sendNowScheduledMessageSuccess,
  [Types.SEND_NOW_SCHEDULED_MESSAGE_FAILURE]: sendNowScheduledMessageFailure,

  [Types.RESCHEDULE_MESSAGE_REQUEST]: rescheduleMessageRequest,
  [Types.RESCHEDULE_MESSAGE_SUCCESS]: rescheduleMessageSuccess,
  [Types.RESCHEDULE_MESSAGE_FAILURE]: rescheduleMessageFailure,

  [Types.CREATE_SELF_MESSAGE_REQUEST]: createSelfMessageRequest,
  [Types.CREATE_SELF_MESSAGE_SUCCESS]: createSelfMessageSuccess,
  [Types.CREATE_SELF_MESSAGE_FAILURE]: createSelfMessageFailure,

  [Types.RESET_SCHEDULED_MESSAGES]: resetScheduledMessages,
};

export default createReducer(initialState, actionHandlers);
