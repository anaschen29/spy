import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  useTheme,
  alpha,
  IconButton,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  LinearProgress
} from '@mui/material';
import { categories } from './data/gameData';
import CategoryOptionsDialog from './components/CategoryOptionsDialog';
import RoleCard from './components/RoleCard';
import { useGameTheme } from './GameTheme';
import { GameState, Player } from './types/game';
import SecurityIcon from '@mui/icons-material/Security';
import TimerIcon from '@mui/icons-material/Timer';
import GroupIcon from '@mui/icons-material/Group';
import CategoryIcon from '@mui/icons-material/Category';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import ReplayIcon from '@mui/icons-material/Replay';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
const App: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { isDarkMode, toggleMode } = useGameTheme();
  
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
  const [hasViewedNewPlayerCard, setHasViewedNewPlayerCard] = useState(false);
  const [showCategoryOptions, setShowCategoryOptions] = useState(false);

  const startGame = () => {
    setShowCategoryOptions(false);
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
    setIsCardVisible(false);
    setCurrentPlayerIndex(0);
    setIsGameEnded(false);
  };

  useEffect(() => {
    if (!gameState.isGameStarted || isRevealPhase || isGameEnded) return;
    if (gameState.currentTime === 0) {
      setIsGameEnded(true);
      return;
    }

    const interval = setInterval(() => {
      setGameState(prev => ({
        ...prev,
        currentTime: Math.max(0, prev.currentTime - 1)
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, [gameState.isGameStarted, gameState.currentTime, isGameEnded, isRevealPhase]);

  const handleRevealInteraction = useCallback(() => {
    if (!isRevealPhase || showAddPlayerDialog) return;
    if (!isCardVisible) {
      setIsCardVisible(true);
      return;
    }

    setIsCardVisible(false);
    if (currentPlayerIndex < gameState.players.length - 1) {
      setCurrentPlayerIndex(prev => prev + 1);
    } else {
      // Every input starts the countdown when the final card is hidden.
      setGameState(prev => ({
        ...prev,
        currentTime: prev.settings.timer * 60
      }));
      setIsRevealPhase(false);
      setCurrentPlayerIndex(-1);
    }
  }, [isRevealPhase, showAddPlayerDialog, isCardVisible, currentPlayerIndex, gameState.players.length]);

  useEffect(() => {
    if (!isRevealPhase || showAddPlayerDialog) return;

    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.target instanceof Element && event.target.closest('button, input, select, textarea, [role="dialog"]')) return;
      if (event.code === 'Space') {
        event.preventDefault();
        if (!event.repeat) handleRevealInteraction();
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [isRevealPhase, showAddPlayerDialog, handleRevealInteraction]);

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
    toggleMode();
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
    setHasViewedNewPlayerCard(false);
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

  const toggleNewPlayerCard = () => {
    setIsNewPlayerCardVisible(visible => !visible);
    setHasViewedNewPlayerCard(true);
  };

  // Touch interactions use the card's click handler so dialog buttons remain usable.
  useEffect(() => {
    if (!showAddPlayerDialog) return;

    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code !== 'Space' || event.repeat) return;
      if (event.target instanceof Element &&
          event.target.closest('button, input, select, textarea, [role="button"]')) return;
      event.preventDefault();
      toggleNewPlayerCard();
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showAddPlayerDialog]);

  const handleAddPlayerClick = () => {
    addPlayer();
  };

  const handleDialogClose = () => {
    setShowAddPlayerDialog(false);
    setIsNewPlayerCardVisible(false);
    setNewPlayerCard(null);
  };

  const handleAddAnotherPlayer = () => {
    if (newPlayerCard) {
      // Add the current player to the game
      setGameState(prev => ({
        ...prev,
        players: [...prev.players, newPlayerCard]
      }));
      
      // Generate a new player card
      addPlayer();
    }
  };

  return (
    <Box sx={{ minHeight: '100dvh', bgcolor: 'background.default', backgroundImage: `radial-gradient(ellipse at 10% 0%, ${alpha(theme.palette.primary.main, 0.07)}, transparent 50%)` }}>
      <Container maxWidth="md" sx={{ py: { xs: 2, sm: 4 }, px: { xs: 2.5, sm: 3 } }}>
        <Box component="header" sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: { xs: 1, sm: 2 }, pb: 3, mb: { xs: 2, sm: 5 }, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ display: 'flex', p: 1.2, borderRadius: 3, color: 'primary.main', bgcolor: alpha(theme.palette.primary.main, 0.1) }}><SecurityIcon /></Box>
            <Typography component="h1" sx={{ lineHeight: 1.2 }}>
              <Box component="span" sx={{ display: 'block', fontSize: 11, letterSpacing: '0.16em', fontWeight: 700, color: 'text.secondary' }}>MIT MSA</Box>
              <Box component="span" sx={{ fontSize: { xs: 22, sm: 24 }, fontWeight: 750, letterSpacing: '-0.04em' }}>Spy Game</Box>
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {isRevealPhase && <Button variant="text" color="secondary" onClick={handleRestart} startIcon={<ReplayIcon />}>Restart</Button>}
            {gameState.isGameStarted && !isRevealPhase && !isGameEnded && (
              <Button variant="outlined" sx={{ px: 1.5 }} onClick={handleAddPlayerClick} startIcon={<GroupIcon />}>Add Player</Button>
            )}
            <IconButton onClick={toggleTheme} aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`} title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}>
              {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Box>
        </Box>

        {!gameState.isGameStarted && showCategoryOptions && (
          <CategoryOptionsDialog category={gameState.settings.category} onClose={() => setShowCategoryOptions(false)} />
        )}

        <Dialog open={showAddPlayerDialog} onClose={handleDialogClose} aria-labelledby="add-player-title" maxWidth="sm" fullWidth fullScreen={isMobile}>
          <DialogTitle id="add-player-title">New Player's Card</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, pt: '12px !important' }}>
            <Typography color="text.secondary" variant="body2">Pass the phone to the new player before revealing.</Typography>
            {newPlayerCard && <RoleCard player={newPlayerCard} visible={isNewPlayerCardVisible} onClick={toggleNewPlayerCard} hideHint="Tap to hide your role" />}
          </DialogContent>
          <DialogActions sx={{ flexWrap: 'wrap', '& > .MuiButton-root': { flexGrow: 1, m: '0 !important' } }}>
            <Button onClick={handleDialogClose} color="secondary">Cancel</Button>
            <Button onClick={handleAddAnotherPlayer} variant="outlined" disabled={!hasViewedNewPlayerCard}>Add Player & Continue</Button>
            <Button onClick={confirmAddPlayer} variant="contained" disabled={!hasViewedNewPlayerCard}>Add Player & Close</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={showRestartDialog} onClose={() => setShowRestartDialog(false)} aria-labelledby="restart-title">
          <DialogTitle id="restart-title">Start fresh?</DialogTitle>
          <DialogContent><Typography color="text.secondary">Restarting takes you back to setup. The current roles and progress will be lost.</Typography></DialogContent>
          <DialogActions>
            <Button onClick={() => setShowRestartDialog(false)} color="secondary">Cancel</Button>
            <Button onClick={confirmRestart} color="error" variant="outlined">Restart</Button>
          </DialogActions>
        </Dialog>

        <Box component="main">
          {!gameState.isGameStarted ? (
            <Grid container spacing={{ xs: 3, sm: 5 }} alignItems="center">
              <Grid item xs={12} md={5}>
                <Typography variant="overline" color="primary">A little mystery. Good company.</Typography>
                <Typography variant="h2" sx={{ fontSize: { xs: '2.2rem', sm: '3.5rem' }, lineHeight: 1.05, mt: 1.5, mb: 2 }}>One phone.<br />Someone’s a spy.</Typography>
                <Typography color="text.secondary" sx={{ lineHeight: 1.8, maxWidth: 360 }}>Gather your people. Share a secret. Find out who’s bluffing.</Typography>
                <Box sx={{ display: { xs: 'none', md: 'grid' }, gap: 2.5, mt: 4 }}>
                  {['Choose a category together', 'Reveal your roles in private', 'Ask questions. Find the spy.'].map((step, index) => (
                    <Box key={step} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box sx={{ width: 28, height: 28, display: 'grid', placeItems: 'center', borderRadius: '50%', border: '1px solid', borderColor: 'divider', fontSize: 12, color: 'primary.main' }}>{index + 1}</Box>
                      <Typography variant="body2" color="text.secondary">{step}</Typography>
                    </Box>
                  ))}
                </Box>
              </Grid>
              <Grid item xs={12} md={7}>
                <Paper variant="outlined" sx={{ p: { xs: 2.5, sm: 3.5 }, borderRadius: 3 }}>
                  <Typography variant="overline" color="primary">Make it your round</Typography>
                  <Typography variant="h5" sx={{ mt: 0.5, mb: 0.5 }}>Set Up Your Game</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Everyone plays. Only the spy is in the dark.</Typography>
                  <Grid container spacing={2.5}>
                    <Grid item xs={6}>
                      <TextField fullWidth type="number" label="Players" value={gameState.settings.numberOfPlayers}
                        onChange={e => setGameState(prev => ({ ...prev, settings: { ...prev.settings, numberOfPlayers: parseInt(e.target.value) } }))}
                        InputProps={{ startAdornment: <GroupIcon sx={{ mr: 1, color: 'primary.main', fontSize: 20 }} /> }} />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField fullWidth type="number" label="Spies" value={gameState.settings.numberOfSpies}
                        onChange={e => setGameState(prev => ({ ...prev, settings: { ...prev.settings, numberOfSpies: parseInt(e.target.value) } }))}
                        InputProps={{ startAdornment: <SecurityIcon sx={{ mr: 1, color: 'primary.main', fontSize: 20 }} /> }} />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField fullWidth type="number" label="Timer (minutes)" value={gameState.settings.timer}
                        onChange={e => setGameState(prev => ({ ...prev, settings: { ...prev.settings, timer: parseInt(e.target.value) } }))}
                        InputProps={{ startAdornment: <TimerIcon sx={{ mr: 1, color: 'primary.main', fontSize: 20 }} /> }} />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel id="category-label">Category</InputLabel>
                        <Select labelId="category-label" value={gameState.settings.category.name} label="Category"
                          onChange={e => { const category = categories.find(c => c.name === e.target.value); if (category) setGameState(prev => ({ ...prev, settings: { ...prev.settings, category } })); }}
                          startAdornment={<CategoryIcon sx={{ mr: 1, color: 'primary.main', fontSize: 20 }} />}>
                          {categories.map(category => <MenuItem key={category.name} value={category.name}>{category.name}</MenuItem>)}
                        </Select>
                      </FormControl>
                      <Button fullWidth variant="text" startIcon={<CategoryIcon />} onClick={() => setShowCategoryOptions(true)} sx={{ mt: 0.5 }}>View category options</Button>
                    </Grid>
                    <Grid item xs={12}>
                      <Button fullWidth variant="contained" onClick={startGame} endIcon={<PlayArrowIcon />} sx={{ minHeight: 56, fontSize: '1rem' }}>Start Game</Button>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 1.5 }}>One device. Pass it around. Keep your role secret.</Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          ) : isRevealPhase ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2.5, maxWidth: 440, mx: 'auto' }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="overline" color="primary">The secret handoff · {currentPlayerIndex + 1} / {gameState.players.length}</Typography>
                <Typography variant="h4" sx={{ mt: 1 }}>Player {currentPlayerIndex + 1}'s Turn</Typography>
                <Typography color="text.secondary" variant="body2" sx={{ mt: 1 }}>Pass the phone. Everyone else, look away.</Typography>
              </Box>
              <RoleCard player={gameState.players[currentPlayerIndex]} visible={isCardVisible} onClick={handleRevealInteraction} hideHint="Tap to hide and pass" />
              <Box sx={{ display: 'flex', width: '100%', gap: 0.75 }} aria-label={`Player ${currentPlayerIndex + 1} of ${gameState.players.length}`}>
                {gameState.players.map((player, index) => <Box key={player.id} sx={{ flex: 1, height: 4, borderRadius: 2, bgcolor: index <= currentPlayerIndex ? 'primary.main' : 'divider' }} />)}
              </Box>
              <Typography variant="caption" color="text.secondary">Your round begins once everyone has seen their card.</Typography>
            </Box>
          ) : (
            <>
              <Paper variant="outlined" sx={{ p: { xs: 3, sm: 4 }, borderRadius: 3, textAlign: 'center', mb: 3 }}>
                <Chip size="small" icon={<CategoryIcon />} label={gameState.settings.category.name} variant="outlined" sx={{ mb: 2, maxWidth: '100%' }} />
                <Typography variant="overline" component="div" color="text.secondary">Time remaining</Typography>
                <Typography component="div" aria-label={`Time Remaining: ${formatTime(gameState.currentTime)}`} sx={{ fontSize: { xs: '5rem', sm: '7rem' }, fontWeight: 750, letterSpacing: '-0.06em', lineHeight: 1.15, fontVariantNumeric: 'tabular-nums', color: !isGameEnded && gameState.currentTime <= 60 ? 'error.main' : 'text.primary' }}>{formatTime(gameState.currentTime)}</Typography>
                <Typography color={isGameEnded ? 'primary' : 'text.secondary'} sx={{ mt: 1, mb: 3 }}>{isGameEnded ? 'Game Over!' : 'Game in Progress'}</Typography>
                <LinearProgress variant="determinate" value={Math.max(0, Math.min(100, gameState.currentTime / (gameState.settings.timer * 60) * 100))} aria-label="Round time remaining" color={!isGameEnded && gameState.currentTime <= 60 ? 'error' : 'primary'} sx={{ height: 5, borderRadius: 4, bgcolor: 'divider' }} />
              </Paper>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">{isGameEnded ? 'The reveal' : 'Around the table'}</Typography>
                <Typography variant="body2" color="text.secondary">{gameState.players.length} players</Typography>
              </Box>
              <Grid container spacing={1.5}>
                {gameState.players.map(player => (
                  <Grid item xs={6} sm={isGameEnded ? 6 : 3} key={player.id}>
                    <Card variant="outlined" sx={{ p: 2.5, minHeight: isGameEnded ? 180 : 100, height: '100%', borderRadius: 3, borderColor: isGameEnded && player.isSpy ? alpha(theme.palette.error.main, 0.5) : 'divider' }}>
                      <Typography sx={{ fontWeight: 650 }}>Player {player.id}</Typography>
                      {isGameEnded ? (
                        <>
                          <Typography variant="overline" color={player.isSpy ? 'error' : 'primary'} sx={{ display: 'block', mt: 2 }}>{player.isSpy ? 'SPY' : 'CIVILIAN'}</Typography>
                          <Typography sx={{ fontWeight: 600, overflowWrap: 'anywhere', mt: 0.5 }}>{player.isSpy ? 'You are the Spy!' : player.location}</Typography>
                        </>
                      ) : <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Role hidden</Typography>}
                    </Card>
                  </Grid>
                ))}
              </Grid>
              {!isGameEnded ? (
                <Button fullWidth variant="outlined" color="secondary" onClick={handleEndGame} startIcon={<StopIcon />} sx={{ mt: 3 }}>End Game</Button>
              ) : (
                <Button fullWidth variant="contained" onClick={() => setGameState(prev => ({ ...prev, isGameStarted: false }))} endIcon={<ReplayIcon />} sx={{ mt: 3 }}>Play Again</Button>
              )}
            </>
          )}
        </Box>
        <Typography component="footer" variant="caption" color="text.secondary" sx={{ textAlign: 'center', mt: { xs: 4, sm: 6 }, pb: 1 }}>A little suspicion brings us together.</Typography>
      </Container>
    </Box>
  );
};

export default App;
