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

  // Verificar se o login foi bem-sucedido
  check(loginResponse, {
    'Login realizado com sucesso': (r) => r.status === 200,
    'Resposta contém token': (r) => r.body.includes('token'),
  });

  sleep(1); // Pausa de 1 segundo
}
