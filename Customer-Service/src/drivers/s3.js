const aws = require("aws-sdk");
const { AWS_SECRET_ACCESS_KEY, AWS_ACCESS_KEY_ID, AWS_BUCKET_REGION, AWS_BUCKET_NAME } = require("../config");
const { BadContentError } = require("../util/errors/app-errors");

const s3 = new aws.S3({
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
  region: AWS_BUCKET_REGION,
  params: {
    ACL: "public-read",
    Bucket: AWS_BUCKET_NAME,
  },
});

module.exports.GetAllS3Data = async (folderLink) => {
  const params = {
    Bucket: AWS_BUCKET_NAME,
    Prefix: folderLink,
  };

  try {
    const data = await s3.listObjectsV2(params).promise();

    if (!data.Contents) {
      return [];
    }

    const mediaItems = data.Contents.map((item) => ({
      Key: item.Key || "",
      LastModified: item.LastModified || new Date(),
      Size: item.Size || 0,
      Location: `https://${AWS_BUCKET_NAME}.s3.${AWS_BUCKET_REGION}.amazonaws.com/${item.Key}`,
    }));

    mediaItems.sort((a, b) => a.LastModified.getTime() - b.LastModified.getTime());

    return mediaItems;
  } catch (error) {
    throw new BadContentError("Failed to fetch media from S3");
  }
};
