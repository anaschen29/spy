import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Button, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Grid,
  Paper
} from '@mui/material';
import { categories } from './data/gameData';
import { GameState, GameSettings, Player } from './types/game';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    settings: {
      numberOfPlayers: 4,
      numberOfSpies: 1,
      timer: 8,
      category: categories[0]
    },
    players: [],
    isGameStarted: false,
    currentTime: 0
  });

  const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number>(-1);
  const [isRevealPhase, setIsRevealPhase] = useState<boolean>(false);
  const [isCardVisible, setIsCardVisible] = useState<boolean>(false);
  const [isGameEnded, setIsGameEnded] = useState<boolean>(false);

  const startGame = () => {
    const { numberOfPlayers, numberOfSpies, category } = gameState.settings;
    
    // Randomly select a location
    const randomLocation = category.locations[Math.floor(Math.random() * category.locations.length)];
    
    // Create players array
    const players: Player[] = [];
    
    // Assign spies
    const spyIndices = new Set<number>();
    while (spyIndices.size < numberOfSpies) {
      spyIndices.add(Math.floor(Math.random() * numberOfPlayers));
    }
    
    // Create all players
    for (let i = 0; i < numberOfPlayers; i++) {
      if (spyIndices.has(i)) {
        players.push({
          id: i + 1,
          role: "Spy",
          location: "Unknown",
          isSpy: true
        });
      } else {
        players.push({
          id: i + 1,
          role: "Civilian",
          location: randomLocation.name,
          isSpy: false
        });
      }
    }
    
    setGameState(prev => ({
      ...prev,
      players,
      isGameStarted: true,
      currentTime: prev.settings.timer * 60
    }));
    setIsRevealPhase(true);
    setCurrentPlayerIndex(0);
    setIsGameEnded(false);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState.isGameStarted && gameState.currentTime > 0 && !isGameEnded) {
      interval = setInterval(() => {
        setGameState(prev => ({
          ...prev,
          currentTime: prev.currentTime - 1
        }));
      }, 1000);
    } else if (gameState.currentTime === 0 && !isGameEnded) {
      // Auto end game when time runs out
      setIsGameEnded(true);
      setIsRevealPhase(false);
    }
    return () => clearInterval(interval);
  }, [gameState.isGameStarted, gameState.currentTime, isGameEnded]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'Space' && isRevealPhase) {
        if (isCardVisible) {
          // Hide current card and move to next player
          setIsCardVisible(false);
          if (currentPlayerIndex < gameState.players.length - 1) {
            setCurrentPlayerIndex(prev => prev + 1);
          } else {
            // All cards have been shown, start the game
            setIsRevealPhase(false);
            setCurrentPlayerIndex(-1);
          }
        } else {
          // Show current card
          setIsCardVisible(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isRevealPhase, currentPlayerIndex, isCardVisible, gameState.players.length]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const renderPlayerCard = (player: Player) => (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6">Player {player.id}</Typography>
      <Typography>Location: {player.isSpy ? "SPY" : player.location}</Typography>
      {player.isSpy && (
        <Typography color="error">You are the Spy!</Typography>
      )}
    </Paper>
  );

  const handleEndGame = () => {
    setIsGameEnded(true);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Spy Game
        </Typography>

        {!gameState.isGameStarted ? (
          <Box sx={{ mt: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Number of Players"
                  value={gameState.settings.numberOfPlayers}
                  onChange={(e) => setGameState(prev => ({
                    ...prev,
                    settings: {
                      ...prev.settings,
                      numberOfPlayers: parseInt(e.target.value)
                    }
                  }))}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Number of Spies"
                  value={gameState.settings.numberOfSpies}
                  onChange={(e) => setGameState(prev => ({
                    ...prev,
                    settings: {
                      ...prev.settings,
                      numberOfSpies: parseInt(e.target.value)
                    }
                  }))}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Timer (minutes)"
                  value={gameState.settings.timer}
                  onChange={(e) => setGameState(prev => ({
                    ...prev,
                    settings: {
                      ...prev.settings,
                      timer: parseInt(e.target.value)
                    }
                  }))}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={gameState.settings.category.name}
                    label="Category"
                    onChange={(e) => {
                      const category = categories.find(c => c.name === e.target.value);
                      if (category) {
                        setGameState(prev => ({
                          ...prev,
                          settings: {
                            ...prev.settings,
                            category
                          }
                        }));
                      }
                    }}
                  >
                    {categories.map(category => (
                      <MenuItem key={category.name} value={category.name}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={startGame}
                >
                  Start Game
                </Button>
              </Grid>
            </Grid>
          </Box>
        ) : (
          <Box sx={{ mt: 4 }}>
            {isRevealPhase ? (
              <>
                <Typography variant="h4" gutterBottom align="center">
                  Player {currentPlayerIndex + 1}'s Turn
                </Typography>
                <Typography variant="body1" gutterBottom align="center" color="text.secondary">
                  Press SPACE to {isCardVisible ? 'hide' : 'show'} card
                </Typography>
                {isCardVisible && renderPlayerCard(gameState.players[currentPlayerIndex])}
              </>
            ) : (
              <>
                <Typography variant="h4" gutterBottom align="center">
                  Time Remaining: {formatTime(gameState.currentTime)}
                </Typography>
                <Typography variant="h5" gutterBottom align="center" color="text.secondary">
                  Game in Progress
                </Typography>
                <Grid container spacing={2}>
                  {gameState.players.map(player => (
                    <Grid item xs={12} sm={6} md={4} key={player.id}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h6">Player {player.id}</Typography>
                        <Typography>Location: Hidden</Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
                <Button
                  fullWidth
                  variant="contained"
                  color="secondary"
                  onClick={handleEndGame}
                  sx={{ mt: 2 }}
                >
                  End Game
                </Button>
              </>
            )}
            {isGameEnded && (
              <Box sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom align="center" color="error">
                  Game Over!
                </Typography>
                <Typography variant="h5" gutterBottom align="center">
                  The Spies were:
                </Typography>
                <Grid container spacing={2}>
                  {gameState.players.map(player => (
                    <Grid item xs={12} sm={6} md={4} key={player.id}>
                      {renderPlayerCard(player)}
                    </Grid>
                  ))}
                </Grid>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={() => setGameState(prev => ({ ...prev, isGameStarted: false }))}
                  sx={{ mt: 2 }}
                >
                  Play Again
                </Button>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default App; 