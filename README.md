## Usage

### Format

```ts
import { readAmount, readDenom, readPercent, toAmount } from "@terra.kitchen/utils"

readAmount("1234567890") // "1234.56789"
readAmount("1234567890", { decimals: 0 }) // "1234567890"
readAmount("1234567890", { fixed: 6 }) // "1234.567890"
readAmount("1234567890", { comma: true }) // "1,234.56789"
readAmount("1234567890", { integer: true }) // "1234"
readAmount("1234567890", { prefix: true }) // "1.23K"

toAmount("1234.56789") // "1234567890"
toAmount("1234", { decimals: 0 }) // "1234"

readDenom("uluna") // "Luna"
readDenom("uusd") // "UST"

readPercent("1.23") // "123.00%"
readPercent("1.23", { fixed: 3 }) // "123.000%"
```

### Is

```ts
import { isDenom, isDenomTerra } from "@terra.kitchen/utils"

isDenomTerra("uusd") // true
isDenomTerra("uluna") // false

isDenom("uusd") // true
isDenom("uluna") // true
```

### Text

```ts
import { truncate } from "@terra.kitchen/utils"

truncate("terra1x46rqay4d3cssq8gxxvqz8xt6nwlz4td20k38v") // "terra1...20k38v"
truncate("terra1x46rqay4d3cssq8gxxvqz8xt6nwlz4td20k38v", [6, 3]) // "terra1...38v"
```
