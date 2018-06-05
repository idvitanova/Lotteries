config = {
    port: 9696,
    externalApi: 'https://api.softlotto.com',
    api_token: '',
    api_registration: {
        url: '/api/customer/site/',
        file: '/register.json',
        method: 'POST'
    },
    api_login: {
        url: '/api/customer/site/',
        file: '/login.json',
        method: 'POST'
    },
    api_user_edit: {
        url: '/api/customer/site/',
        file: '/edit.json',
        user_token: '/token/',
        method: 'POST'
    },
    api_lottaries: {
        url: '/api/lotteries/site/',
        file: '/list.json',
        method: 'GET'
    }
};

module.exports = config;