# Gateway and frontend

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the frontend.

## Enviroment variables

Ensure you have a ```.env*``` file in the root folder. In this file put the secret cookie password, for example:
```
SECRET_COOKIE_PASSWORD=eHYx7xfHzN7nTChmq5wQXkz1Lv164k0W
```

You can generate a password [here](https://1password.com/password-generator/). The password has to be at least 32 characters long.
## Build docker image

```bash
docker build . -t wifeye/frontend-gateway
```