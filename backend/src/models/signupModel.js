const AWS = require('aws-sdk')
const dynamoDb = new AWS.DynamoDB.DocumentClient()

const TABLE_NAME = 'Sign-ups'

const addSignUp = async (gameId, playerId, role) => {
  const params = {
    TableName: TABLE_NAME,
    Item: {
      GameId: gameId,
      PlayerId: playerId,
      SignUpDate: new Date().toISOString(),
      Paid: false,
      Role: role,
    }
  }

  try {
    await dynamoDb.put(params).promise()
    return params.Item
  } catch (error) {
    console.error('Error adding sign-up:', error)
    throw new Error('Error adding sign-up')
  }
}

const deleteSignUp = async (gameId, playerId) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      GameId: gameId,
      PlayerId: playerId
    }
  }

  try {
    await dynamoDb.delete(params).promise()
    return { success: true }
  } catch (error) {
    console.error('Error deleting sign-up:', error)
    throw new Error('Error deleting sign-up')
  }
}

async function checkSignUpExists (gameId, playerId) {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      GameId: gameId,
      PlayerId: playerId
    }
  }

  try {
    const { Item } = await dynamoDb.get(params).promise()
    return !!Item // Converts the result to boolean: true if Item exists, false otherwise
  } catch (error) {
    console.error('Error checking sign-up existence:', error)
    throw new Error('Error checking sign-up existence')
  }
}

async function getSignUpsForGame (gameId) {
  const params = {
    TableName: TABLE_NAME,
    KeyConditionExpression: 'GameId = :gameId',
    ExpressionAttributeValues: {
      ':gameId': gameId
    }
  }

  try {
    const data = await dynamoDb.query(params).promise()
    const sortedSignUps = data.Items.sort(
      (a, b) => new Date(a.SignUpDate) - new Date(b.SignUpDate)
    )
    return sortedSignUps
  } catch (error) {
    console.error('Error retrieving sign-ups for game:', error)
    throw new Error('Error retrieving sign-ups for game')
  }
}

async function updatePaymentStatus (gameId, playerId, paid) {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      GameId: gameId,
      PlayerId: playerId
    },
    UpdateExpression: 'set Paid = :paid',
    ExpressionAttributeValues: {
      ':paid': paid
    },
    ReturnValues: 'ALL_NEW'
  }

  try {
    const result = await dynamoDb.update(params).promise()
    return result.Attributes
  } catch (error) {
    console.error('Error updating payment status:', error)
    throw new Error('Error updating payment status')
  }
}

async function updateSignUpRole(gameId, playerId, newRole) {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      GameId: gameId,
      PlayerId: playerId,
    },
    UpdateExpression: 'set Role = :newRole',
    ExpressionAttributeValues: {
      ':newRole': newRole,
    },
    ReturnValues: 'ALL_NEW',
  };

  try {
    const result = await dynamoDb.update(params).promise();
    return result.Attributes;
  } catch (error) {
    console.error('Error updating sign-up role:', error);
    throw new Error('Error updating sign-up role');
  }
}


module.exports = {
  addSignUp,
  getSignUpsForGame,
  deleteSignUp,
  checkSignUpExists,
  updatePaymentStatus,
  updateSignUpRole
}
