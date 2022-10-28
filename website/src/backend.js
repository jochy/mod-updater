import * as Typesense from 'typesense';
import axios from 'axios';

const backendUrl = "https://backend.sims-mods-updater.com";
//const backendUrl = "http://localhost:9001";

const typesenseClient = new Typesense.Client({
    'nodes': [
        {
            'host': 'ts.sims-mods-updater.com',
            'port': '443',
            'protocol': 'https'
        }/*
        {
            'host': 'localhost',
            'port': '8108',
            'protocol': 'http'
        }*/
        ],
    'apiKey': 'xY3b16ijvcZAejfllX0OWyAXCkjZSQk3',
    'numRetries': 3, // A total of 4 tries (1 original try + 3 retries)
    'connectionTimeoutSeconds': 20,
    'cacheSearchResultsForSeconds': 10,
    'useServerSideSearchCache': true,
    'logLevel': 'info'
});

function search(query, page, filters) {
    let req = {
        'q': query,
        'query_by': 'title,tags,desc,provider,creator',
        'page': page,
        'per_page': 30,
        'include_fields': 'id,title,provider,tags,date,updated,short_desc,preview,required,downloaded,creator,type,mods,creatorPseudo',
        'highlight_fields': 'id'
    };
    let filerBy = "";
    if (filters != null) {
        if (filters.sort != null && filters.sort !== 'none') {
            req['sort_by'] = `${filters.sort}:${filters.order}`;
        }
        if (filters.tags != null && filters.tags.length > 0) {
            let tmp = filters.tags.map(tag => `tags:${tag.exclude ? '!' : ''}=${tag.tag.replaceAll(':', "").replaceAll("&", "")}`)
                .join(' && ');
            filerBy = filerBy + " && " + tmp;
        }
        if (filters.provider != null && filters.provider.length > 0) {
            filerBy = `${filerBy} && provider:${filters.provider}`;
        }
        if (filters.creator != null && filters.creator.length > 0) {
            filerBy = `${filerBy} && creator:${filters.creator}`;
        }
        if (filters.type != null && filters.type.length > 0) {
            filerBy = `${filerBy} && type:${filters.type}`;
        }
        if (filerBy.startsWith(" && ")) {
            filerBy = filerBy.substring(4);
        }
        if (filerBy.length > 0) {
            req['filter_by'] = filerBy;
        }
    }
    return typesenseClient.collections('sims4-mods').documents().search(req)
}

function lastUpdated() {
    return typesenseClient.collections('sims4-mods').documents().search({
        'q': '*',
        'sort_by': 'updated:desc',
        'filter_by': 'type:mod',
        'include_fields': 'id,title,preview,type',
        'per_page': 5
    });
}

function mostDownloaded() {
    return typesenseClient.collections('sims4-mods').documents().search({
        'q': '*',
        'sort_by': 'downloaded:desc',
        'filter_by': 'type:mod',
        'include_fields': 'id,title,preview,type',
        'per_page': 5
    });
}

async function count() {
    return (await typesenseClient.collections('sims4-mods').retrieve()).num_documents;
}

function getById(id) {
    return typesenseClient.collections('sims4-mods').documents(id).retrieve();
}

function getByIds(ids) {
    return typesenseClient.collections('sims4-mods').documents().search({
        'q': '*',
        'filter_by': 'id:' + '[' + ids.join(",") + ']',
        'include_fields': 'id,title,preview,url,type',
        'per_page': 5
    });
}

function suggestions(modId, userId) {
    return axios.get(`${backendUrl}/mods/${modId}?userId=${userId}`)
        .then(res => res.data)
        .then(suggestions => getByIds(suggestions.suggestions)
            .then(res => res.hits)
            .then(hits => {
                return {...suggestions, suggestions: hits}
            }));
}

function markModAsOutdated(modId, userId) {
    return axios.post(`${backendUrl}/user/${userId}/mark-outdated/${modId}`, {})
        .then(res => res.data)
        .then(suggestions => getByIds(suggestions.suggestions)
            .then(res => res.hits)
            .then(hits => {
                return {...suggestions, suggestions: hits}
            }));
}

function unmarkModAsOutdated(modId, userId) {
    return axios.delete(`${backendUrl}/user/${userId}/mark-outdated/${modId}`, {})
        .then(res => res.data)
        .then(suggestions => getByIds(suggestions.suggestions)
            .then(res => res.hits)
            .then(hits => {
                return {...suggestions, suggestions: hits}
            }));
}

async function loadFacts() {
    let countDocs = count();
    let stats = (await axios.get('https://us-central1-smod-manager.cloudfunctions.net/getStatistics')).data;
    return {
        count: await countDocs,
        installed: stats.installs + stats.removes,
        updated: await stats.updates
    }
}

async function translate(html, to) {
    let body = new FormData();
    body.append("q", html);
    body.append("source", "en");
    body.append("target", to);
    body.append("format", "html");

    return axios.post("https://lt.vern.cc/translate", body, {
        headers: {
            Accept: "application/json"
        }
    });
}

async function createOrUpdateGroup(group, accessToken, userId) {
    return axios.post(`${backendUrl}/group`, {
        userId: userId,
        group: group,
        userToken: accessToken
    });
}

async function rateVersion(userId, version, score) {
    return axios.post(`${backendUrl}/user/${userId}/rate/${version}`, {
        score: score
    });
}

async function getRateVersion(userId, version) {
    return axios.get(`${backendUrl}/user/${userId}/rate/${version}`).then(res => res.data)
        .catch(err => null);
}

export default {
    search,
    getById,
    count,
    lastUpdated,
    mostDownloaded,
    loadFacts,
    suggestions,
    markModAsOutdated,
    unmarkModAsOutdated,
    translate,
    createOrUpdateGroup,
    rateVersion,
    getRateVersion
}