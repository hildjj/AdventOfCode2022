lines = r:(@line "\n")* { return r.slice(1, -1) }

line = s:$[.#<>v^]+ { return s.slice(1, -1) }
