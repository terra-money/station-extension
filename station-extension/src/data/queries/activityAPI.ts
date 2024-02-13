import { useQuery } from "react-query"

const url =
  "https://te82h0srb4.execute-api.us-east-1.amazonaws.com/v1/txs/transactions"

export interface PaginationItem {
  words_address: string
  current_offset: number
  total_documents: number
}

interface ResponseData {
  response: ActivityItem[]
  pagination: PaginationItem[]
}

interface RequestBody {
  addresses: string[]
  pagination?: PaginationItem[]
}

const fetchData = async (requestBody: RequestBody) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify(requestBody),
  })

  if (!response.ok) {
    throw new Error("Failed to fetch data")
  }

  return response.json()
}

export const useTxActivity = (requestBody: RequestBody) => {
  const queryKey = ["txActivity", JSON.stringify(requestBody)]
  return useQuery<ResponseData>(queryKey, () => fetchData(requestBody))
}
