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
  // Requisição para realizar o login
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

  // Requisição para cadastrar o produto com o token de autenticação
  const productResponse = http.post('https://serverest.dev/produtos', productPayload, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // Usando o token de autenticação obtido no login
    },
  });

  // Verificar se o produto foi cadastrado com sucesso
  check(productResponse, {
    'Produto cadastrado com sucesso': (r) => r.status === 201,  // Verificando se a resposta é 201 Created
  });

  sleep(1); // Pausa de 1 segundo
}
