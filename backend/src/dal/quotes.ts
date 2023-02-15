import db from '../../prisma/client'

export const getRandomQuote = async () => {
  const res = await db.quotes.findMany({})
  const randomIndex = Math.round(Math.random() * (res.length - 1))
  return res[1]
}
