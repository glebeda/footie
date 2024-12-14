const awsConfig = {
    Auth: {
      region: 'eu-west-2', 
      userPoolId: 'eu-west-2_9GfdUorM0', 
      userPoolWebClientId: '27c951hfvdvggim2094p04jhh9', 
      oauth: {
        domain: process.env.REACT_APP_COGNITO_DOMAIN, 
        scope: ['email', 'openid', 'profile'],
        redirectSignIn: process.env.REACT_APP_REDIRECT_SIGN_IN,
        redirectSignOut: process.env.REACT_APP_REDIRECT_SIGN_OUT,
        responseType: 'code', 
      },
    },
  };
  
  export default awsConfig;
  