// needed to be able to import svg files in typescript components
// https://webpack.js.org/guides/typescript/#importing-other-assets
declare module '*.svg' {
  const content: any;
  export default content;
}

declare module NodeJS {
  interface Global {
    fetch: jest.Mock;
  }
}

declare module jasmine {
  interface Spy {
    mockImplementation: any;
    mockRestore: any;
  }
}

declare let dataLayer: any;