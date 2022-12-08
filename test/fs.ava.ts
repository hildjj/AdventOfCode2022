import * as fs from "../fs.js";
import test from "ava";

test("create dir", t => {
  const FS = fs.root();
  t.truthy(FS);
  t.is(FS.name, "");
  t.is(FS.path, "/");

  t.throws(() => new fs.Directory(".."));
  t.throws(() => FS.createFile(""));
  t.throws(() => FS.createDirectory(""));
});

test("create file", t => {
  const FS = fs.root();
  t.throws(() => FS.createFile("foo", { size: -1 }));
  const foo = FS.createFile("foo", { contents: Buffer.from("bar") });
  t.is(foo.contents?.toString(), "bar");
  t.is(foo.size, 3);
  t.throws(() => FS.createFile("foo"));
  t.throws(() => new fs.File("bar"));
});

test("directory", t => {
  const FS = fs.root();
  const d = FS.createDirectory("foo");
  t.is(FS.cd("foo"), d);
  t.throws(() => FS.cd("nope"));
  t.throws(() => FS.cd(".."));

  const deep = d.createDirectory("deeper");
  t.is(deep.cd("/"), FS);
  t.is(deep.cd("/foo"), d);
  t.is(deep.cd("/foo/"), d);
  t.is(deep.cd("../.."), FS);
  t.is(deep.cd("../../"), FS);

  d.rm();
  t.throws(() => d.rm()); // Second one fails.
  const f = FS.createFile("bar", { size: 12 });
  t.is(FS.size, 12);
  f.rm();
  t.is(FS.size, 0);
  t.is(Object.keys(FS.children).length, 1);
});
