
module.exports = {
  rootDir: '..',
  setupTestFrameworkScriptFile: '<rootDir>/.config/jest/setupTests.js',
  transform: {
    '.(ts|tsx)': '<rootDir>/node_modules/ts-jest/preprocessor.js',
  },
  setupFiles: [
    '<rootDir>/.config/jest/rAF.js',
  ],
  testRegex: '\\.spec\\.(ts|tsx|js)$',
  testPathIgnorePatterns: [
    'node_modules',
    'yeoman',
  ],
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
  ],
  moduleNameMapper: {
    // Special file types
    '\\.(jpg|jpeg|png|gif|svg|ttf|woff|woff2)$': '<rootDir>/__mocks__/emptyMock.js',
    '\\.(s?css)$': 'identity-obj-proxy',

    // Root directories
    '^app(.*)$': '<rootDir>/src/app$1',
    '^models(.*)$': '<rootDir>/src/models$1',
    '^server(.*)$': '<rootDir>/src/server$1',
    '^shared(.*)$': '<rootDir>/src/shared$1',

    // App locations
    '^components(.*)$': '<rootDir>/src/app/components$1',
    '^containers(.*)$': '<rootDir>/src/app/containers$1',
    '^redux-store(.*)$': '<rootDir>/src/app/redux-store$1',
    '^actions(.*)$': '<rootDir>/src/app/redux-store/actions$1',
    '^thunks(.*)$': '<rootDir>/src/app/redux-store/thunks$1',
    '^state(.*)$': '<rootDir>/src/app/state$1',
    '^appConfig$': '<rootDir>/src/app/appConfig',

    // Server locations
    '^api(.*)$': '<rootDir>/src/server/api$1',
    '^services(.*)$': '<rootDir>/src/server/services$1',
  },
  globals: {
    'ts-jest': {
      tsConfigFile: './.config/tsconfig.test.json',
    },
  },
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/index.{ts,tsx}',
    "!src/**/*.d.ts",
    '!src/**/__mocks__/*.{ts,tsx}',
    '!src/**/*.{spec,story}.{ts,tsx}',
    '!src/app/components/Ionic/**/*.{ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 1,
      functions: 1,
      lines: 1,
      statements: 1,
    }
  }
}
