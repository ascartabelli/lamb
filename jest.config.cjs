module.exports = {
    clearMocks: false,
    resetMocks: false,
    restoreMocks: false,
    coverageDirectory: "coverage",
    coverageThreshold: {
        global: {
            branches: 100,
            functions: 100,
            lines: 100,
            statements: 100
        }
    },
    collectCoverageFrom: ["src/**/*.js", "!**/{__tests__,__mocks__}/**"],
    rootDir: ".",
    testRegex: "(/__tests__/.+\\.(test|spec))\\.js$",
    testURL: "http://localhost:3000/",
    verbose: false
};
