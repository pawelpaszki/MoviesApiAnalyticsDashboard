## Analytics dashboard movies API

This project is a supplement of [this API](https://github.com/pawelpaszki/ewd-api-labs-2023). It fetches logs from the app and displays stats about usage of the API:

* Total requests count
* Total successful requests count
* Total error requests count
* Number of api url hits (per endpoint and http method)
* logs from the API

![][s1]

![][s2]

### Built With

[![React][React.js]][React-url]

## Getting Started

Copy the `env.example` into `.env` and add `VITE_SECRET_TOKEN` that will be used for authentication with the API

### Prerequisites

Make sure that node is installed on your system

```sh
npm install npm@latest -g
```

### Installation

Clone the repo and run:

```
npm install
```

### Running

```
npm run dev
```

[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[s1]: ./images/s1.png
[s2]: ./images/s2.png