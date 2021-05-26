const jsonServer = require('json-server');
const iso4217 = require('./iso4217.json');

const getCotacao = require('./cotacao');

const PORT = 3000;

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

server.use(middlewares);

server.get("/infoCompleta/all", async (req, res) => {
  const keys = Object.keys(iso4217);

  let cotacoes = [];
  
  try {
    for(const index in keys){
      const key = keys[index];
      let current;
  
      try {
        current = await getCotacao(key);
      } catch (error) {
        current = null;
      }

      if(current != null) {
        cotacoes.push(current.data[`${key}BRL`]);
      }
    }
    
    res.send(cotacoes);
  } catch (error) {
    console.log({ error });
    res.status(500).json({ error });
  }
});

server.get("/infoCompleta/:coin", async (req, res) => {
  const coinCode = req.params.coin;
  const coin = iso4217[coinCode];

  let cotacao;

  try {
    cotacao = await getCotacao(coinCode);
  } catch (error) {
    cotacao = null;
  }
  
  res.send({ 
    ...coin,
    cotacao: cotacao === null ? {}:cotacao.data[`${coinCode}BRL`] });
});

server.use(jsonServer.bodyParser);
server.post("/login", (req,res) => {
  const { body } = req;

  const { users } = require("./db.json");

  for(index in users) {
    const user = users[index];
    if(user.email === body.email){
      if(user.password === body.password){
        return res.status(202).send({ status:202, id:user.id });
      }
      return res.status(401).send({ status: 401, message:"Senha incorreta" });
    }
  }

  return res.status(404).send({ status: 404, message: "Usuário não encontrado"});
});

server.use(router);

server.listen(PORT, () => console.log('JSON Server is running'));
