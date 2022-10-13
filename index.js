import express from 'express'
import path from 'path'
import Sib from 'sib-api-v3-sdk'
import dotenv from 'dotenv'
import { maxHeaderSize } from 'http'

dotenv.config()

const app = express()

app.use(express.json())

app.use(express.static('app'))

const client = Sib.ApiClient.instance
const apiKey = client.authentications['api-key']
apiKey.apiKey = process.env.APYKEY

const tranEmailApi = new Sib.TransactionalEmailsApi()

// tranEmailApi
//     .sendTransacEmail({
//         sender,
//         to: receivers,
//         subject: 'Subscribe to Cules Coding to become a developer',
//         textContent: `
//         Cules Coding will teach you how to become {{params.role}} a developer.
//         `,
//         htmlContent: `
//         <h1>Cules Coding</h1>
//         <a href="https://cules-coding.vercel.app/">Visit</a>
//                 `,
//         params: {
//             role: 'Frontend',
//         },
//     })
//     .then(console.log)
//     .catch(console.log)

app.get('/', (req, res) => {
    res.sendFile(`${path.resolve()}/index.html`)
})

app.post('/send', async (req, res) => {
    const { to, subject, html } = req.body

    const msg = {
        to: [
            {
                email: to
            }
        ],
        sender:{
            email: process.env.FROM,
            name: process.env.NAME,
        } ,
        subject,
        html
    }

    try {
        tranEmailApi.sendTransacEmail({
            sender: msg.sender,
            to: msg.to,
            subject: msg.subject,
            htmlContent: msg.html,
            })
        res.sendStatus(204)
    } catch (e) {
        const messages = e.response.body.errors.map(e => e.message).join(' ')
        res.status(400).send(messages)
    }
})

app.listen(3000, () => console.log('la app está corriendo'))