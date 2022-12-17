import StringBitSet from "../stringBitSet.js";
import test from "ava";
import util from "util";

test("create", t => {
  const s = new StringBitSet(0n);
  t.is(s.bits, 0n);
  t.is(s.toString(), "0");
  t.is(util.inspect(s), "");
  const r = s.add("foo");
  t.is(r.toString(), "1");
  t.is(util.inspect(r), "foo");
  t.is(r.add("foo").bits, 1n);
  t.is(util.inspect(r.add("foo")), "foo");
  t.false(r.has("bar"));
  t.true(r.has("foo"));
  const baz = r.add("baz");
  t.is(util.inspect(baz), "foo,baz");
  t.is(baz.size, 2);
  const dbaz = baz.delete("foo");
  t.is(dbaz.size, 1);
});
