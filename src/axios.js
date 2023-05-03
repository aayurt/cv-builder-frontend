import axios from 'axios';

const AxiosClient = axios.create({
  baseURL: process.env.REACT_APP_API,
  timeout: 1000,
});
export default AxiosClient;
