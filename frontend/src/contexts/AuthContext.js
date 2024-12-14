import React, { createContext, useState, useEffect } from 'react';
import { Auth, Hub } from 'aws-amplify';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    let isMounted = true; 

    const fetchUser = async () => {
      try {
        const currentUser = await Auth.currentAuthenticatedUser({ bypassCache: true });
        const idToken = currentUser.signInUserSession.idToken;
        const attributes = idToken.payload;

        if (isMounted) {
          setUser({ ...currentUser, attributes });
        }
      } catch (err) {
        if (isMounted) {
          setUser(null);
        }
        console.log('Error fetching user', err);
      }
    };

    const authListener = ({ payload: { event } }) => {
      switch (event) {
        case 'signIn':
        case 'cognitoHostedUI':
          fetchUser();
          break;
        case 'signOut':
          if (isMounted) {
            setUser(null);
          }
          break;
        case 'signIn_failure':
        case 'cognitoHostedUI_failure':
          console.error('Sign in failure');
          break;
        default:
          break;
      }
    };

    Hub.listen('auth', authListener);
    fetchUser(); 

    return () => {
      isMounted = false;
      Hub.remove('auth', authListener);
    };
  }, []);

  const signOut = async () => {
    try {
      await Auth.signOut();
      setUser(null);
    } catch (error) {
      console.log('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};