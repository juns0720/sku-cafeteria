import client from './client';

export const getReviews = (menuId, { page = 0, size = 20 } = {}) =>
  client.get('/reviews', { params: { menuId, page, size } }).then(r => r.data);

export const getMyReviews = () =>
  client.get('/reviews/me').then(r => r.data);

export const createReview = (menuId, { tasteRating, amountRating, valueRating, comment, photoUrls = [] }) =>
  client.post('/reviews', { menuId, tasteRating, amountRating, valueRating, comment, photoUrls }).then(r => r.data);

export const updateReview = (reviewId, { tasteRating, amountRating, valueRating, comment, photoUrls = [] }) =>
  client.put(`/reviews/${reviewId}`, { tasteRating, amountRating, valueRating, comment, photoUrls }).then(r => r.data);

export const deleteReview = (reviewId) =>
  client.delete(`/reviews/${reviewId}`);
