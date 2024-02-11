const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = 'Sign-ups';

const addSignUp = async (gameId, playerId) => {
    const checkParams = {
      TableName: TABLE_NAME,
      Key: {
        GameId: gameId,
        PlayerId: playerId,
      },
    };
  
    try {
      // Check if the sign-up already exists
      const { Item } = await dynamoDb.get(checkParams).promise();
      if (Item) {
        throw new Error('Player is already signed up for this game');
      }
  
      // Define parameters for adding the sign-up
      const addParams = {
        TableName: TABLE_NAME,
        Item: {
          GameId: gameId,
          PlayerId: playerId,
          SignUpDate: new Date().toISOString(), 
        },
      };
  
      await dynamoDb.put(addParams).promise();
      return addParams.Item;
    } catch (error) {
      console.error("Error in addSignUp:", error);
      throw error;
    }
  };
  

const getSignUpsForGame = async (gameId) => {
  const params = {
    TableName: TABLE_NAME,
    KeyConditionExpression: 'GameId = :gameId',
    ExpressionAttributeValues: {
      ':gameId': gameId,
    },
  };

  try {
    const data = await dynamoDb.query(params).promise();
    return data.Items;
  } catch (error) {
    console.error("Error retrieving sign-ups for game:", error);
    throw new Error('Error retrieving sign-ups for game');
  }
};

const deleteSignUp = async (gameId, playerId) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      GameId: gameId,
      PlayerId: playerId,
    },
  };

  try {
    await dynamoDb.delete(params).promise();
    return { success: true };
  } catch (error) {
    console.error("Error deleting sign-up:", error);
    throw new Error('Error deleting sign-up');
  }
};

module.exports = {
  addSignUp,
  getSignUpsForGame,
  deleteSignUp,
};
