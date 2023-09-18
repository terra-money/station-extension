import { atom, useRecoilState } from "recoil"
import { getLocalSetting, setLocalSetting } from "utils/localStorage"
import { SettingKey } from "utils/localStorage"

const addressBookListState = atom({
  key: "addressBookList",
  default: getLocalSetting<AddressBook[]>(SettingKey.AddressBook),
})

export const useAddressBook = () => {
  const [list, setList] = useRecoilState(addressBookListState)

  const walletExists = (name: string) => list.some((item) => item.name === name)

  const updateList = (list: AddressBook[]) => {
    setList(list)
    setLocalSetting(SettingKey.AddressBook, list)
  }

  const add = (newItem: AddressBook) => {
    const name = newItem.name.trim()
    if (walletExists(name)) throw new Error("Already exists")
    updateList([...list, { ...newItem, name }])
  }

  const edit = (newItem: AddressBook, index: number) => {
    const name = newItem.name.trim()
    const newList = [...list]
    newList[index] = { ...newItem, name }
    updateList(newList)
  }

  const remove = (index: number) => {
    const newList = [...list]
    newList.splice(index, 1)
    updateList(newList)
  }

  return { list, add, remove, edit, walletExists }
}
