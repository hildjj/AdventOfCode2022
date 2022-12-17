export default class StringBitSet {
  static strings: Record<string, bigint> = {};

  static names: string[] = [];

  static count = 0n;

  bits = 0n;

  constructor(n = 0n) {
    this.bits = n;
  }

  static getMask(bit: string): bigint {
    let n = this.strings[bit];
    if (n === undefined) {
      n = StringBitSet.count++;
      StringBitSet.strings[bit] = n;
      StringBitSet.names[Number(n)] = bit;
    }
    return 1n << n;
  }

  get size() {
    let b = this.bits;
    let count = 0;
    while (b !== 0n) {
      if ((b & 1n) === 1n) {
        count++;
      }
      b >>= 1n;
    }
    return count;
  }

  add(bit: string): StringBitSet {
    return new StringBitSet(this.bits | StringBitSet.getMask(bit));
  }

  delete(bit: string): StringBitSet {
    return new StringBitSet(this.bits & ~StringBitSet.getMask(bit));
  }

  has(bit: string): boolean {
    const mask = StringBitSet.getMask(bit);
    return (this.bits & mask) === mask;
  }

  toString() {
    return this.bits.toString();
  }

  [Symbol.for("nodejs.util.inspect.custom")]() {
    return [...this].join(",");
  }

  * [Symbol.iterator]() {
    let b = this.bits;
    let c = 0;
    while (b !== 0n) {
      if ((b & 1n) === 1n) {
        yield StringBitSet.names[c];
      }
      c++;
      b >>= 1n;
    }
  }
}
