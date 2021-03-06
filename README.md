<h2 align="center">
Este Módulo retem o Desafio Final.
Uma aplicação completa com Back-end (NodeJs), Front-end(React) e Mobile(React Native), com objetivo de Certificação do Curso Rocketseat Bootcamp GoStack.
</h1>

<h1 align="center">
<img src="https://github.com/rfilippelli/FastFeet/blob/master/img/FastFeet.jpg" width="70%" heigth="70%" />
</h1>

---

## Para iniciar a aplicação.

### Requerimentos:

_Pré-requisitos da Aplicação:_

- [Node](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/)

### Base de dados da aplicação.

- [Redis](https://redis.io/)
- [Postgres](https://github.com/postgres/postgres)
- [MongoDB](https://www.mongodb.com/)

### Foi utilizado o Container Docker para os bancos de dados. Seguem as instruções:

```bash
#Instalação do Redis
docker run --name redisfastfeet -p 6379:6379 -d -t redis:alpine

#Instalação do Postgres
docker run --name fastfeet -e POSTGRES_PASSWORD=fastfeet -p 5432:5432 -d postgres

#Instalação do MongoDB
docker run --name mongofastfeet -p 27017:27017 -d -t mongo

```

### Iniciando o Aplicativo.

### Backend Fastfeet

Agora clone este repositório FastFeetBackEnd e instale suas dependências:

_Abra o terminal na pasta do FastFeetBackEnd e instale as dependências:_

```bash

#instalando as dependências
yarn

```

Para que haja a conexão do backend colocar informações no arquivo .env, baseado no que está dentro do banco de dados, usuarios e senhas do sistema.

```bash
# rodando as migrations para o banco
yarn sequelize db:migrate

# permitindo que haja o administrador no banco
yarn sequelize db:seed:all

# iniciando a aplicação
yarn dev & yarn queue
```

Após o Backend estar Up, o frontend e o mobile poderão ser iniciados.

---

### Frontend Web Fastfeet

_Abra o terminal na pasta do FastFeetWeb e instale as dependências:_

```bash
yarn
yarn start
```

_Usuário Master do sistema:_

```bash
Email: admin@fastfeet.com
Senha: 123456
```

<h1 align="center">
<img src="https://github.com/rfilippelli/FastFeet/blob/master/img/FatWeb.jpg" width="50%" height="50%" />

---

### Aplicativo FastFeetMobile

```bash
# Instalar as dependências
yarn
```

_Após todas as configurações pode iniciar a aplicação._

```bash

# para rodar a aplicação
yarn start

```

<h1 align="center">
<img src="https://github.com/rfilippelli/FastFeet/blob/master/img/FastMob.jpg" width="30%" height="30%" />

---

Rodrigo Filippelli
