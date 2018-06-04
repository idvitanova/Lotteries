config = {
    port: 8008,
    externalApi: 'https://api.softlotto.com',
    api_token: '',
    api_registration: {
        url: '/api/customer/site/',
        file: '/register.json',
        method: 'POST'
    },
    api_login: {
        url: '/api/customer/site/',
        file: '/register.json',
        method: 'POST'
    },
    api_user_edit: {
        url: '/api/customer/site/',
        file: '/register.json',
        method: 'POST'
    },
    api_lottaries: {
        url: '/api/customer/site/',
        file: '/register.json',
        method: 'POST'
    }
};

module.exports = config;