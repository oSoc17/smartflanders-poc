# Smart Flanders POC 🎓

30% of all traffic in a city is due to people looking for a parking spot. Wouldn't it be nice to help those people in finding a parking spot on the fly. With this proof of concept we do not only try to address this issue we also want to prove to governments and industries to publish as much data as possible as linked data. By publishing their data as linked data developers could link different datasets together and use it for a variety of projects. If you are interested in the back-end please visit [Back-end](https://github.com/oSoc17/smartflanders-backend)

## Installation
The Smart Flanders proof of concept is built with [Angular4](https://angular.io/).

### Dependencies
To install the dependencies make sure you have [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) installed.

#### 1. npm
```
$ npm install, this will install all the necessary dependencies. This can take a while, go get some coffee.
```

#### yarn
```
$ yarn install, same as npm install only the package manager is Yarn in this case. Same rules apply, go get some coffee.
```

### Run locally
Serve your app locally on port [4200](http://localhost:4200/) by using the following commands in the root directory.

#### npm
```
$ npm start
```

#### yarn
```
$ yarn start
```

#### angular-cli
If you have the [Angular CLI](https://cli.angular.io/) installed globally you can run the following command

```
$ ng serve
```

### Ready for distribution
To distribute the application, use one of the following commands in the root directory to generate a `dist` folder.

#### npm
```
$ npm build
```

#### yarn
```
$ yarn build
```

#### angular-cli
```
$ ng build
```

## Proof Of Concept

This proof of concept is build using a backend that generates linked data. This linked data is then passed to this PoC and used in the graphs. This is done using the Ldfetch library and the N3 library. We used chart.js 2 to generate the graphs. Feel free to explore the source code and leave somme comments in the issue section (make sure to use to comment label). The development of this PoC took 3 coders 2 weeks.  

