import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 1,          // Número de usuários virtuais
  duration: '30s',  // Duração do teste
};

export default function () {
  // 1. Requisição para verificar todos os produtos
  const productsResponse = http.get('https://serverest.dev/produtos');

  // Verificar se a requisição foi bem-sucedida e se os produtos foram retornados
  check(productsResponse, {
    'Produtos retornados com sucesso': (r) => r.status === 200,
    'Resposta contém lista de produtos': (r) => {
      const body = JSON.parse(r.body);
      return body.produtos && body.produtos.length > 0; // Verifica se a lista de produtos não está vazia
    },
  });

  sleep(1); // Pausa de 1 segundo
}
