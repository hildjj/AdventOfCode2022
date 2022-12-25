export default {
  timeout: "20s",
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
