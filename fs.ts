import assert from "assert";

/**
 * The entries in a a directory.
 */
export type Entry = Directory | File;

/**
 * If it quacks like a duck in a parsonage, it's a duckrectory.
 *
 * @param node - A thing that might be a directory?
 * @returns true if node is a Directory.
 */
export function isDirectory(node: any): node is Directory {
  return node instanceof Directory;
}

/**
 * A node has a sack of properties.
 * Note that contents only applies to File.
 */
interface NodeProperties {
  size: number;
  parent?: Directory;
  contents?: Buffer;
}

/**
 * Base class for Files and Directories.
 */
export class Node {
  /** The basename of the file */
  public name: string;

  /** The fully-qualified path */
  public path: string;

  /**
   * Interesting information about the node.
   */
  protected properties: NodeProperties;

  constructor(name: string, properties?: NodeProperties) {
    if (name === "..") {
      throw new Error(`Invalid node name: "${name}"`);
    }
    this.name = name;
    this.properties = {
      size: 0,
      ...properties,
    };
    if (this.size < 0) {
      throw new Error(`Invalid size: ${this.size}`);
    }
    if (this.parent) {
      if (!name.length) {
        throw new Error(`Invalid node name: "${name}"`);
      }
      if (this.parent.children[name]) {
        throw new Error(`File exists: "${this.parent.children[name]?.path}"`);
      }
      this.parent.children[name] = this;
      this.path = this.parent.path + this.name;
      if (isDirectory(this)) {
        this.path += "/";
      }
    } else {
      if (!isDirectory(this)) {
        throw new Error(`Only the top level directory can have an empty parent, "${this.name}"`);
      }
      this.path = "/";
    }
  }

  get size(): number {
    return this.properties.size;
  }

  set size(val: number) {
    this.properties.size = val;
  }

  get parent(): Directory | undefined {
    return this.properties.parent;
  }

  /** Delete this node, if it's still connected to the tree. */
  rm() {
    if (!this.parent) {
      throw new Error("Can't delete root");
    }
    delete this.parent.children[this.name];
    if (this.size > 0) {
      for (const d of this.parent.dirs()) {
        d.size -= this.size;
      }
    }
    // Unlinked
    this.properties.parent = undefined;
  }
}

/**
 * When visiting each node.
 */
export type NodeVisitor = (node: Node) => void;

/**
 * Directories contain Entries.
 */
export class Directory extends Node {
  children: Record<string, Node | undefined> = {};

  constructor(name: string, properties?: Partial<NodeProperties>) {
    const props = {
      size: 0,
      ...properties,
    };
    super(name, props);
    this.children[".."] = this.properties.parent;
  }

  /**
   * Create a file in this directory.
   *
   * @param name - The name of the directory
   * @param properties - Properties of the file.
   * @returns The new file.
   */
  createFile(name: string, properties?: Partial<NodeProperties>) {
    return new File(name, {
      ...properties,
      parent: this,
    });
  }

  /**
   * Create a subdirectory.
   *
   * @param name - Name of the subdirectory
   * @param properties - Properties of the subdirectory
   * @returns The new directory
   */
  createDirectory(name: string, properties?: Partial<NodeProperties>) {
    return new Directory(name, {
      ...properties,
      parent: this,
    });
  }

  * dirs(): Generator<Directory> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    for (let d: Directory | undefined = this; d; d = d.parent) {
      yield d;
    }
  }

  cd(name: string): Directory {
    let nm = name;
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let pwd: Directory = this;
    if (name.startsWith("/")) {
      const p = [...this.dirs()].at(-1);
      assert(p);
      pwd = p;
      nm = nm.slice(1);
    }

    for (const n of nm.split("/")) {
      if (n) {
        assert(pwd);
        const d = pwd.children[n];
        if (!isDirectory(d)) {
          throw new Error(`Invalid directory: "${pwd}"`);
        }
        pwd = d;
      }
    }
    return pwd;
  }

  visit(fn: NodeVisitor) {
    for (const [k, v] of Object.entries(this.children)) {
      if (k === "..") {
        continue;
      } else if (isDirectory(v)) {
        v.visit(fn);
      } else {
        assert(v, "Only .. can be undefined");
        fn(v);
      }
    }
    fn(this);
  }
}

/**
 * Files have optional contents and size.
 */
export class File extends Node {
  constructor(name: string, properties?: Partial<NodeProperties>) {
    const props = {
      size: 0,
      ...properties,
    };
    if (props.size === 0 && props.contents) {
      props.size = props.contents.length;
    }
    super(name, props);

    if (this.size > 0) {
      assert(this.parent); // Checked in super
      for (const d of this.parent.dirs()) {
        d.size += this.size;
      }
    }
  }

  get contents(): Buffer | undefined {
    return this.properties.contents;
  }
}

/**
 * Create the root of a file system.
 * @returns Directory with no name and no parent.
 */
export function root(): Directory {
  return new Directory("");
}
