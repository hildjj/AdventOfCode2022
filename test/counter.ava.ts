import Counter from "../counter.js";
import test from "ava";

test("count", t => {
  const c = new Counter();
  t.deepEqual(c.max(), null);
  t.is(c.size(), 0);

  c.add(1, 2);
  c.add(1, 2);
  c.add(3, 4);
  c.sum(-5, 3, 4);
  c.sum(-6, 3, 5);
  t.is(c.total(), 3);
  t.is(c.total(p => p > 1), 1);
  t.is(c.total(p => p), -8);
  let count = 0;
  for (const [_, p] of c) {
    count += p;
  }
  t.is(count, -8);
  t.deepEqual(c.max(), ["1,2", 2]);
  t.is(c.size(), 3);
});
