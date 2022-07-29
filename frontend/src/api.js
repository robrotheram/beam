
const API_URI = () => {
    if (process.env.NODE_ENV !== "production"){
        return "http://localhost:8080/api/"
    }
    return "/api/"
}

const Search = (query) => {
    return fetch(API_URI()+"site?q="+query).then(res => res.json())
}

const User = () => {
    return fetch(API_URI()+"user").then(res => res.json())
}


const SiteData = (site) => {
    return fetch(API_URI()+'site', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(site),
    })
    .then(response => response.json())
    .catch((error) => {
        console.error('Error:', error);
    });
}

const IndexSite = (site) => {
    return fetch(API_URI()+'site', { 
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(site),
    })
    .then(response => response.json())
    .catch((error) => {
        console.error('Error:', error);
    });
}

export default {
    Search,
    SiteData,
    IndexSite,
    User
}