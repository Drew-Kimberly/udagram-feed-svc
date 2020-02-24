import * as AWS from 'aws-sdk';
import { config } from './config/config';

// Configure AWS
if (config.aws.aws_profile !== 'DEPLOYED') {
  AWS.config.credentials = new AWS.SharedIniFileCredentials({
    profile: config.aws.aws_profile
  });
}

export const s3 = new AWS.S3({
  signatureVersion: 'v4',
  region: config.aws.aws_region,
  params: { Bucket: config.aws.aws_media_bucket }
});

/* getGetSignedUrl generates an aws signed url to retreive an item
 * @Params
 *    key: string - the filename to be put into the s3 bucket
 * @Returns:
 *    a url as a string
 */
export function getGetSignedUrl(key: string): string {
  const signedUrlExpireSeconds = 60 * 5;

  return s3.getSignedUrl('getObject', {
    Bucket: config.aws.aws_media_bucket,
    Key: key,
    Expires: signedUrlExpireSeconds
  });
}

/* getPutSignedUrl generates an aws signed url to put an item
 * @Params
 *    key: string - the filename to be retreived from s3 bucket
 * @Returns:
 *    a url as a string
 */
export function getPutSignedUrl(key: string) {
  const signedUrlExpireSeconds = 60 * 5;

  return s3.getSignedUrl('putObject', {
    Bucket: config.aws.aws_media_bucket,
    Key: key,
    Expires: signedUrlExpireSeconds
  });
}
