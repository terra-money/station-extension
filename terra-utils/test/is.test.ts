import { isDenom, isDenomTerra } from "../src/is"

test("isDenomTerra", () => {
  expect(isDenomTerra("uusd")).toBeTruthy()
  expect(isDenomTerra("uluna")).toBeFalsy()
})

test("isDenom", () => {
  expect(isDenom("uusd")).toBeTruthy()
  expect(isDenom("uluna")).toBeTruthy()
  expect(isDenom("ncheq")).toBeTruthy()
})
