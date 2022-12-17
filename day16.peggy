lines = valves:(@line "\n")* {
  return Object.fromEntries(valves.map(v => [v.name, v]));
}

line = "Valve " name:valve " has flow rate=" flow:num
  "; tunnel" "s"? " lead" "s"? " to valve" "s"? " " outputs:valve_list {
    return { name, flow, outputs }
  }

valve_list = head:valve tail:(", " @valve)* { return [head, ...tail] }
valve = $([A-Z][A-Z])
num = n:$[0-9]+ { return parseInt(n, 10) }
