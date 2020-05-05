import * as cdk from '@aws-cdk/core';
import * as sqs from '@aws-cdk/aws-sqs';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as lambda from '@aws-cdk/aws-lambda';
import { SqsEventSource } from '@aws-cdk/aws-lambda-event-sources';

export class EventSourcingDynamodbStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create queue
    const queue = new sqs.Queue(this, 'queue', {
      queueName: 'event-queue'
    });

    // Create lambda
    const fn = new lambda.Function(this, 'fn', {
      code: new lambda.AssetCode('resources'),
      handler: 'lambda.handler',
      runtime: lambda.Runtime.NODEJS_12_X,
      functionName: 'event-to-dynamodb'
    });

    // Add lambda source
    fn.addEventSource(new SqsEventSource(queue));

    // Create dynamodb table
    const sortKey = { name: 'Timestamp', type: dynamodb.AttributeType.STRING };
    const table = new dynamodb.Table(this, 'table', {
      partitionKey: { name: 'RequestId', type: dynamodb.AttributeType.STRING },
      sortKey: sortKey,
      tableName: 'event'
    });

    // Create GSI
    table.addGlobalSecondaryIndex({
      indexName: 'Type-Index',
      partitionKey: { name: 'Type', type: dynamodb.AttributeType.STRING },
      sortKey: sortKey
    });
    table.addGlobalSecondaryIndex({
      indexName: 'Source-Index',
      partitionKey: { name: 'Source', type: dynamodb.AttributeType.STRING },
      sortKey: sortKey
    });

    // Grant write to lambda
    table.grantWriteData(fn);
  }
}
