import React, { useState, useEffect, useRef } from 'react';
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
  Paper,
  Card,
  CardContent,
  CardActions,
  useTheme,
  alpha
} from '@mui/material';
import { categories } from './data/gameData';
import { GameState, GameSettings, Player } from './types/game';
import SecurityIcon from '@mui/icons-material/Security';
import TimerIcon from '@mui/icons-material/Timer';
import GroupIcon from '@mui/icons-material/Group';
import CategoryIcon from '@mui/icons-material/Category';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import ReplayIcon from '@mui/icons-material/Replay';

const App: React.FC = () => {
  const theme = useTheme();
  const gameEndSound = useRef<HTMLAudioElement | null>(null);
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

    const handleTouch = (event: TouchEvent) => {
      if (isRevealPhase) {
        event.preventDefault(); // Prevent scrolling
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
    window.addEventListener('touchstart', handleTouch, { passive: false });
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('touchstart', handleTouch);
    };
  }, [isRevealPhase, currentPlayerIndex, isCardVisible, gameState.players.length]);

  useEffect(() => {
    // Create audio element
    gameEndSound.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    gameEndSound.current.volume = 0.5; // Set volume to 50%

    return () => {
      // Cleanup
      if (gameEndSound.current) {
        gameEndSound.current.pause();
        gameEndSound.current = null;
      }
    };
  }, []);

  // Play sound when game ends
  useEffect(() => {
    if (isGameEnded && gameEndSound.current) {
      gameEndSound.current.play().catch(error => {
        console.log('Error playing sound:', error);
      });
    }
  }, [isGameEnded]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const renderPlayerCard = (player: Player) => (
    <Card 
      sx={{ 
        width: 300,
        height: 400,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        background: player.isSpy 
          ? `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.1)} 0%, ${alpha(theme.palette.error.main, 0.2)} 100%)`
          : `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.2)} 100%)`,
        border: `2px solid ${player.isSpy ? theme.palette.error.main : theme.palette.primary.main}`,
        borderRadius: 2,
        boxShadow: 3,
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'scale(1.02)'
        }
      }}
    >
      <CardContent sx={{ 
        flexGrow: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'flex-start',
        pt: 4,
        gap: 2 
      }}>
        <Typography variant="h4">
          Player {player.id}
        </Typography>
        <Typography variant="h5" color="text.secondary">
          {player.isSpy ? "SPY" : "CIVILIAN"}
        </Typography>
        {!player.isSpy && (
          <Typography variant="h6" color="primary">
            {player.location}
          </Typography>
        )}
        {player.isSpy && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SecurityIcon color="error" sx={{ fontSize: 30 }} />
            <Typography color="error">
              You are the Spy!
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  const handleEndGame = () => {
    setIsGameEnded(true);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        bgcolor: 'background.default',
        position: 'relative',
        overflow: 'hidden',
        backgroundImage: `url("/spy-game-og.png")`,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='M0 0h100v100H0z'/%3E%3Cpath d='M0 0h50v50H0z'/%3E%3Cpath d='M50 50h50v50H50z'/%3E%3Cpath d='M25 25h50v50H25z'/%3E%3C/g%3E%3C/svg%3E")`,
          opacity: 0.1,
          zIndex: 0
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(18, 18, 18, 0.85)',
          zIndex: 0
        }
      }}
    >
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='M0 0h100v100H0z'/%3E%3Cpath d='M0 0h50v50H0z'/%3E%3Cpath d='M50 50h50v50H50z'/%3E%3Cpath d='M25 25h50v50H25z'/%3E%3C/g%3E%3C/svg%3E")`,
        opacity: 0.1,
        zIndex: 0
      }} />
      <Box sx={{
        position: 'absolute',
        top: '20%',
        left: '10%',
        width: '100px',
        height: '100px',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%239C92AC' fill-opacity='0.2'%3E%3Cpath d='M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 2.18l7 3.12v4.7c0 4.83-2.79 9.36-7 11.13-4.21-1.77-7-6.3-7-11.13v-4.7l7-3.12z'/%3E%3C/svg%3E")`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        animation: 'float 6s ease-in-out infinite',
        zIndex: 0
      }} />
      <Box sx={{
        position: 'absolute',
        top: '60%',
        right: '15%',
        width: '80px',
        height: '80px',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%239C92AC' fill-opacity='0.2'%3E%3Cpath d='M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 2.18l7 3.12v4.7c0 4.83-2.79 9.36-7 11.13-4.21-1.77-7-6.3-7-11.13v-4.7l7-3.12z'/%3E%3C/svg%3E")`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        animation: 'float 8s ease-in-out infinite',
        zIndex: 0
      }} />
      <Box sx={{
        position: 'absolute',
        top: '30%',
        right: '25%',
        width: '120px',
        height: '120px',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%239C92AC' fill-opacity='0.2'%3E%3Cpath d='M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 2.18l7 3.12v4.7c0 4.83-2.79 9.36-7 11.13-4.21-1.77-7-6.3-7-11.13v-4.7l7-3.12z'/%3E%3C/svg%3E")`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        animation: 'float 7s ease-in-out infinite',
        zIndex: 0
      }} />
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ my: 4 }}>
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom 
            align="center"
            sx={{ 
              fontWeight: 'bold',
              background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
              backgroundClip: 'text',
              textFillColor: 'transparent',
              mb: 4,
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: '-20px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '60px',
                height: '60px',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%239C92AC' fill-opacity='0.3'%3E%3Cpath d='M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 2.18l7 3.12v4.7c0 4.83-2.79 9.36-7 11.13-4.21-1.77-7-6.3-7-11.13v-4.7l7-3.12z'/%3E%3C/svg%3E")`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                animation: 'float 3s ease-in-out infinite'
              }
            }}
          >
            MSA Spy Game
          </Typography>

          {!gameState.isGameStarted ? (
            <Box sx={{ mt: 4 }}>
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 4, 
                  background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.paper, 0.95)} 100%)`,
                  borderRadius: 2
                }}
              >
                <Typography variant="h5" gutterBottom align="center" sx={{ mb: 4 }}>
                  Set Up Your Game
                </Typography>
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
                      InputProps={{
                        startAdornment: <GroupIcon sx={{ mr: 1, color: 'primary.main' }} />
                      }}
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
                      InputProps={{
                        startAdornment: <SecurityIcon sx={{ mr: 1, color: 'error.main' }} />
                      }}
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
                      InputProps={{
                        startAdornment: <TimerIcon sx={{ mr: 1, color: 'primary.main' }} />
                      }}
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
                        startAdornment={<CategoryIcon sx={{ mr: 1, color: 'primary.main' }} />}
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
                      startIcon={<PlayArrowIcon />}
                      sx={{ 
                        py: 2,
                        fontSize: '1.1rem',
                        background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
                        '&:hover': {
                          background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.secondary.dark} 90%)`,
                        }
                      }}
                    >
                      Start Game
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Box>
          ) : (
            <Box sx={{ mt: 4 }}>
              {isRevealPhase ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                  <Typography variant="h4" gutterBottom align="center">
                    Player {currentPlayerIndex + 1}'s Turn
                  </Typography>
                  <Typography variant="body1" gutterBottom align="center" color="text.secondary">
                    Press SPACE or tap to {isCardVisible ? 'hide' : 'show'} card
                  </Typography>
                  {isCardVisible && renderPlayerCard(gameState.players[currentPlayerIndex])}
                </Box>
              ) : (
                <>
                  <Paper 
                    elevation={3} 
                    sx={{ 
                      p: 3, 
                      mb: 3,
                      background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.2)} 100%)`,
                      borderRadius: 2
                    }}
                  >
                    <Typography variant="h4" gutterBottom align="center">
                      Time Remaining: {formatTime(gameState.currentTime)}
                    </Typography>
                    <Typography variant="h5" gutterBottom align="center" color="text.secondary">
                      {isGameEnded ? "Game Over!" : "Game in Progress"}
                    </Typography>
                  </Paper>
                  <Grid container spacing={2} justifyContent="center">
                    {gameState.players.map(player => (
                      <Grid item key={player.id}>
                        <Card 
                          sx={{ 
                            width: 200,
                            height: 300,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            pt: 4,
                            background: isGameEnded 
                              ? (player.isSpy 
                                  ? `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.1)} 0%, ${alpha(theme.palette.error.main, 0.2)} 100%)`
                                  : `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.2)} 100%)`)
                              : `linear-gradient(135deg, ${alpha(theme.palette.grey[300], 0.5)} 0%, ${alpha(theme.palette.grey[400], 0.5)} 100%)`,
                            border: isGameEnded
                              ? `2px solid ${player.isSpy ? theme.palette.error.main : theme.palette.primary.main}`
                              : `2px dashed ${theme.palette.grey[400]}`,
                            borderRadius: 2,
                            boxShadow: isGameEnded ? 3 : 0
                          }}
                        >
                          <Typography variant="h6">Player {player.id}</Typography>
                          {isGameEnded ? (
                            <>
                              <Typography variant="h5" color={player.isSpy ? "error" : "primary"} sx={{ mt: 2 }}>
                                {player.isSpy ? "SPY" : "CIVILIAN"}
                              </Typography>
                              <Typography color="text.secondary" sx={{ mt: 2 }}>
                                {!player.isSpy && player.location}
                              </Typography>
                              {player.isSpy && (
                                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <SecurityIcon color="error" sx={{ fontSize: 30 }} />
                                  <Typography color="error">
                                    You are the Spy!
                                  </Typography>
                                </Box>
                              )}
                            </>
                          ) : (
                            <Typography color="text.secondary" sx={{ mt: 2 }}>Location: Hidden</Typography>
                          )}
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                  {!isGameEnded && (
                    <Button
                      fullWidth
                      variant="contained"
                      color="secondary"
                      onClick={handleEndGame}
                      startIcon={<StopIcon />}
                      sx={{ mt: 3 }}
                    >
                      End Game
                    </Button>
                  )}
                  {isGameEnded && (
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      onClick={() => setGameState(prev => ({ ...prev, isGameStarted: false }))}
                      startIcon={<ReplayIcon />}
                      sx={{ mt: 3 }}
                    >
                      Play Again
                    </Button>
                  )}
                </>
              )}
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default App; 