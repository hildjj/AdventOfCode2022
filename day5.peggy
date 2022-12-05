plan = hdr:header cols:columns "\n" moves:moves {
  // Rotate
  const stacks = Array.from(new Array(cols.length), () => []);
  for (const boxline of hdr) {
    boxline.forEach((entry, count) => {
      if (entry != " ") {
        stacks[count].push(entry);
      }
    });
  }
  return {
    stacks,
    moves
  }
}

header = boxline+
boxline = head:entry tail:(" " @entry)+ "\n" { return [head, ...tail] }

entry = crate / space
crate = "[" @[A-Z] "]"
space = "   " { return " " }

columns = head:col tail:(" " @col)+ "\n" { return [head, ...tail] }
col = " " @number " "

moves = move+
move = "move " @number " from " @number " to " @number "\n"

number = n:$[0-9]+ { return parseInt(n, 10); }
