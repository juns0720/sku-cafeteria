import client from './client';

export const getTodayMenus = (slot = 'LUNCH', corner) =>
  client.get('/menus/today', { params: { slot, corner } }).then(r => r.data);

export const getWeeklyMenus = (date) =>
  client.get('/menus/weekly', { params: { date } }).then(r => r.data);

export const getAllMenus = ({ q, corner, sort, scope = 'all' } = {}) =>
  client.get('/menus', { params: { q, corner, sort, scope } }).then(r => r.data);

export const getMenuById = (id) =>
  client.get(`/menus/${id}`).then(r => r.data);

export const getBestMenus = () =>
  client.get('/menus/best').then(r => r.data);

export const getCorners = () =>
  client.get('/menus/corners').then(r => r.data);
