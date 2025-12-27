export const PUBLIC_APP_URL = import.meta.env.PUBLIC_APP_URL || 'http://localhost:4321';
export const PUBLIC_APP_LOGIN_PATH = import.meta.env.PUBLIC_APP_LOGIN_PATH || '/signin';

export const getAppUrl = (path = '') => {
  const baseUrl = PUBLIC_APP_URL.replace(/\/$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
};

export const getLoginUrl = () => getAppUrl(PUBLIC_APP_LOGIN_PATH);
