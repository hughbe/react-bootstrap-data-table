import { browserHistory } from 'react-router';

export const addQuery = (query) => {
  const location = Object.assign({}, browserHistory.getCurrentLocation());
  Object.assign(location.query, query);
  browserHistory.push(location);
};