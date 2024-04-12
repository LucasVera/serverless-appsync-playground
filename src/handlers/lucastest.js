const { DynamoDBClient, GetItemCommand, PutItemCommand, TransactWriteItemsCommand } = require('@aws-sdk/client-dynamodb');
const { inspect } = require('util');
// const { v4: uuid } = require('uuid');
// const mysql = require('mysql2');

// const connection = mysql.createConnection({
//   host: 'lucastest.chaqnkbx5a5f.us-east-1.rds.amazonaws.com',
//   user: 'lucastest',
//   database: 'lucastest',
//   password: 'h1z190831168g1',
//   port: 3306,
// });

const fetchData = () => new Promise((resolve, reject) => {
  // connection.query('SELECT * FROM lucastest1', function (err, results, fields) {
  //   if (err) {
  //     console.log(err);
  //     reject(err);
  //     return;
  //   }
  //   console.log('results', results);
  //   console.log('fields', fields);
  //   resolve(results);
  // });
});

const client = new DynamoDBClient({ region: 'us-east-1' });

module.exports.handler = async (event, context) => {
  console.log('event', inspect(event, false, 8));
  const getItemsParams = {
    TableName: 'testTable',
    Key: {
      'id': { S: '1' },
    },
  };

  const getItemCommand = new GetItemCommand(getItemsParams);
  const result = await client.send(getItemCommand);
  console.log('get item result', result);


  const putItemParams = {
    TableName: 'deleteme',
    Item: {
      'id': { S: '1' },
      'name': { S: 'lucas' },
    },
  };

  const putItemCommand = new PutItemCommand(putItemParams);
  const putItemResult = await client.send(putItemCommand);
  console.log('put item result', putItemResult);


  const transactWriteItemsParams = {
    TransactItems: [
      {
        UpdateItem: {
          TableName: 'purchase-session',
          Key: {
            'PurchaseSessionId': { S: '4557dfa3-dbc3-4610-9b4b-326e0f1e7c92' },
          },
          UpdateExpression: 'SET #status = :status',
          ExpressionAttributeNames: {
            '#status': 'status',
          },
          ExpressionAttributeValues: {
            ':status': { S: 'complete' },
          },
        },
      },
      {
        UpdateItem: {
          TableName: 'testTable',
          Key: {
            'id': { S: '2' },
          },
          UpdateExpression: 'SET #name = :name',
          ExpressionAttributeNames: {
            '#name': 'name',
          },
          ExpressionAttributeValues: {
            ':name': { S: 'lucas' },
          },
        },
      },
    ],
  };
  const transactWriteItemsCommand = new TransactWriteItemsCommand(transactWriteItemsParams);
  const transactWriteItemsResult = await client.send(transactWriteItemsCommand);
  console.log('transact write items result', transactWriteItemsResult);

  return null;
};


