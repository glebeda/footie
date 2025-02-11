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

const findUpcomingGame = async () => {
  const params = {
    TableName: TABLE_NAME,
    FilterExpression: "#status <> :playedStatus",
    ExpressionAttributeNames: {
      "#status": "Status",
    },
    ExpressionAttributeValues: {
      ":playedStatus": GameStatus.PLAYED,
    },
  };

  try {
    const result = await dynamoDb.scan(params).promise();
    // Filter for OPEN or FULL games and sort by Date to find the most upcoming game
    const upcomingGames = result.Items.filter(item => 
      item.Status === GameStatus.OPEN || item.Status === GameStatus.FULL
    ).sort((a, b) => new Date(a.Date) - new Date(b.Date));

    return upcomingGames.length > 0 ? upcomingGames[0] : null;
  } catch (error) {
    console.error("Error finding upcoming game:", error);
    throw error;
  }
};

const getGamesByDateRange = async (startDate, endDate, status = GameStatus.PLAYED) => {
  const params = {
    TableName: TABLE_NAME,
    FilterExpression: '#date BETWEEN :startDate AND :endDate AND #status = :status',
    ExpressionAttributeNames: {
      '#date': 'Date',
      '#status': 'Status',
    },
    ExpressionAttributeValues: {
      ':startDate': startDate.toISOString(),
      ':endDate': endDate.toISOString(),
      ':status': status,
    },
  };

  try {
    const data = await dynamoDb.scan(params).promise();
    return data.Items.sort((a, b) => new Date(b.Date) - new Date(a.Date));
  } catch (error) {
    console.error('Error retrieving games by date range and status:', error);
    throw new Error('Error retrieving games by date range and status');
  }
};

module.exports = {
  createGame,
  getGameById,
  updateGame,
  updateGameStatus,
  deleteGame,
  findUpcomingGame,
  getGamesByDateRange,
};
