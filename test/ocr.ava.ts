import { ocr, render } from "../ocr.js";
import test from "ava";

// Explicit spaces-as-"o" at EOL.
const ALPHA = `\
      ##  ###   ##  #### ####  ##  #  #  ###   ## #  # #     ##  ###  ###   ### #  # #    ####o
     #  # #  # #  # #    #    #  # #  #   #     # # #  #    #  # #  # #  # #    #  # #       #o
     #  # ###  #    ###  ###  #    ####   #     # ##   #    #  # #  # #  # #    #  #  # #   #oo
     #### #  # #    #    #    # ## #  #   #     # # #  #    #  # ###  ###   ##  #  #   #   #ooo
     #  # #  # #  # #    #    #  # #  #   #  #  # # #  #    #  # #    # #     # #  #   #  #oooo
     #  # ###   ##  #### #     ### #  #  ###  ##  #  # ####  ##  #    #  # ###   ##    #  ####o`
  .replaceAll("o", " ");

test("render", t => {
  const s = render(" ABCEFGHIJKLOPRSUYZ");
  t.is(s, ALPHA);
  const r = render("FOO", "@", ".");
  t.is(r, `\
@@@@..@@...@@..
@....@..@.@..@.
@@@..@..@.@..@.
@....@..@.@..@.
@....@..@.@..@.
@.....@@...@@..`);

  t.throws(() => render("\u{0}"));
});

test("ocr", t => {
  t.is(ocr(ALPHA), " ABCEFGHIJKLOPRSUYZ");
  t.is(ocr(ALPHA.split("\n")), " ABCEFGHIJKLOPRSUYZ");

  t.is(ocr(`\
@@@@..@@...@@.
@....@..@.@..@
@@@..@..@.@..@
@....@..@.@..@
@....@..@.@..@
@.....@@...@@.
`, "@", "."), "FOO");
  t.throws(() => ocr("#\n#\n#\n#\n#\n#"));
});
