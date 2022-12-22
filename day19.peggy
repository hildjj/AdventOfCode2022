lines = (@line "\n")*

line = text head:num tail:(text @num)* text {
  return {
    name: head,
    costs: [
      [tail[0], 0, 0, 0],
      [tail[1], 0, 0, 0],
      [tail[2], tail[3], 0, 0],
      [tail[4], 0, tail[5], 0],
    ],
  }
}

text = [^0-9\n]+
num = n:$[0-9]+ { return parseInt(n, 10) }
