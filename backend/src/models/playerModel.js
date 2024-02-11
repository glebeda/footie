const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const { v4: uuidv4 } = require('uuid'); 

const TABLE_NAME = 'Players';

const createPlayer = async (playerData) => {
  const playerId = uuidv4(); 
  const params = {
    TableName: TABLE_NAME,
    Item: {
      PlayerId: playerId,
      ...playerData,
    },
  };

  try {
    await dynamoDb.put(params).promise();
    return { playerId, ...playerData };
  } catch (error) {
    console.error("Error creating the player:", error);
    throw new Error('Error creating the player');
  }
};

const getPlayerById = async (playerId) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      PlayerId: playerId,
    },
  };

  try {
    const { Item } = await dynamoDb.get(params).promise();
    return Item;
  } catch (error) {
    console.error("Error retrieving the player:", error);
    throw new Error('Error retrieving the player');
  }
};

module.exports = {
  createPlayer,
  getPlayerById,
};
