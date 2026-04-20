import client from './client';

export const getMe = () =>
  client.get('/auth/me').then(r => r.data);

export const updateNickname = (nickname) =>
  client.patch('/auth/me/nickname', { nickname }).then(r => r.data);

export const updateAvatarColor = (avatarColor) =>
  client.patch('/auth/me/avatar-color', { avatarColor }).then(r => r.data);
