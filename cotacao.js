const axios = require('axios');

async function getCotacao(coin) {
  return axios.get(`https://economia.awesomeapi.com.br/json/last/${coin}-BRL`);
}

module.exports = getCotacao;