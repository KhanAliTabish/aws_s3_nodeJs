const AWS = require('aws-sdk')
const config = require('../config')
const fs = require('fs')
const xlsx = require('xlsx')

const s3 = new AWS.S3({
    accessKeyId: config.AWSAccessKeyId,
    secretAccessKey: config.AWSSecretKey
})

const s3CreateBucket = (bucketName, res) => {
    
    const params = {
        Bucket: bucketName,
        CreateBucketConfiguration: {
            LocationConstraint: "ap-south-1"
        }
    }
    s3.createBucket(params, function(err, data) {
        if (err){
            res.status(400).send({ error: `Bucket Creation Unsuccessfull !! ${err}`})
        }else {
            res.status(200).send({ success: `Bucket Creation Successfull !! ${data}` })
        }
    });
}
const s3Upload = (filename, res) => {
    const fileData = fs.readFileSync(filename)
    const params = {
        Bucket: config.AWSBucketName,
        Key: 'sample.xlsx',
        Body: fileData,
        ContentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    };

    // Uploading files to the bucket
    s3.upload(params, function(err, data) {
        if (err){
            res.status(400).send({ error: `File Upload Unsuccessfull !! ${err}`})
        }else {
            res.status(200).send({ success: `File Upload Successfull !! ${data}` })
        }
    });

}

const s3Download = (fileName, res) => {
    const params = {
        Bucket: config.AWSBucketName,
        Key: fileName
    };

    const file = s3.getObject(params).createReadStream();
    const buffers = [];

    file.on('data', data => {
        buffers.push(data);
    });

    file.on('end',  () => {
        const buffer = Buffer.concat(buffers);
        const workbook = xlsx.read(buffer);
        const wbout = xlsx.write(workbook, { bookType: 'xlsx', type: 'buffer'});
        fs.writeFileSync('./downloaded_sample.xlsx', wbout)
        res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.status(200).send({message : 'Success', data: workbook})
    });

    file.on('error', (error) => {
        res.status(400).send({ error: `File download failed - ${error}`})
    });
}


module.exports = {
    s3CreateBucket,
    s3Upload,
    s3Download
}
