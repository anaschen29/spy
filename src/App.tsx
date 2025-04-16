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
  alpha,
  IconButton,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
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
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { keyframes } from '@mui/system';

// Define animations
const flipAnimation = keyframes`
  0% { transform: rotateY(0deg); }
  100% { transform: rotateY(180deg); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const App: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  // Sound effects
  const cardFlipSound = useRef<HTMLAudioElement>(null);
  const gameStartSound = useRef<HTMLAudioElement>(null);
  const gameEndSound = useRef<HTMLAudioElement>(null);
  const buttonClickSound = useRef<HTMLAudioElement>(null);

  // Initialize sound effects
  useEffect(() => {
    cardFlipSound.current = new Audio('/sounds/card-flip.mp3');
    gameStartSound.current = new Audio('/sounds/game-start.mp3');
    gameEndSound.current = new Audio('/sounds/game-end.mp3');
    buttonClickSound.current = new Audio('/sounds/button-click.mp3');

    // Set volume
    [cardFlipSound, gameStartSound, gameEndSound, buttonClickSound].forEach(sound => {
      if (sound.current) sound.current.volume = 0.5;
    });

    return () => {
      [cardFlipSound, gameStartSound, gameEndSound, buttonClickSound].forEach(sound => {
        if (sound.current) {
          sound.current.pause();
          sound.current = null;
        }
      });
    };
  }, []);

  // Play sound helper
  const playSound = (sound: React.RefObject<HTMLAudioElement | null>) => {
    if (sound.current) {
      sound.current.currentTime = 0;
      sound.current.play().catch(error => console.log('Error playing sound:', error));
    }
  };

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
  const [showRestartDialog, setShowRestartDialog] = useState(false);
  const [showAddPlayerDialog, setShowAddPlayerDialog] = useState(false);
  const [newPlayerCard, setNewPlayerCard] = useState<Player | null>(null);
  const [isNewPlayerCardVisible, setIsNewPlayerCardVisible] = useState(false);

  const startGame = () => {
    playSound(gameStartSound);
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
      currentTime: 0
    }));
    setIsRevealPhase(true);
    setCurrentPlayerIndex(0);
    setIsGameEnded(false);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState.isGameStarted && !isRevealPhase && gameState.currentTime > 0 && !isGameEnded) {
      interval = setInterval(() => {
        setGameState(prev => ({
          ...prev,
          currentTime: prev.currentTime - 1
        }));
      }, 1000);
    } else if (gameState.currentTime === 0 && !isGameEnded && !isRevealPhase) {
      // Auto end game when time runs out
      setIsGameEnded(true);
    }
    return () => clearInterval(interval);
  }, [gameState.isGameStarted, gameState.currentTime, isGameEnded, isRevealPhase]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'Space' && isRevealPhase) {
        if (isCardVisible) {
          // Hide current card and move to next player
          setIsCardVisible(false);
          if (currentPlayerIndex < gameState.players.length - 1) {
            setCurrentPlayerIndex(prev => prev + 1);
          } else {
            // All cards have been shown, start the game and timer
            setIsRevealPhase(false);
            setCurrentPlayerIndex(-1);
            setGameState(prev => ({
              ...prev,
              currentTime: prev.settings.timer * 60
            }));
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
            // All cards have been shown, start the game and timer
            setIsRevealPhase(false);
            setCurrentPlayerIndex(-1);
            setGameState(prev => ({
              ...prev,
              currentTime: prev.settings.timer * 60
            }));
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

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleEndGame = () => {
    playSound(gameEndSound);
    setIsGameEnded(true);
  };

  const handleButtonClick = () => {
    playSound(buttonClickSound);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    handleButtonClick();
  };

  const handleRestart = () => {
    setShowRestartDialog(true);
  };

  const confirmRestart = () => {
    setGameState(prev => ({ ...prev, isGameStarted: false }));
    setIsRevealPhase(false);
    setCurrentPlayerIndex(-1);
    setShowRestartDialog(false);
  };

  const addPlayer = () => {
    const { category } = gameState.settings;
    // Find the location used by civilians in the current game
    const civilianLocation = gameState.players.find(p => !p.isSpy)?.location || "Unknown";
    const isSpy = Math.random() < 0.25; // 25% chance of being spy
    
    const newPlayer: Player = {
      id: gameState.players.length + 1,
      role: isSpy ? "Spy" : "Civilian",
      location: isSpy ? "Unknown" : civilianLocation,
      isSpy
    };

    setNewPlayerCard(newPlayer);
    setIsNewPlayerCardVisible(false);
    setShowAddPlayerDialog(true);
  };

  const confirmAddPlayer = () => {
    if (newPlayerCard) {
      setGameState(prev => ({
        ...prev,
        players: [...prev.players, newPlayerCard]
      }));
      setNewPlayerCard(null);
      setShowAddPlayerDialog(false);
      setIsNewPlayerCardVisible(false);
    }
  };

  // Add keyboard and touch handlers for new player card reveal
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'Space' && showAddPlayerDialog) {
        setIsNewPlayerCardVisible(true);
      }
    };

    const handleTouch = (event: TouchEvent) => {
      if (showAddPlayerDialog) {
        event.preventDefault();
        setIsNewPlayerCardVisible(true);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('touchstart', handleTouch, { passive: false });
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('touchstart', handleTouch);
    };
  }, [showAddPlayerDialog]);

  const renderPlayerCard = (player: Player) => (
    <Card 
      sx={{ 
        width: isMobile ? '100%' : 300,
        height: isMobile ? 300 : 400,
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
        animation: `${fadeIn} 0.5s ease-out`,
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
        <Typography variant={isMobile ? "h5" : "h4"}>
          Player {player.id}
        </Typography>
        <Typography variant={isMobile ? "h6" : "h5"} color="text.secondary">
          {player.isSpy ? "SPY" : "CIVILIAN"}
        </Typography>
        {!player.isSpy && (
          <Typography variant={isMobile ? "body1" : "h6"} color="primary">
            {player.location}
          </Typography>
        )}
        {player.isSpy && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SecurityIcon color="error" sx={{ fontSize: isMobile ? 24 : 30 }} />
            <Typography color="error">
              You are the Spy!
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );

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
          background: isDarkMode ? 'rgba(18, 18, 18, 0.85)' : 'rgba(255, 255, 255, 0.85)',
          zIndex: 0
        }
      }}
    >
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ 
          my: 4,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4
        }}>
          <Typography 
            variant="h2" 
            component="h1" 
            sx={{ 
              fontWeight: 'bold',
              background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
              backgroundClip: 'text',
              textFillColor: 'transparent',
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
          <Box sx={{ display: 'flex', gap: 1 }}>
            {isRevealPhase && (
              <Button
                variant="outlined"
                color="error"
                onClick={handleRestart}
                startIcon={<ReplayIcon />}
              >
                Restart
              </Button>
            )}
            {gameState.isGameStarted && !isRevealPhase && !isGameEnded && (
              <Button
                variant="outlined"
                color="primary"
                onClick={addPlayer}
                startIcon={<GroupIcon />}
              >
                Add Player
              </Button>
            )}
            <IconButton onClick={toggleTheme} color="inherit">
              {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Box>
        </Box>

        {/* Add Player Dialog */}
        <Dialog
          open={showAddPlayerDialog}
          onClose={() => setShowAddPlayerDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>New Player's Card</DialogTitle>
          <DialogContent>
            {newPlayerCard && (
              <Card 
                sx={{ 
                  width: '100%',
                  height: 300,
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  background: isNewPlayerCardVisible 
                    ? (newPlayerCard.isSpy 
                        ? `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.1)} 0%, ${alpha(theme.palette.error.main, 0.2)} 100%)`
                        : `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.2)} 100%)`)
                    : 'transparent',
                  border: `2px solid ${isNewPlayerCardVisible 
                    ? (newPlayerCard.isSpy ? theme.palette.error.main : theme.palette.primary.main)
                    : theme.palette.grey[400]}`,
                  borderRadius: 2,
                  boxShadow: 3,
                  mt: 2,
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'scale(1.02)'
                  }
                }}
                onClick={() => setIsNewPlayerCardVisible(true)}
              >
                <CardContent sx={{ 
                  flexGrow: 1, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  gap: 2,
                  textAlign: 'center'
                }}>
                  {isNewPlayerCardVisible ? (
                    <>
                      <Typography variant="h4">
                        Player {newPlayerCard.id}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {newPlayerCard.isSpy ? "SPY" : "CIVILIAN"}
                      </Typography>
                      {!newPlayerCard.isSpy && (
                        <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold', mt: 2 }}>
                          {newPlayerCard.location}
                        </Typography>
                      )}
                      {newPlayerCard.isSpy && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <SecurityIcon color="error" sx={{ fontSize: 30 }} />
                          <Typography color="error">
                            You are the Spy!
                          </Typography>
                        </Box>
                      )}
                    </>
                  ) : (
                    <Typography variant="h6" color="text.secondary">
                      Press SPACE or tap to reveal your role
                    </Typography>
                  )}
                </CardContent>
              </Card>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowAddPlayerDialog(false)} color="primary">
              Cancel
            </Button>
            <Button 
              onClick={confirmAddPlayer} 
              color="primary" 
              variant="contained"
              disabled={!isNewPlayerCardVisible}
            >
              Add Player
            </Button>
          </DialogActions>
        </Dialog>

        {/* Restart Confirmation Dialog */}
        <Dialog
          open={showRestartDialog}
          onClose={() => setShowRestartDialog(false)}
        >
          <DialogTitle>Confirm Restart</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to restart? This will take you back to the home page and all progress will be lost.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowRestartDialog(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={confirmRestart} color="error" variant="contained">
              Restart
            </Button>
          </DialogActions>
        </Dialog>

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
                <Card 
                  sx={{ 
                    width: isMobile ? '100%' : 300,
                    height: isMobile ? 300 : 400,
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    background: isCardVisible 
                      ? (gameState.players[currentPlayerIndex].isSpy 
                          ? `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.1)} 0%, ${alpha(theme.palette.error.main, 0.2)} 100%)`
                          : `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.2)} 100%)`)
                      : 'transparent',
                    border: `2px solid ${isCardVisible 
                      ? (gameState.players[currentPlayerIndex].isSpy ? theme.palette.error.main : theme.palette.primary.main)
                      : theme.palette.grey[400]}`,
                    borderRadius: 2,
                    boxShadow: 3,
                    transition: 'all 0.3s ease',
                    animation: `${fadeIn} 0.5s ease-out`,
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'scale(1.02)'
                    }
                  }}
                  onClick={() => {
                    if (isCardVisible) {
                      setIsCardVisible(false);
                      if (currentPlayerIndex < gameState.players.length - 1) {
                        setCurrentPlayerIndex(prev => prev + 1);
                      } else {
                        setIsRevealPhase(false);
                        setCurrentPlayerIndex(-1);
                      }
                    } else {
                      setIsCardVisible(true);
                    }
                  }}
                >
                  <CardContent sx={{ 
                    flexGrow: 1, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    gap: 2,
                    textAlign: 'center',
                    width: '100%'
                  }}>
                    {isCardVisible ? (
                      <>
                        <Typography variant={isMobile ? "h5" : "h4"} sx={{ textAlign: 'center' }}>
                          Player {gameState.players[currentPlayerIndex].id}
                        </Typography>
                        <Typography variant={isMobile ? "h6" : "h5"} color="text.secondary" sx={{ textAlign: 'center' }}>
                          {gameState.players[currentPlayerIndex].isSpy ? "SPY" : "CIVILIAN"}
                        </Typography>
                        {!gameState.players[currentPlayerIndex].isSpy && (
                          <Typography variant={isMobile ? "body1" : "h6"} color="primary" sx={{ textAlign: 'center' }}>
                            {gameState.players[currentPlayerIndex].location}
                          </Typography>
                        )}
                        {gameState.players[currentPlayerIndex].isSpy && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center', width: '100%' }}>
                            <SecurityIcon color="error" sx={{ fontSize: isMobile ? 24 : 30 }} />
                            <Typography color="error" sx={{ textAlign: 'center' }}>
                              You are the Spy!
                            </Typography>
                          </Box>
                        )}
                      </>
                    ) : (
                      <Typography variant="h6" color="text.secondary" sx={{ textAlign: 'center' }}>
                        Tap or press SPACE to reveal
                      </Typography>
                    )}
                  </CardContent>
                </Card>
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
      </Container>
    </Box>
  );
};

export default App; 