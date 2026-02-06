const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const { v4: uuidv4 } = require('uuid'); 

const TABLE_NAME = 'Players';
const MAX_BATCH_GET_KEYS = 100;

const createPlayer = async (playerData) => {
  const PlayerId = uuidv4(); 
  const params = {
    TableName: TABLE_NAME,
    Item: {
      PlayerId,
      ...playerData,
    },
  };

  try {
    await dynamoDb.put(params).promise();
    return { PlayerId, ...playerData };
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

const findPlayerByName = async (name) => {
  const params = {
      TableName: "Players",
      IndexName: "NameIndex",
      KeyConditionExpression: "#nameAttr = :nameVal",
      ExpressionAttributeNames: {
        "#nameAttr": "Name", 
    },
    ExpressionAttributeValues: {
        ":nameVal": name,
    },
  };

  try {
      const data = await dynamoDb.query(params).promise();
      return data.Items[0]; // Return the first match, assuming names are unique
  } catch (error) {
      console.error("Error finding player by name:", error);
      throw new Error('Error finding player by name');
  }
}

const getPlayersByIds = async (playerIds) => {
  try {
    if (!Array.isArray(playerIds) || playerIds.length === 0) {
      return [];
    }

    const uniquePlayerIds = [...new Set(playerIds)];
    const allPlayers = [];

    for (let index = 0; index < uniquePlayerIds.length; index += MAX_BATCH_GET_KEYS) {
      let pendingKeys = uniquePlayerIds
        .slice(index, index + MAX_BATCH_GET_KEYS)
        .map((id) => ({ PlayerId: id }));

      while (pendingKeys.length > 0) {
        const params = {
          RequestItems: {
            [TABLE_NAME]: {
              Keys: pendingKeys,
            },
          },
        };

        const data = await dynamoDb.batchGet(params).promise();
        allPlayers.push(...(data.Responses?.[TABLE_NAME] || []));
        pendingKeys = data.UnprocessedKeys?.[TABLE_NAME]?.Keys || [];
      }
    }

    return allPlayers;
  } catch (error) {
    console.error('Error batch fetching players:', error);
    throw error;
  }
};

module.exports = {
  createPlayer,
  getPlayerById,
  findPlayerByName,
  getPlayersByIds
};
