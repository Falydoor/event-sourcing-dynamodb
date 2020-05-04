#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { EventSourcingDynamodbStack } from '../lib/event-sourcing-dynamodb-stack';

const app = new cdk.App();
new EventSourcingDynamodbStack(app, 'EventSourcingDynamodbStack');
