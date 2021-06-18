import express from 'express'
import fetch from 'node-fetch'

const app = express()

app.use(express.json())

app.post('/verify', async (req, res) => {
  try {
    const { token } = req.body

    if (!token) {
      return res.status(400).send({
        success: false,
        message: 'Invalid token',
      })
    }

    const searchParams = new URLSearchParams({
      secret: process.env.HCAPTCHA_SERVER_KEY,
      response: token,
    })

    const response = await fetch(
      `https://hcaptcha.com/siteverify?${searchParams.toString()}`,
      { method: 'POST' }
    )

    const { success } = await response.json()

    res.status(200).send({ success })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error)

    res.status(500).send({
      success: false,
      message: 'Internal error',
    })
  }
})

export default app
