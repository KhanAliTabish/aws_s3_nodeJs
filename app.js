const express = require('express')
const BucketOps = require('./aws/upload_dowmload')

const app = express()
const port = 4000

app.use(express.json())

app.post('/create_bucket', (req, res) => {
    const { bucketName } = req.query
    if(!bucketName) return res.status(404).send({ error: 'Please provide a Bucket Name!' })
    BucketOps.s3CreateBucket(bucketName, res)
})
app.post('/upload', (req, res) => {
    const { fileName } = req.query
    if(!fileName) return res.status(404).send({ error: 'Please provide a File Name!' })
    BucketOps.s3Upload(fileName, res)
})
app.get('/download', (req, res) => {
    const { fileName } = req.query
    if(!fileName) return res.status(404).send({ error: 'Please provide a File Name!' })
    BucketOps.s3Download(fileName, res)
})
app.listen(port, () => {
    console.log(`Magic happens at port ${port}.`)
})