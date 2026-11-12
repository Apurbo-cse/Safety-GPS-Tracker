// sanitize-html pulls in a few packages that are published as ES modules only; Jest must compile them to run them.
const ESM = "htmlparser2|domhandler|domutils|domelementtype|dom-serializer|entities|parse-srcset|postcss|nanoid|picocolors|source-map-js|is-plain-object|deepmerge";
module.exports = {
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: "src",
  testRegex: ".*\\.spec\\.ts$",
  transform: {
    "^.+\\.ts$": ["ts-jest", { tsconfig: "<rootDir>/../tsconfig.json", diagnostics: { ignoreCodes: [151002] } }],
    [`node_modules/(${ESM})/.+\\.js$`]: ["ts-jest", { tsconfig: { allowJs: true, module: "commonjs", target: "ES2022", esModuleInterop: true }, diagnostics: false }],
  },
  transformIgnorePatterns: [`node_modules/(?!(${ESM})/)`],
  testEnvironment: "node",
};
