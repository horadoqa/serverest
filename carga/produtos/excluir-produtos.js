import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 1,          // Número de usuários virtuais
  duration: '30s',  // Duração do teste
};

// Dados de login
const loginPayload = JSON.stringify({
  email: "horadoqa@gmail.com",
  password: "1q2w3e4r",
});

export default function () {
  // 1. Requisição para realizar o login
  const loginResponse = http.post('https://serverest.dev/login', loginPayload, {
    headers: { 'Content-Type': 'application/json' },
  });

  // Verificar se o login foi bem-sucedido e se contém um token
  check(loginResponse, {
    'Login realizado com sucesso': (r) => r.status === 200,
    'Resposta contém token': (r) => r.body.includes('token'),
  });

  // Extrair o token da resposta do login
  const responseBody = JSON.parse(loginResponse.body);
  const token = responseBody.token;  // O token está na resposta JSON, geralmente em um campo 'token'

  // Dados do produto a ser cadastrado
  const productPayload = JSON.stringify({
    nome: "JBL, Fone de Ouvido On ear, Tune 720BT - Preto",
    preco: 320,
    descricao: "Fone de Ouvido",
    quantidade: 381
  });

  // 2. Requisição para cadastrar o produto com o token de autenticação
  const productResponse = http.post('https://serverest.dev/produtos', productPayload, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // Usando o token de autenticação obtido no login
    },
  });

  // Verificar se o produto foi cadastrado com sucesso e pegar o ID
  check(productResponse, {
    'Produto cadastrado com sucesso': (r) => r.status === 201,  // Verificando se a resposta é 201 Created
  });

  // Extrair o ID do produto da resposta de cadastro
  const product = JSON.parse(productResponse.body);
  const productId = product._id;  // O ID do produto geralmente está em _id ou id, dependendo da API

  // 3. Requisição para excluir o produto usando o ID e o token de autenticação
  const deleteResponse = http.del(`https://serverest.dev/produtos/${productId}`, null, {
    headers: {
      'Authorization': `Bearer ${token}`, // Usando o token de autenticação
    },
  });

  // Verificar se a exclusão foi bem-sucedida
  check(deleteResponse, {
    'Produto excluído com sucesso': (r) => r.status === 200 || r.status === 204, // 200 ou 204 geralmente indicam sucesso na exclusão
  });

  sleep(1); // Pausa de 1 segundo
}
