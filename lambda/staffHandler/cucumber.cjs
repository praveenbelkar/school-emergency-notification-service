/* eslint-disable no-undef */
module.exports = {
  default: {
    requireModule: ["ts-node/register"],
    import: ["test/cucumber.conf.ts", "test/features/**/*.ts"],
    paths: ["test/features/**/*.feature"],
    format: ["progress", "html:cucumber-report.html", "json:cucumber-report.json"],
    failFast: true,
    worldParameters: {
      apiUrl: process.env.API_ENDPOINT,
    },
  },
};
