import React, { useState, useEffect, useMemo } from 'react';
import { FormControl, InputLabel, Select, MenuItem, Typography } from '@mui/material';
import { getPastGames } from '../../api/gameService';
import { getGameWithSignups } from '../../api/signupService';
import TeamPlayerList from '../../components/TeamPlayerList';
import LoadingState from '../../components/LoadingState';
import EmptyState from '../../components/EmptyState';
import PageLayout from '../../components/PageLayout';
import { formatDate } from '../../utils/dateUtils/index';
import './GameHistoryPage.css';

const GameHistoryPage = () => {
  const [pastGames, setPastGames] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedGame, setSelectedGame] = useState('');
  const [currentGameDetails, setCurrentGameDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get unique years from games
  const availableYears = [...new Set(pastGames.map(game => 
    new Date(game.date).getFullYear()
  ))].sort((a, b) => b - a); // Sort years descending

  useEffect(() => {
    const fetchPastGames = async () => {
      try {
        const games = await getPastGames();
        setPastGames(games);
        
        // Set initial selections if games exist
        if (games.length > 0) {
          // Sort games by date descending to get the most recent first
          const sortedGames = [...games].sort((a, b) => 
            new Date(b.date) - new Date(a.date)
          );
          const mostRecentGame = sortedGames[0];
          const mostRecentYear = new Date(mostRecentGame.date).getFullYear();
          
          setSelectedYear(mostRecentYear);
          setSelectedGame(mostRecentGame.gameId);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching past games:', error);
        setError('Sorry lad, something went wrong while loading the games');
        setIsLoading(false);
      }
    };

    fetchPastGames();
  }, []);

  useEffect(() => {
    const fetchGameDetails = async () => {
      if (!selectedGame) return;
      
      try {
        const details = await getGameWithSignups(selectedGame);
        setCurrentGameDetails(details);
      } catch (error) {
        console.error('Error fetching game details:', error);
        setError('Sorry lad, something went wrong while loading the game details');
      }
    };

    fetchGameDetails();
  }, [selectedGame]);

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
    setSelectedGame(''); // Reset selected game when year changes
    setCurrentGameDetails(null);
  };

  const handleGameChange = (event) => {
    setSelectedGame(event.target.value);
  };

  // Move the games sorting logic outside the render for better performance
  const sortedGamesForYear = useMemo(() => {
    return pastGames
      .filter(game => new Date(game.date).getFullYear() === selectedYear)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [pastGames, selectedYear]);

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <EmptyState message={error} />;
  }

  if (pastGames.length === 0) {
    return <EmptyState message="Sorry lad, no past games found" />;
  }

  // Group players by team
  const lightsPlayers = currentGameDetails?.signUps
    .filter(signup => signup.team === 'LIGHTS')
    .map(signup => ({
      name: signup.playerName,
      playerId: signup.playerId,
      paid: signup.paid,
      team: signup.team
    })) || [];

  const darksPlayers = currentGameDetails?.signUps
    .filter(signup => signup.team === 'DARKS')
    .map(signup => ({
      name: signup.playerName,
      playerId: signup.playerId,
      paid: signup.paid,
      team: signup.team
    })) || [];

  const unassignedPlayers = currentGameDetails?.signUps
    .filter(signup => !signup.team || signup.team === 'UNASSIGNED')
    .map(signup => ({
      name: signup.playerName,
      playerId: signup.playerId,
      paid: signup.paid,
      team: signup.team
    })) || [];

  return (
    <PageLayout>
      <Typography variant="h4" component="h1" gutterBottom>
        Past Matches
      </Typography>

      <FormControl fullWidth margin="normal">
        <InputLabel id="year-select-label">Select Year</InputLabel>
        <Select
          labelId="year-select-label"
          value={selectedYear}
          onChange={handleYearChange}
          label="Select Year"
        >
          {availableYears.map((year) => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedYear && (
        <FormControl fullWidth margin="normal">
          <InputLabel id="game-select-label">Select Match</InputLabel>
          <Select
            labelId="game-select-label"
            value={selectedGame}
            onChange={handleGameChange}
            label="Select Match"
          >
            {sortedGamesForYear.map((game) => (
              <MenuItem key={game.gameId} value={game.gameId}>
                {formatDate(game.date)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {currentGameDetails && (
        <div className="team-lists-container">
          {lightsPlayers.length > 0 && (
            <TeamPlayerList teamName="Lights" players={lightsPlayers} />
          )}
          {darksPlayers.length > 0 && (
            <TeamPlayerList teamName="Darks" players={darksPlayers} />
          )}
          {unassignedPlayers.length > 0 && (
            <TeamPlayerList teamName="Unassigned" players={unassignedPlayers} />
          )}
        </div>
      )}
    </PageLayout>
  );
};

export default GameHistoryPage; 