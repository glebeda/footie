const formatTeamDataForClipboard = (players, teamAssignments) => {
    const lights = players.filter(player => teamAssignments[player.playerId] === 'LIGHTS');
    const darks = players.filter(player => teamAssignments[player.playerId] === 'DARKS');
  
    const formattedLights = lights.map(player => player.name).join('\n');
    const formattedDarks = darks.map(player => player.name).join('\n');
  
    return `${formattedLights}\nLIGHTS\n\nVS\n\n${formattedDarks}\nDARKS`;
  };
  
  export default formatTeamDataForClipboard;
  