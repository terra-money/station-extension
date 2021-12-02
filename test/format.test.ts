import { readAmount, readDenom, readPercent, toAmount } from "../src/format"

test("readAmount", () => {
  expect(readAmount("1234567890")).toBe("1234.56789")
  expect(readAmount("1234567890", { decimals: 7 })).toBe("123.456789")
  expect(readAmount("1234567890", { decimals: 0 })).toBe("1234567890")
  expect(readAmount("1234567890", { fixed: 6 })).toBe("1234.567890")
  expect(readAmount("1234567890", { fixed: false })).toBe("1234.56789")
  expect(readAmount("1234567890", { comma: true })).toBe("1,234.56789")
  expect(readAmount("1234567890", { comma: false })).toBe("1234.56789")
  expect(readAmount("1234567890", { integer: true })).toBe("1234")
  expect(readAmount("1234567890", { integer: false })).toBe("1234.56789")
  expect(readAmount("1234567890", { prefix: true })).toBe("1.23K")
  expect(readAmount("1234567890", { prefix: true, integer: true })).toBe("1K")
  expect(readAmount("1234567890", { prefix: false })).toBe("1234.56789")
  expect(readAmount("1234567890", { comma: true, fixed: 2 })).toBe("1,234.56")
  expect(readAmount("1", { decimals: 7 })).toBe("0.0000001")
  expect(readAmount("0", { decimals: undefined })).toBe("0")
  expect(readAmount("")).toBe("0")
  expect(readAmount("NaN")).toBe("0")
  expect(readAmount()).toBe("0")
})

test("toAmount", () => {
  expect(toAmount("1234.56789")).toBe("1234567890")
  expect(toAmount("1234", { decimals: 0 })).toBe("1234")
  expect(toAmount("")).toBe("0")
  expect(toAmount("NaN")).toBe("0")
  expect(toAmount()).toBe("0")
})

test("readDenom", () => {
  expect(readDenom("uluna")).toBe("Luna")
  expect(readDenom("uusd")).toBe("UST")
  expect(readDenom("uatom")).toBe("ATOM")
})

test("readPercent", () => {
  expect(readPercent("1.23")).toBe("123.00%")
  expect(readPercent("1.23", { fixed: 3 })).toBe("123.000%")
  expect(readPercent("")).toBe("0%")
  expect(readPercent("NaN")).toBe("0%")
  expect(readPercent()).toBe("0%")
})
