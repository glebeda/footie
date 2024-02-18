const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const { v4: uuidv4 } = require('uuid'); 
const GameStatus = require('../constants/gameStatus');

const TABLE_NAME = 'Games';

const createGame = async (gameData) => {
  const gameId = uuidv4();
  const params = {
    TableName: TABLE_NAME,
    Item: {
      GameId: gameId,
      ...gameData,
    },
  };

  try {
    await dynamoDb.put(params).promise();
    return { gameId, ...gameData };
  } catch (error) {
    console.error("Error creating the game:", error);
    throw new Error('Error creating the game');
  }
};

const getGameById = async (gameId) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      GameId: gameId,
    },
  };

  try {
    const { Item } = await dynamoDb.get(params).promise();
    return Item;
  } catch (error) {
    console.error("Error retrieving the game:", error);
    throw new Error('Error retrieving the game');
  }
};

const updateGame = async (gameId, updateData) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      GameId: gameId,
    },
    UpdateExpression: 'set #status = :status',
    ExpressionAttributeNames: {
      '#status': 'Status',
    },
    ExpressionAttributeValues: {
      ':status': updateData.status,
    },
    ReturnValues: 'ALL_NEW',
  };

  try {
    const { Attributes } = await dynamoDb.update(params).promise();
    return Attributes;
  } catch (error) {
    console.error("Error updating the game:", error);
    throw new Error('Error updating the game');
  }
};

const updateGameStatus = async (gameId, status) => {
    const params = {
      TableName: TABLE_NAME,
      Key: { GameId: gameId },
      UpdateExpression: "set #status = :status",
      ExpressionAttributeNames: { "#status": "Status" },
      ExpressionAttributeValues: { ":status": status },
      ReturnValues: "ALL_NEW",
    };
  
    try {
      const { Attributes } = await dynamoDb.update(params).promise();
      return Attributes;
    } catch (error) {
      console.error("Error updating game status:", error);
      throw new Error('Error updating game status');
    }
  };
  
const deleteGame = async (gameId) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      GameId: gameId,
    },
  };

  try {
    await dynamoDb.delete(params).promise();
    return { success: true };
  } catch (error) {
    console.error("Error deleting the game:", error);
    throw new Error('Error deleting the game');
  }
};

const findOpenGame = async () => {
  const params = {
    TableName: TABLE_NAME,
    FilterExpression: "#status = :statusVal",
    ExpressionAttributeNames: {
      "#status": "Status",
    },
    ExpressionAttributeValues: {
      ":statusVal": GameStatus.OPEN,
    },
  };

  try {
    const result = await dynamoDb.scan(params).promise();
    if (result.Items.length > 0) {
      // Assuming only one game can be OPEN at a time
      return result.Items[0];
    } else {
      throw new Error('No open games found');
    }
  } catch (error) {
    console.error("Error finding open game:", error);
    throw error;
  }
};

module.exports = {
  createGame,
  getGameById,
  updateGame,
  updateGameStatus,
  deleteGame,
  findOpenGame,
};
