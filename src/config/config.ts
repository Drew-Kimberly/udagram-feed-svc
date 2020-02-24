export const config = {
  db: {
    username: process.env.UDAGRAM_DB_USER,
    password: process.env.UDAGRAM_DB_PASSWORD,
    database: process.env.UDAGRAM_DB_NAME,
    host: process.env.UDAGRAM_DB_HOST,
    dialect: process.env.UDAGRAM_DB_DIALECT
  },
  aws: {
    aws_region: process.env.UDAGRAM_AWS_REGION,
    aws_profile: process.env.UDAGRAM_AWS_PROFILE,
    aws_media_bucket: process.env.UDAGRAM_S3_BUCKET
  },
  jwt: {
    secret: process.env.UDAGRAM_JWT_KEY
  }
};
