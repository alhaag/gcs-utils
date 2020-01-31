# gcs-utils (Google Cloud Storage)

Utility class for easy integration with Google Cloud Storage API for File Storage and Retrieval.

Underneath uses the official **@google-cloud/storage** library. If you need all the features consider using the official library.

## Available features

- [X] Create Bucket
- [X] Upload file
- [X] Download file
- [X] Delete file
- [X] Get metadata

## Usage

Install:

```shell
$ npm install gcs-utils --save
```

or

```shell
$ yarn add gcs-utils
```

Instance and use:

Create private key and store it in a safe place. See more in https://cloud.google.com/iam/docs/creating-managing-service-account-keys

```javascript
const GCS = require('gcs-utils')

const gcs = new GCS('./data/gc-key.json', 'default-bucket-name')

const result = await gcs.uploadFile('./data/image.jpg')
console.log('result: ', result)
```

See more in **examples**
