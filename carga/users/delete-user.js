import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 1,          // Número de usuários virtuais
  duration: '30s',  // Duração do teste
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

  // Buscar o ID do usuário recém-criado
  const user = JSON.parse(createResponse.body);

  // Garantir que o ID foi retornado após a criação do usuário
  check(user, {
    'ID do usuário obtido': (u) => u.id !== undefined,
  });

  // Requisição para excluir o usuário
  const deleteResponse = http.del(`https://serverest.dev/usuarios/${user.id}`);
  
  // Verificar se a exclusão foi bem-sucedida (status 200 ou 204)
  check(deleteResponse, {
    'Usuário excluído com sucesso': (r) => r.status === 200 || r.status === 204,
  });

  sleep(1); // Pausa de 1 segundo
}
