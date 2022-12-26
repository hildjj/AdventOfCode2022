export default {
  timeout: "20m",
  files: [
    "test/*.ava.ts",
  ],
  extensions: {
    ts: "module",
  },
  nodeArguments: [
    "--loader=ts-node/esm",
  ],
};
