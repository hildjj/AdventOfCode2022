lines = (@line "\n")*

line
  = command
  / file
  / dir

command = "$" " "+ bin:bin args:(" " @arg)* {
  return {
    type: "command",
    bin,
    args
  }
}

bin
  = "cd"
  / "ls"

file = size:number " "+ name:arg {
  return {
    type: "file",
    size,
    name
  }
}

dir = "dir" " "+ name:arg {
  return {
    type: "dir",
    name
  }
}

arg
  = $[^ \t\n]i+

number = n:$[0-9]+ { return parseInt(n, 10); }
