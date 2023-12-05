import AWS from 'aws-sdk';

// Initialize AWS SDK with your credentials
AWS.config.update({
  /* accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, */
  region: process.env.AWS_REGION,
});

// Create an SNS instance
const sns = new AWS.SNS();

export async function publishToSNS(message) {
  try {
      // List SNS Topics
      const topics = await sns.listTopics().promise();
  
      // Assuming you want to use the first topic in the list
      const snsTopicArn = topics.Topics[0].TopicArn;

    const params = {
      Message: JSON.stringify(message),
      TopicArn: snsTopicArn, 
    };

    const result = await sns.publish(params).promise();
    console.log('Message published to SNS:', result);

    return result;
  } catch (error) {
    console.error('Error publishing to SNS:', error);
    throw error;
  }
}
