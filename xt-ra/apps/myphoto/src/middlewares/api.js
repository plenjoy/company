import fetch from 'isomorphic-fetch';
import x2jsInstance from '../../../common/utils/xml2js';

function getOptions(method = 'GET', headers, body) {
	return {
		method,
		body,
    headers,
		credentials: 'same-origin'
	}
}

export const request = async function (url, method, headers, body) {

  const response = await fetch(url, getOptions(method, headers, body));
	const text = await response.text();

	if (!response.ok) {
		throw response;
	}

	try {
		return JSON.parse(text);
	} catch (e) {
		return x2jsInstance.xml2js(text);
	}
}