import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 1,          // Número de usuários virtuais
  duration: '30s', // Duração do teste
};

// Dados do novo usuário
const payload = JSON.stringify({
  nome: "Hora do QA",
  email: "horadoqa@gmail.com",
  password: "1q2w3e4r",
  administrador: "true",
});

export default function () {
  // Requisição para criar o usuário
  const createResponse = http.post('https://serverest.dev/usuarios', payload, {
    headers: { 'Content-Type': 'application/json' },
  });

  // Verificar se a criação foi bem-sucedida (status 201 - Created)
  check(createResponse, {
    'Usuário criado com sucesso': (r) => r.status === 201,
  });

  // Buscar todos os usuários para verificar se o usuário foi criado
  const getResponse = http.get('https://serverest.dev/usuarios');
  
  // Verificar se o usuário aparece na resposta
  check(getResponse, {
    'Usuário criado aparece na lista': (r) => r.status === 200 && r.body.includes('horadoqa@gmail.com'),
  });

  sleep(1); // Pausa de 1 segundo
}
