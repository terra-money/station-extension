export const warn = (...data: any[]) => {
  if ("development" === process.env.NODE_ENV) {
    console.warn(...data)
  }
}
