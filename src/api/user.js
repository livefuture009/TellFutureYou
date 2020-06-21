import { url } from '../constants';
import { Platform } from 'react-native';
import { filterFileUri, filterFileName } from '../functions';

////////////////////////////////////////////////////////////////////////////
//////////////////////////// Login User ////////////////////////////////////
////////////////////////////////////////////////////////////////////////////

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

export const updateProfile = (user) => {
  const formData = new FormData();
  if (user.avatarFile) {
    var filename = filterFileName(user.avatarFile, Platform.OS);
    var filetype = user.avatarFile.typeㅁ ? user.avatarFile.type : 'image/jpeg';
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