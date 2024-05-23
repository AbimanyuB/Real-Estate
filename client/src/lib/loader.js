import apiRequest from './apiRequest.js';
import { defer } from 'react-router-dom';

export const singlePageLoader = async ({request, params}) => {
  const res = await apiRequest.get(`/posts/${params.id}`);
  return res.data;
}

export const listPageLoader = async ({request, params}) => {
  const query = request.url.split("?")[1]
  const postPromise = await apiRequest.get(`/posts?${query}`);
  return defer({
    postResponse: postPromise
  })
}

export const profilePageLoader = async ({request, params}) => {
  const postPromise = await apiRequest.get(`/users/profile/posts`);
  return defer({
    postResponse: postPromise
  })
}