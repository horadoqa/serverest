import http from 'k6/http';
import { check, sleep } from 'k6';
import { parse } from 'k6/encoding';

export const options = {
  vus: 1,          // Número de usuários virtuais
  duration: '30s',  // Duração do teste
};

export default function () {
  // 1. Requisição GET para obter todos os usuários
  const usersResponse = http.get('https://serverest.dev/usuarios');

  // Verificar se a requisição foi bem-sucedida
  check(usersResponse, {
    'Requisição de usuários foi bem-sucedida': (r) => r.status === 200,
  });

  // Extrair o ID do usuário com email 'horadoqa@gmail.com'
  const users = JSON.parse(usersResponse.body).usuarios;
  const user = users.find(u => u.email === 'horadoqa@gmail.com');

  // Verificar se o usuário foi encontrado
  if (!user) {
    console.error('Usuário com o email "horadoqa@gmail.com" não encontrado');
    return;
  }

  const userId = user._id;  // Extrair o ID do usuário

  // 2. Requisição GET para acessar o usuário pelo ID
  const userResponse = http.get(`https://serverest.dev/usuarios/${userId}`);

  // Verificar se a requisição para acessar o usuário foi bem-sucedida
  check(userResponse, {
    'Usuário encontrado com sucesso': (r) => r.status === 200,
    'Resposta contém dados do usuário correto': (r) => {
      const body = JSON.parse(r.body);
      return body._id === userId;  // Verificar se o ID corresponde ao ID buscado
    },
  });

  sleep(1); // Pausa de 1 segundo
}
