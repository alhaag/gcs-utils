'use strict'

/**
 * Module depedencies.
 *
 * @private
 */
const path = require('path')
const { Storage } = require('@google-cloud/storage')

/**
 * Module exports.
 *
 * @public
 */
module.exports = GCS

function GCS(keyFile, defaultBucket = 'my-bucket') {

  // TODO: verify keyFile exists

  const storage = new Storage({ keyFilename: keyFile })

  // https://cloud.google.com/storage/docs/locations
  this.MULTI_REGION_LOCATIONS = {
    ASIA: 'ASIA', // Data centers in Asia
    EU:   'EU',   // Data centers in the European Union
    US:   'US',   // Data centers in the United States
  }

  // https://cloud.google.com/storage/docs/storage-classes
  this.STORAGE_CLASS = {
    // Standard Storage is best for data that is frequently accessed ("hot" data) and/or stored for only brief periods of
    // time.
    STANDARD: 'STANDARD',
    // Nearline Storage is a low-cost, highly durable storage service for storing infrequently accessed data. Nearline
    // Storage is a better choice than Standard Storage in scenarios where slightly lower availability, a 30-day minimum
    // storage duration, and costs for data access are acceptable trade-offs for lowered at-rest storage costs.
    NEARLINE: 'NEARLINE',
    // Coldline Storage is a very-low-cost, highly durable storage service for storing infrequently accessed data.
    // Coldline Storage is a better choice than Standard Storage or Nearline Storage in scenarios where slightly lower
    // availability, a 90-day minimum storage duration, and higher costs for data access are acceptable trade-offs for
    // lowered at-rest storage costs.
    COLDLINE: 'COLDLINE',
    // Archive Storage is the lowest-cost, highly durable storage service for data archiving, online backup, and disaster
    // recovery. Unlike the "coldest" storage services offered by other Cloud providers, your data is available within
    // milliseconds, not hours or days
    ARCHIVE: 'ARCHIVE',
  }

  /**
   * Create a new bucket.
   *
   * @param {String} bucketName
   * @param {String} [location]
   * @return {Promise}
   */
  this.createBucket = (bucketName, location = MULTI_REGION_LOCATIONS.US, storageClass = STORAGE_CLASS.COLDLINE) => {
    // Creates a new bucket in the Asia region with the coldline default storage
    // class. Leave the second argument blank for default settings.
    return storage.createBucket(bucketName, { location, storageClass })
  }

  /**
   * Returns the public, anonymously accessable URL to a given Cloud Storage object.
   * The object's ACL has to be set to public read.
   *
   * @param {String} fileName
   * @param {String} [bucketName]
   * @return {String}
   */
  this.getPublicUrl = (fileName, bucketName = defaultBucket) => {
    return `https://storage.googleapis.com/${bucketName}/${fileName}`
  }

  /**
   * Returns signed URL for temporary access to the object.
   *
   * @param {String} fileName
   * @param {String} [bucketName]
   * @param {Number} [expiresMinutes] URL expiration time in minutes
   * @return {Promise.<string>}
   */
  this.getSignedUrl = (fileName, bucketName = defaultBucket, expiresMinutes = 15) => {
    const options = {
      version: 'v4',
      action: 'read',
      expires: Date.now() + expiresMinutes * 60 * 1000, // 15 minutes
    }
    return storage
      .bucket(bucketName)
      .file(fileName)
      .getSignedUrl(options)
  }

  /**
   * Upload file from local to a GCS bucket.
   * Uploaded file will be made publicly accessible.
   *
   * @param {string} localFilePath
   * @param {Object} [options]
   * @param {String} [bucketName]
   * @return {Promise.<string>} - The public URL of the uploaded file. Ex: https://storage.googleapis.com/bucket_name/image.jpg
   */
  this.uploadFile = (localFilePath, options, bucketName = defaultBucket) => {
    options = options || {
      // Support for HTTP requests made with `Accept-Encoding: gzip`
      gzip: true,
      // destination: Directory struct
      // authenticatedRead: O proprietário do objeto obtém acesso `OWNER` e` allAuthenticatedUsers` obtém acesso `READER`.
      // bucketOwnerFullControl: o proprietário do objeto obtém acesso `OWNER` e os proprietários da equipe do projeto obtêm acesso` OWNER`.
      // bucketOwnerRead: o proprietário do objeto obtém acesso `PROPRIETÁRIO` e os proprietários da equipe do projeto obtêm acesso` READER`
      // privado: o proprietário do objeto obtém acesso ao `PROPRIETÁRIO`.
      // projectPrivate: o proprietário do objeto obtém acesso `PROPRIETÁRIO` e os membros da equipe do projeto obtêm acesso de acordo com suas funções.
      // publicRead: O proprietário do objeto obtém acesso `OWNER` e` allUsers` obtém acesso `READER`.
    }
    console.log(`uploadFile: localFilePath=${localFilePath}, options=${JSON.stringify(options)}`)

    const fileName = ('destination' in options)
      ? options.destination
      : path.basename(localFilePath)

    return storage
      .bucket(bucketName)
      .upload(localFilePath, options)
      // .then(() => file.makePublic())
      .then(() => this.getPublicUrl(fileName, bucketName))
  }

  /**
   * Download file from GCS bucket to a local disk
   *
   * @param {String} destFilename
   * @param {String} [bucketName]
   * @return {Promise}
   */
  this.downloadFile = (fileName, destFilename, bucketName = defaultBucket) => {
    const options = {
      // The path to which the file should be downloaded, e.g. "./file.txt"
      destination: destFilename,
    }
    // Downloads the file to disk
    return storage
      .bucket(bucketName)
      .file(fileName)
      .download(options)
  }

  /**
   * Delete file from GCS.
   *
   * @param {String} fileName
   * @param {String} [bucketName]
   * @return {Promise}
   */
  this.deleteFile = (fileName, bucketName = defaultBucket) => {
    return storage
      .bucket(bucketName)
      .file(fileName)
      .delete()
  }

  /**
   * Get metadata of file from GCS bucket.
   *
   * @param {String} fileName
   * @param {String} [bucketName]
   * @return {Promise}
   */
  this.getMetadata = (fileName, bucketName = defaultBucket) => {
    return storage
      .bucket(bucketName)
      .file(fileName)
      .getMetadata()
  }
}
