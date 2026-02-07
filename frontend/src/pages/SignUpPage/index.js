import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux';
import { TextField, Typography } from '@mui/material'
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PrimaryButton from '../../components/PrimaryButton'
import PlayerList from '../../components/PlayerList'
import AlertComponent from '../../components/AlertComponent'
import EmptyState from '../../components/EmptyState'; 
import LoadingState from '../../components/LoadingState'; 
import { useGameDetails } from '../../hooks/useGameDetails'
import { signUpPlayer } from '../../api/signupService'
import { scrollToTop } from '../../utils/scrollUtils'
import { addPlayer } from '../../redux/slices/signupSlice';
import { formatDate } from '../../utils/dateUtils/index';
import TeamPlayerList from '../../components/TeamPlayerList';
import PageLayout from '../../components/PageLayout';
import WeatherForecastCard from '../../components/WeatherForecastCard';
import { fetchGameWeatherForecast } from '../../api/weatherService';
import './SignUpPage.css'

const SignUpPage = () => {
  const dispatch = useDispatch();
  const { players, gameDetails, isLoadingGameDetails } = useSelector(state => state.signup);
  const [playerName, setPlayerName] = useState('')
  const [signupOccurred, setSignupOccurred] = useState(false);
  const [isHighlighting, setIsHighlighting] = useState(null)
  const [alertInfo, setAlertInfo] = useState({
    open: false,
    message: '',
    severity: 'error',
  });
  const [forecast, setForecast] = useState(null);
  const [isLoadingForecast, setIsLoadingForecast] = useState(false);
  const [forecastError, setForecastError] = useState(null);
  useGameDetails()
  
  const showAlert = (message, severity = 'error') => {
    setAlertInfo({ open: true, message, severity });
    scrollToTop();
  };

  const hideAlert = () => {
    setAlertInfo({ open: false, message: '', severity: 'error' });
  };

  const handleNameChange = event => {
    setPlayerName(event.target.value)
  }

  const handleSignUp = async event => {
    event.preventDefault()
    try {
      const signupDetails = await signUpPlayer({
        gameId: gameDetails.gameId,
        playerName
      })
      setPlayerName('')
      setIsHighlighting(signupDetails.playerId);
      setTimeout(() => setIsHighlighting(null), 2000);
      setSignupOccurred(true);
      const newPlayer = {
        name: playerName,
        playerId: signupDetails.playerId, 
        gameId: gameDetails.gameId,
        paid: false, 
      };
      dispatch(addPlayer(newPlayer));
      hideAlert();
    } catch (error) {
      console.error(error.message);
      showAlert(error.message);
    }
  };

  useEffect(() => {
    if (signupOccurred) {
      setSignupOccurred(false);
    }
  }, [signupOccurred]);

  useEffect(() => {
    if (!gameDetails?.date || !gameDetails?.location) {
      setForecast(null);
      setForecastError(null);
      setIsLoadingForecast(false);
      return;
    }

    let isMounted = true
    setIsLoadingForecast(true)
    setForecastError(null)

    fetchGameWeatherForecast({
      location: gameDetails.location,
      gameDate: gameDetails.date,
    })
      .then((weatherData) => {
        if (isMounted) {
          setForecast(weatherData)
        }
      })
      .catch((error) => {
        if (isMounted) {
          setForecast(null)
          setForecastError(error.message)
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingForecast(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [gameDetails?.date, gameDetails?.location])

  if (isLoadingGameDetails) {
    return <LoadingState />; 
  }

  if (!gameDetails) {
    return <EmptyState />;
  }

  const lightsPlayers = players.filter(player => player.team === 'LIGHTS');
  const darksPlayers = players.filter(player => player.team === 'DARKS');
  const hasTeamAssignments = lightsPlayers.length > 0 || darksPlayers.length > 0;

  return (
    <PageLayout>
    <Typography variant='h4' component='h1' gutterBottom className="game-title">
      Join the Next Game
    </Typography>
    <div className="game-info">
      <span>
        <AccessTimeIcon className="game-info-icon" />
        <span className="game-info-text">Date: {formatDate(gameDetails.date)}</span>
      </span>
      <span>
        <LocationOnIcon className="game-info-icon" />
        <span className="game-info-text">{`Location: ${gameDetails.location}`}</span>
      </span>
    </div>
      <AlertComponent
        open={alertInfo.open}
        message={alertInfo.message}
        severity={alertInfo.severity}
        onClose={hideAlert}
      />
      <form onSubmit={handleSignUp}>
        <TextField
          label='Your Name'
          variant='outlined'
          fullWidth
          value={playerName}
          onChange={handleNameChange}
          margin='normal'
        />
        <PrimaryButton className="main-button" disabled={!playerName.trim()} onClick={handleSignUp}>
          Sign Up
        </PrimaryButton>
      </form>
      {hasTeamAssignments && (
        <div className="team-lists-container">
          <TeamPlayerList teamName="Lights" players={lightsPlayers} />
          <TeamPlayerList teamName="Darks" players={darksPlayers} />
        </div>
      )}
      <PlayerList
        players={players}
        maxPlayers={gameDetails?.maxPlayers}
        maxSubstitutes={gameDetails?.maxSubstitutes}
        isHighlighting={isHighlighting}
        showAlert={showAlert}
        hideAlert={hideAlert}
        signupOccurred={signupOccurred}
      />
      <WeatherForecastCard
        gameDateLabel={formatDate(gameDetails.date)}
        gameLocation={gameDetails.location}
        loading={isLoadingForecast}
        error={forecastError}
        forecast={forecast}
      />
    </PageLayout>
  )
}

export default SignUpPage
