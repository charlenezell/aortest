// in src/restClient
import _ from "lodash";
import {
    GET_LIST,
    GET_ONE,
    GET_MANY,
    GET_MANY_REFERENCE,
    CREATE,
    UPDATE,
    DELETE,
    fetchUtils,
} from 'admin-on-rest';

import { stringify } from 'query-string';

const API_URL = '';

/**
 * @param {String} type One of the constants appearing at the top if this file, e.g. 'UPDATE'
 * @param {String} resource Name of the resource to fetch, e.g. 'posts'
 * @param {Object} params The REST request params, depending on the type
 * @returns {Object} { url, options } The HTTP request parameters
 */
const convertRESTRequestToHTTP = (type, resource, params) => {
    let url = '';
    const options = {};
    if (!options.headers) {
        options.headers = new Headers({ Accept: 'application/json' });
    }
    switch (type) {
        case GET_LIST: {//读取列表
            const { page, perPage } = params.pagination;
            // const { field, order } = params.sort;
            // 可以实现排序
            const query = {
                offset: (page - 1) * perPage,
                limit: perPage
            };
            url = `${API_URL}/${resource}/list.json?${stringify(query)}`;
            break;
        }
        case GET_ONE://编辑时候进入时使用
            url = `${API_URL}/${resource}/list.json?offset=0&limit=1000000`;
            break;
        // case GET_MANY: {
        //     const query = {
        //         filter: JSON.stringify({ id: params.ids }),
        //     };
        //     url = `${API_URL}/${resource}?${stringify(query)}`;
        //     break;
        // }
        // case GET_MANY_REFERENCE: {
        //     const { page, perPage } = params.pagination;
        //     const { field, order } = params.sort;
        //     const query = {
        //         sort: JSON.stringify([field, order]),
        //         range: JSON.stringify([(page - 1) * perPage, (page * perPage) - 1]),
        //         filter: JSON.stringify({ ...params.filter, [params.target]: params.id }),
        //     };
        //     url = `${API_URL}/${resource}?${stringify(query)}`;
        //     break;
        // }
        case UPDATE://修改时候使用
            url = `${API_URL}/${resource}/mod.json`;
            options.method = 'POST';
            options.body = stringify(params.data);
            options.headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8');
            break;
            case CREATE://创建使用
            options.method = 'POST';
            url = `${API_URL}/${resource}/add.json`;
            options.body = stringify(params.data);
            options.headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8');
            break;
        case DELETE://删除使用
            url = `${API_URL}/${resource}/${params.id}`;
            options.method = 'DELETE';
            break;
        default:
            throw new Error(`Unsupported fetch action type ${type}`);
    }

    // add your own headers here
    options.credentials = 'include';
    return { url, options };
};

/**
 * @param {Object} response HTTP response from fetch()
 * @param {String} type One of the constants appearing at the top if this file, e.g. 'UPDATE'
 * @param {String} resource Name of the resource to fetch, e.g. 'posts'
 * @param {Object} params The REST request params, depending on the type
 * @returns {Object} REST response
 */
const convertHTTPResponseToREST = (response, type, resource, params) => {
    const { headers, json } = response;
    switch (type) {
        case GET_LIST:
            return {
                data: json.data.datas,
                total: json.data.totalCount
            };
        case GET_ONE://适配为前端检索某一条
            return {
                data: _.find(json.data.datas, { id: parseInt(params.id) })
            }
        case CREATE:
            return { data: { ...params.data, id: json.id } };
        default:
            return { data: json };
    }
};

/**
 * @param {string} type Request type, e.g GET_LIST
 * @param {string} resource Resource name, e.g. "posts"
 * @param {Object} payload Request parameters. Depends on the request type
 * @returns {Promise} the Promise for a REST response
 */
export default (type, resource, params) => {
    const { fetchJson } = fetchUtils;
    const { url, options } = convertRESTRequestToHTTP(type, resource, params);
    return fetchJson(url, options)
        .then(response => convertHTTPResponseToREST(response, type, resource, params));
};