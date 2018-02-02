import config from './config'

// 获取用户认证URL
export const GET_AUTH_URL = baseUrl => `${config.baseUrl}/oauth/authorize?client_id=${config.clientId}&redirect_uri=${config.redirectUri(baseUrl)}&response_type=token`

// 获取用户信息URL
export const GET_USER_URL = () => `${config.baseUrl}/v1/users/self`

// 获取用户图片URL
export const GET_MEIDAS_URL = () => `${config.baseUrl}/v1/users/self/media/recent`
