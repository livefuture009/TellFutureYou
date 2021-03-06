import { url } from '../constants';
import { Platform } from 'react-native';
import { filterFileUri, filterFileName, makeRandomText, compressImage } from '../functions';

//////////////////////////////////////////////////////////////////
////////////////////////// Login /////////////////////////////////
//////////////////////////////////////////////////////////////////

export const loginUser = (email, password, player_id, lat, lng) => {
  const method = 'POST';
  const request_url = `${url}/user/login`
  const headers = {
    'Content-Type': 'application/json',
  }
  const body = JSON.stringify({ 
    email, 
    password, 
    device_token: player_id, 
    lat: lat,
    lng: lng,
    os: Platform.OS,    
  });
  
  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

//////////////////////////////////////////////////////////////////
/////////////////////// Login with Social ////////////////////////
//////////////////////////////////////////////////////////////////
export const loginWithSocial = (user, player_id, lat, lng) => {
  const method = 'POST';
  const request_url = `${url}/user/login_with_social`
  const headers = {
    'Content-Type': 'application/json',
  }
  const body = JSON.stringify({ 
    user: user,
    device_token: player_id,
    os: Platform.OS,
    lat: lat,
    lng: lng,
    os: Platform.OS,    
  });

  return fetch(request_url, { method, body, headers})
    .then(res => res.json())
    .then(res => {
        if (res.needToSignUp) {
          res.result = true;
          res.user = user;
        }
        return res;
      }
    );
};

//////////////////////////////////////////////////////////////////
///////////////////////// Register User //////////////////////////
//////////////////////////////////////////////////////////////////
export const registerUser = (user) => {
  const method = 'POST';
  const request_url = `${url}/user/register_user`
  const headers = {
    'Content-Type': 'application/json',
  }
  const body = JSON.stringify({ 
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    location: user.location,
    socialId: user.socialId,
    socialType: user.socialType,
    avatar: user.avatar,
    password: user.password,
    device_token: user.playerId,
    os: Platform.OS,
  });

  
  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

//////////////////////////////////////////////////////////////////
///////////////////////// Forgot Password ////////////////////////
//////////////////////////////////////////////////////////////////
export const forgotPassword = (email) => {
  const method = 'POST';
  const request_url = `${url}/user/forgot_password`
  const headers = {
    'Content-Type': 'application/json',
  }
  const body = JSON.stringify({ 
    email: email,
  });
  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

//////////////////////////////////////////////////////////////////
///////////////////////// Verify Code ////////////////////////////
//////////////////////////////////////////////////////////////////
export const verifyCodePassword = (email, code) => {
  const method = 'POST';
  const request_url = `${url}/user/verify_resetcode`
  const headers = {
    'Content-Type': 'application/json',
  }
  const body = JSON.stringify({ 
    email: email,
    code: code,
  });
  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

//////////////////////////////////////////////////////////////////
//////////////////////// Reset Password //////////////////////////
//////////////////////////////////////////////////////////////////
export const resetPassword = (email, password) => {
  const method = 'POST';
  const request_url = `${url}/user/reset_newpassword`
  const headers = {
    'Content-Type': 'application/json',
  }
  const body = JSON.stringify({ 
    email: email,
    password: password
  });
  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

//////////////////////////////////////////////////////////////////
//////////////////////// Change Password /////////////////////////
//////////////////////////////////////////////////////////////////
export const changePassword = (user_id, old_password, new_password) => {
  const method = 'POST';
  const request_url = `${url}/user/change_password`
  const headers = {
    'Content-Type': 'application/json',
  }
  const body = JSON.stringify({ 
    id: user_id,
    old_password: old_password,
    new_password: new_password
  });
  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

//////////////////////////////////////////////////////////////////
////////////////////////// Get User //////////////////////////////
//////////////////////////////////////////////////////////////////
export const getUser = (user_id, is_update) => {
  const method = 'POST';
  const request_url = `${url}/user/get_user`
  const headers = {
    'Content-Type': 'application/json',
  }
  const body = JSON.stringify({ 
    user_id: user_id,                
  });

  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

//////////////////////////////////////////////////////////////////
////////////////////// Get User by email /////////////////////////
//////////////////////////////////////////////////////////////////
export const getUserByEmail = (email) => {
  const method = 'POST';
  const request_url = `${url}/user/get_user_by_email`
  const headers = {
    'Content-Type': 'application/json',
  }
  const body = JSON.stringify({ 
    email: email,                
  });

  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

//////////////////////////////////////////////////////////////////
//////////////////////// Update Profile //////////////////////////
//////////////////////////////////////////////////////////////////
export const updateProfile = (user) => {
  const formData = new FormData();
  if (user.avatarFile) {
    var filename = filterFileName(user.avatarFile, Platform.OS);
    var filetype = user.avatarFile.type ? user.avatarFile.type : 'image/jpeg';
    const fileUri = filterFileUri(user.avatarFile.uri, Platform.OS);
    const params = {
      name: filename,
      type: filetype,
      uri: fileUri
    };
    formData.append("avatar", params);        
  }

  formData.append("id", user.id);
  formData.append("firstName", user.firstName);
  formData.append("lastName", user.lastName);
  formData.append("email", user.email);
  formData.append("phone", user.phone);
  formData.append("location", user.location);

  const request_url = `${url}/user/update_profile`
  return fetch(request_url, {
      method: "POST",
      body: formData
  })
  .then(response => response.json())
};

//////////////////////////////////////////////////////////////////
/////////////////////// Import Contacts //////////////////////////
//////////////////////////////////////////////////////////////////
export const importContacts = async (userId, contacts) => {
  const formData = await makeFormData(userId, contacts);
  const request_url = `${url}/user/import_contacts`
  console.log("request_url: ", request_url);
  return fetch(request_url, {
      method: "POST",
      body: formData,
      header: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
  })
  .then(response => response.json())
};

function makeFormData(userId, contacts) {
  return new Promise(async function (resolve, reject){
    var formData = new FormData();
    formData.append("userId", userId);
    formData.append("count", contacts.length);
    if (contacts && contacts.length > 0) {
      for (var i = 0; i < contacts.length; i++) {
        const c = contacts[i];
        if (c.firstName) {
          formData.append("firstName" + i, c.firstName);
        }
        
        if (c.lastName) {
          formData.append("lastName" + i, c.lastName);
        }
        
        if (c.phone) {
          formData.append("phone" + i, c.phone);
        }
        
        if (c.email) {
          formData.append("email" + i, c.email);
        }

        if (c.avatar && c.avatar.length > 0) {
          var url = c.avatar;

          // Get extension from name.
          var extension = c.avatar.split('.').pop().toLowerCase();
          var filename = makeRandomText(20) + "." + extension;
          var filetype = "image/jpeg";
          if (extension == "png") {
            filetype = "image/png";
          }

          var params = {
            name: filename,
            type: filetype,
            uri: url
          };

          var photo = await compressImage(params);
          const fileUri = filterFileUri(photo.uri, Platform.OS);
          var data = {
            name: photo.name,
            type: filetype,
            uri: fileUri
          };
          formData.append("avatar" + i, data);
        }
      }
    }
    resolve(formData);
  });
}

//////////////////////////////////////////////////////////////////
////////////////////////// Send Invite ///////////////////////////
//////////////////////////////////////////////////////////////////
export const sendInvite = (email, receiver, sender) => {
  const method = 'POST';
  const request_url = `${url}/user/send_invite`
  const headers = {
    'Content-Type': 'application/json',
  }
  const body = JSON.stringify({ 
    email: email,   
    receiver: receiver,             
    sender: sender,
  });

  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

//////////////////////////////////////////////////////////////////
////////////////////////// Add Contact ///////////////////////////
//////////////////////////////////////////////////////////////////
export const addContact = (contact, userId) => {
  const formData = new FormData();
  if (contact.avatarFile) {
    var filename = filterFileName(contact.avatarFile, Platform.OS);
    var filetype = contact.avatarFile.type ? contact.avatarFile.type : 'image/jpeg';
    const fileUri = filterFileUri(contact.avatarFile.uri, Platform.OS);
    const params = {
      name: filename,
      type: filetype,
      uri: fileUri
    };
    formData.append("avatar", params);        
  }

  formData.append("firstName", contact.firstName);
  formData.append("lastName", contact.lastName);
  formData.append("email", contact.email);
  formData.append("phone", contact.phone);
  formData.append("userId", userId);

  const request_url = `${url}/user/add_contact`
  return fetch(request_url, {
      method: "POST",
      body: formData
  })
  .then(response => response.json())
};

//////////////////////////////////////////////////////////////////
////////////////////////// Edit Contact ///////////////////////////
//////////////////////////////////////////////////////////////////
export const editContact = (contact, userId) => {
  const formData = new FormData();
  if (contact.avatarFile) {
    var filename = filterFileName(contact.avatarFile, Platform.OS);
    var filetype = contact.avatarFile.type ? contact.avatarFile.type : 'image/jpeg';
    const fileUri = filterFileUri(contact.avatarFile.uri, Platform.OS);
    const params = {
      name: filename,
      type: filetype,
      uri: fileUri
    };
    formData.append("avatar", params);        
  }

  formData.append("id", contact.id);
  formData.append("firstName", contact.firstName);
  formData.append("lastName", contact.lastName);
  formData.append("email", contact.email);
  formData.append("phone", contact.phone);
  formData.append("userId", userId);

  const request_url = `${url}/user/edit_contact`
  return fetch(request_url, {
      method: "POST",
      body: formData
  })
  .then(response => response.json())
};

//////////////////////////////////////////////////////////////////
/////////////////////// Remove Contact ///////////////////////////
//////////////////////////////////////////////////////////////////
export const removeContact = (userId, contactId) => {
  const method = 'POST';
  const request_url = `${url}/user/remove_contact`
  const headers = {
    'Content-Type': 'application/json',
  }
  const body = JSON.stringify({ 
    userId: userId,
    contactId: contactId,
  });

  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

//////////////////////////////////////////////////////////////////
////////////////////// Get Contact Status ////////////////////////
//////////////////////////////////////////////////////////////////
export const getContactStatus = (userId) => {
  const method = 'POST';
  const request_url = `${url}/user/get_contact_status`
  const headers = {
    'Content-Type': 'application/json',
  }
  const body = JSON.stringify({ 
    userId: userId,   
  });

  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

//////////////////////////////////////////////////////////////////
//////////////////////// Get My Friends //////////////////////////
//////////////////////////////////////////////////////////////////
export const getMyFriends = (userId) => {
  const method = 'POST';
  const request_url = `${url}/user/get_my_friends`
  const headers = {
    'Content-Type': 'application/json',
  }
  const body = JSON.stringify({ 
    user_id: userId,   
  });

  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

//////////////////////////////////////////////////////////////////
//////////////////////// Get Friend Count ////////////////////////
//////////////////////////////////////////////////////////////////
export const getFriendCount = (userId) => {
  const method = 'POST';
  const request_url = `${url}/user/get_friend_count`
  const headers = {
    'Content-Type': 'application/json',
  }
  const body = JSON.stringify({ 
    user_id: userId,   
  });

  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

//////////////////////////////////////////////////////////////////
///////////////////// Send Friend Request ////////////////////////
//////////////////////////////////////////////////////////////////
export const sendFriendRequest = (userId, friendId, contactId) => {
  const method = 'POST';
  const request_url = `${url}/user/send_friend_request`
  const headers = {
    'Content-Type': 'application/json',
  }
  const body = JSON.stringify({ 
    user_id: userId,   
    friend_id: friendId,
    contact_id: contactId
  });

  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

//////////////////////////////////////////////////////////////////
//////////////////// Accept Friend Request ///////////////////////
//////////////////////////////////////////////////////////////////
export const acceptFriendRequest = (userId, friendId) => {
  const method = 'POST';
  const request_url = `${url}/user/accept_friend`
  const headers = {
    'Content-Type': 'application/json',
  }
  const body = JSON.stringify({ 
    user_id: userId,   
    friend_id: friendId
  });

  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

//////////////////////////////////////////////////////////////////
///////////////////// Decline Friend Request /////////////////////
//////////////////////////////////////////////////////////////////
export const declineFriendRequest = (userId, friendId) => {
  const method = 'POST';
  const request_url = `${url}/user/decline_friend`
  const headers = {
    'Content-Type': 'application/json',
  }
  const body = JSON.stringify({ 
    user_id: userId,   
    friend_id: friendId
  });

  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

//////////////////////////////////////////////////////////////////
//////////////////////// Remove Friend ///////////////////////////
//////////////////////////////////////////////////////////////////
export const removeFriend = (userId, friendId) => {
  const method = 'POST';
  const request_url = `${url}/user/remove_friend`
  const headers = {
    'Content-Type': 'application/json',
  }
  const body = JSON.stringify({ 
    user_id: userId,   
    friend_id: friendId
  });

  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

//////////////////////////////////////////////////////////////////
////////////////////// Change Subscription ///////////////////////
//////////////////////////////////////////////////////////////////
export const changeSubscription = (user_id, level, subscription) => {
  const method = 'POST';
  const request_url = `${url}/user/change_subscription`
  const headers = {
    'Content-Type': 'application/json',
  }
  const body = JSON.stringify({ 
    user_id,   
    level,
    subscription: JSON.stringify(subscription)
  });

  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};