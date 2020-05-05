#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { EventSourcingDynamodbStack } from '../lib/event-sourcing-dynamodb-stack';

const app = new cdk.App();
const stack = new EventSourcingDynamodbStack(app, 'EventSourcingDynamodbStack');
cdk.Tag.add(stack, 'ippon:owner', 'tlebrun');