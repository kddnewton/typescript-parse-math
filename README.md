# `typescript-parse-math`

This is a math parser that handles various arithmetic operations using only TypeScript types. Absolutely monstrous. Definitely don't use it.

```ts
import type { ParseMath } from "typescript-parse-math";

type Result1 = ParseMath<"5 - 3 * 2 + 3">;
// type Result1 = 2

type Result2 = ParseMath<"1 + 2 * 3">;
// type Result2 = 7

type Result3 = ParseMath<"10 + 2">;
// type Result3 = 12
```

## Related

* [jamiebuilds/json-parser-in-typescript-very-bad-idea-please-dont-use](https://github.com/jamiebuilds/json-parser-in-typescript-very-bad-idea-please-dont-use).
* [romani/meta-typing](https://github.com/ronami/meta-typing)
* [microsoft/TypeScript#14833](https://github.com/microsoft/TypeScript/issues/14833)
