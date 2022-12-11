monkies = monkey*
monkey = monkey:number items:items op:op divisibleBy:test t:trueMonkey f:falseMonkey "\n"? {
  return {
    monkey,
    items,
    op,
    divisibleBy,
    t,
    f,
    count: 0,
  }
}

number = "Monkey " @num ":\n"
items = "  Starting items: " @nums "\n"
op = "  Operation: new = old " @operator " " @operand "\n"
operator
  = "+"
  / "*"

operand
  = num
  / "old"

test = "  Test: divisible by " @num "\n"
trueMonkey = "    If true: throw to monkey " @num "\n"
falseMonkey = "    If false: throw to monkey " @num "\n"

nums = head:num tail:(", " @num)* { return [head, ...tail] }
num = n:$[0-9]+ { return parseInt(n, 10) }
