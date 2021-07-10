import axios from 'axios';
//import config from '../config.json';
import moment from "moment";
const config = { api: process.env.REACT_APP_API_URL};

console.log('config :', config);

export default class {

     static getAll = async keyword => {
        console.log('canalbox : ');
        
        let result = {
            data: null,
            error: null
        };

        await axios.post(`${config.api}/categories/all`, {keyword: keyword})
            .then(resp => {
                console.log('cool : ');
                if (resp.status === 200) {
                    result.data = resp.data;
                }
            })
            .catch(err => {
                console.log('pas cool : ', err);
                result.error = err.response.data;
            });

        return result;
    } 

    static getAllFlat = async keyword => {
        let result = {
            data: null,
            error: null
        };

        await axios.post(`${config.api}/categories/all-flat`, {keyword: keyword})
            .then(resp => {
                console.log(resp);
                if (resp.status === 200) {
                    result.data = resp.data;
                }
            })
            .catch(err => {
                result.error = err.response.data;
            });

        return result;
    }

    static add = async (label, parentCategoryId) => {
        let result = {
            data: null,
            error: null
        };

        const data = {
            label: label,
            parentCategoryId: parentCategoryId,
            dateCreated: moment().format(),
            dateUpdated: moment().format()
        };

        await axios.post(`${config.api}/categories`, data)
            .then(resp => {
                if (resp.status === 200) {
                    result.data = resp.data;
                }
            })
            .catch(err => {
                result.error = err.response.data;
            });

        return result;
    }

    static update = async (id, label, parentCategoryId) => {
        let result = {
            data: null,
            error: null
        };

        const data = {
            label: label,
            parentCategoryId: parentCategoryId,
            dateUpdated: moment().format()
        };

        await axios.post(`${config.api}/categories/${id}`, data)
            .then(resp => {
                console.log('passed : ', resp);
                if (resp.status === 200) {
                    result.data = resp.data;
                }
            })
            .catch(err => {
                console.log('error : ', err);
                result.error = err.response.data;
            });

        return result;
    }

    static getPath = async id => {
        let result = {
            data: null,
            error: null
        };

        await axios.get(`${config.api}/categories/${id}`)
            .then(resp => {
                if (resp.status === 200) {
                    result.data = resp.data;
                }
            })
            .catch(err => {
                result.error = err.response.data;
            });

        return result;
    }

    static delete = async id => {
        let result = {
            data: null,
            error: null
        };

        await axios.delete(`${config.api}/categories/${id}`)
            .then(resp => {
                if (resp.status === 200) {
                    result.data = resp.data;
                }
            })
            .catch(err => {
                result.error = err.response.data;
            });

        return result;
    }
}