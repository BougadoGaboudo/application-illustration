module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\\.jsx?$": ["babel-jest", { configFile: "./.babelrc.test.js" }],
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  transformIgnorePatterns: ["/node_modules/"],
};
