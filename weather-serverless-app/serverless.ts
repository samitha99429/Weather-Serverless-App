import type { AWS } from '@serverless/typescript';

import { weather } from '@functions/index';

const serverlessConfiguration: AWS = {
  service: 'weather-serverless-app',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild','serverless-domain-manager'],
  provider: {
    name: 'aws',
    runtime: 'nodejs20.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      WEATHER_API_KEY:'0641f7d1bc6270c0bba27eee6a81b6c8',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
  },
  // import the function via paths
  functions: { weather },
  package: { individually: true },
  custom: {
     customDomain: {
      domainName: 'weather.samithasene.online',
      certificateName: '*.samithasene.online',
      createRoute53Record: true,
      endpointType: 'regional',
      securityPolicy: 'tls_1_2',
    },
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node20',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
