import { MsgSend } from "@terra-money/feather.js"

const id = Date.now()
const address = "terra1x46rqay4d3cssq8gxxvqz8xt6nwlz4td20k38v"
const memo =
  "Loremipsumdolorsitamet,consecteturadipisicingelit,seddoeiusmodtemporincididuntutlaboreetdoloremagnaaliqua.Utenimadminimveniam,quisnostrudexercitationullamcolaborisnisiutaliquipexeacommodoconsequat.Duisauteiruredolorinreprehenderitinvoluptatevelitessecillumdoloreeufugiatnullapariatur.Excepteursintoccaecatcupidatatnonproident,suntinculpaquiofficiadeseruntmollitanimidestlaborum."

const SampleTxRequest = {
  id,
  timestamp: new Date(id),
  origin: "https://station.money",
  requestType: "post" as const,
  tx: {
    msgs: [new MsgSend(address, address, "1uusd")],
    memo,
    chainID: "phoenix-1",
  },
}

export default SampleTxRequest
