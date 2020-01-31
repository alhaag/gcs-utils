
const GCS = require('../')

const gcs = new GCS('./data/gcs-key.json', 'default-bucket-name')

async function main() {
  // CREATE BUCKET
  // const [bucket] = await gcs.createBucket('bucket-teste', gcs.MULTI_REGION_LOCATIONS.US, gsc.STORAGE_CLASS.COLDLINE)
  // console.log('bucket: ', bucket)

  // UPLOAD
  // ---------------------------------------------------------------------------
  // const result = await gcs.uploadFile('./data/image.jpg')
  // console.log('result: ', result)

  // UPLOAD WITH DIR PATH
  // ---------------------------------------------------------------------------
  // const result1 = await gcs.uploadFile('./data/image.jpg', {destination: 'subdir/teste.jpg'})
  // console.log('result: ', result1)

  // const result2 = await gcs.uploadFile('./data/text.txt', {destination: 'subdir/text.txt'})
  // console.log('result: ', result2)

  // DOWNLOAD
  // ---------------------------------------------------------------------------
  // const result = await gcs.downloadFile('image.jpg', './data/download.jpg')
  // console.log('result: ', result)

  // GET METADATA
  // ---------------------------------------------------------------------------
  // const [metadata] = await gcs.getMetadata('image.jpg').catch(error => {
  //   // No such object: bucket-name/toolba.jpeg
  //   console.log(error.message)
  // })
  // console.log('result: ', metadata)
  // result: {
  //   kind: 'storage#object',
  //   id: 'bucket-name/image.jpg/1580340540276655',
  //   selfLink: 'https://www.googleapis.com/storage/v1/b/bucket-name/o/image.jpg',
  //   mediaLink: 'https://storage.googleapis.com/download/storage/v1/b/bucket-name/o/image.jpg?generation=1580340540276655&alt=media',
  //   name: 'image.jpg',
  //   bucket: 'bucket-name',
  //   generation: '1580340540276655',
  //   metageneration: '1',
  //   contentType: 'image/jpeg',
  //   storageClass: 'NEARLINE',
  //   size: '29912',
  //   md5Hash: 'BpSDLxXdqhK0PY4myXVvNA==',
  //   crc32c: 'yv+6Uw==',
  //   etag: 'CK//m6T7qecCEAE=',
  //   timeCreated: '2020-01-29T23:29:00.276Z',
  //   updated: '2020-01-29T23:29:00.276Z',
  //   timeStorageClassUpdated: '2020-01-29T23:29:00.276Z'
  // }

  // DELETE
  // ---------------------------------------------------------------------------
  // await gcs.deleteFile('image.jpg').catch(error => {
  //   // No such object: bucket-name/image.jpeg
  //   console.log(error.message)
  // })
}

main()