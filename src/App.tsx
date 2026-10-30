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
import HowToPlayDialog from './components/HowToPlayDialog';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { GameState, Player } from './types/game';
import SecurityIcon from '@mui/icons-material/Security';
import TimerIcon from '@mui/icons-material/Timer';
import GroupIcon from '@mui/icons-material/Group';
import CategoryIcon from '@mui/icons-material/Category';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import ReplayIcon from '@mui/icons-material/Replay';
const App: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Sound effects
  const cardFlipSound = useRef<HTMLAudioElement>(null);
  const gameStartSound = useRef<HTMLAudioElement>(null);
  const gameEndSound = useRef<HTMLAudioElement>(null);

  // Initialize sound effects
  useEffect(() => {
    cardFlipSound.current = new Audio('/sounds/card-flip.mp3');
    gameStartSound.current = new Audio('/sounds/game-start.mp3');
    gameEndSound.current = new Audio('/sounds/game-end.mp3');

    // Set volume
    [cardFlipSound, gameStartSound, gameEndSound].forEach(sound => {
      if (sound.current) sound.current.volume = 0.5;
    });

    return () => {
      [cardFlipSound, gameStartSound, gameEndSound].forEach(sound => {
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
  const [showHowToPlay, setShowHowToPlay] = useState(false);

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
    if (!isRevealPhase || showAddPlayerDialog || showHowToPlay) return;
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
  }, [isRevealPhase, showAddPlayerDialog, showHowToPlay, isCardVisible, currentPlayerIndex, gameState.players.length]);

  useEffect(() => {
    if (!isRevealPhase || showAddPlayerDialog || showHowToPlay) return;

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
  }, [isRevealPhase, showAddPlayerDialog, showHowToPlay, handleRevealInteraction]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleEndGame = () => {
    playSound(gameEndSound);
    setIsGameEnded(true);
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
    <Box sx={{
      minHeight: '100dvh',
      bgcolor: 'background.default',
      backgroundImage: `radial-gradient(${alpha(theme.palette.text.primary, 0.12)} 1px, transparent 1px), radial-gradient(ellipse at 0% 0%, ${alpha('#df4038', 0.42)}, transparent 60%), radial-gradient(ellipse at 100% 100%, ${alpha('#df4038', 0.32)}, transparent 55%)`,
      backgroundSize: '20px 20px, 100% 100%, 100% 100%'
    }}>
      <Container maxWidth="sm" sx={{ py: { xs: 2, sm: 4 }, px: { xs: 2.5, sm: 3 } }}>
        <Box component="header" sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: { xs: 1, sm: 2 }, pb: 3, mb: { xs: 2, sm: 5 }, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography component="h1" sx={{ lineHeight: 1 }}>
            <Box component="span" sx={{ display: 'block', fontSize: 11, fontWeight: 800, mb: 0.75 }}>MIT MSA</Box>
            <Box component="span" sx={{ fontSize: { xs: 27, sm: 32 }, fontWeight: 900, letterSpacing: '-0.06em' }}>SPY GAME<span style={{ color: theme.palette.primary.main }}>.</span></Box>
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={() => setShowHowToPlay(true)} aria-label="How to play" title="How to play"><HelpOutlineIcon /></IconButton>
          </Box>
        </Box>

        {showHowToPlay && <HowToPlayDialog onClose={() => setShowHowToPlay(false)} timerRunning={gameState.isGameStarted && !isRevealPhase && !isGameEnded} />}

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
          {gameState.isGameStarted && !isGameEnded && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              {isRevealPhase ? <Button color="secondary" onClick={handleRestart} startIcon={<ReplayIcon />}>Restart</Button> : <Button variant="outlined" onClick={handleAddPlayerClick} startIcon={<GroupIcon />}>Add Player</Button>}
            </Box>
          )}
          {!gameState.isGameStarted ? (
            <Box>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h2" sx={{ fontSize: { xs: '2.5rem', sm: '3.3rem' }, lineHeight: 1.1 }}>Who’s the spy?</Typography>
                <Typography color="text.secondary" sx={{ mt: 1.5 }}>Pick a category, pass the phone, and keep a straight face.</Typography>
              </Box>
              <Paper variant="outlined" sx={{ p: { xs: 2.5, sm: 3.5 }, borderRadius: 2, border: '2px solid', borderColor: 'text.primary', boxShadow: `5px 5px 0 ${theme.palette.text.primary}` }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1, mb: 2.5 }}>
                  <Typography variant="h5">Set up your round</Typography>
                  <Button size="small" onClick={() => setShowHowToPlay(true)} startIcon={<HelpOutlineIcon />} sx={{ px: 0.5 }}>How to play</Button>
                </Box>
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

                    </Grid>
                  </Grid>
              </Paper>
            </Box>
          ) : isRevealPhase ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2.5, maxWidth: 440, mx: 'auto' }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="overline" color="primary">Player {currentPlayerIndex + 1} / {gameState.players.length}</Typography>
                <Typography variant="h4" sx={{ mt: 1 }}>Player {currentPlayerIndex + 1}'s Turn</Typography>
                <Typography color="text.secondary" variant="body2" sx={{ mt: 1 }}>Pass the phone. Everyone else, look away.</Typography>
              </Box>
              <RoleCard player={gameState.players[currentPlayerIndex]} visible={isCardVisible} onClick={handleRevealInteraction} hideHint="Tap to hide and pass" />
              <Box sx={{ display: 'flex', width: '100%', gap: 0.75 }} aria-label={`Player ${currentPlayerIndex + 1} of ${gameState.players.length}`}>
                {gameState.players.map((player, index) => <Box key={player.id} sx={{ flex: 1, height: 4, borderRadius: 2, bgcolor: index <= currentPlayerIndex ? 'primary.main' : 'divider' }} />)}
              </Box>
              <Typography variant="caption" color="text.secondary">Seen it? Hide it. Pass it on.</Typography>
            </Box>
          ) : (
            <>
              <Paper variant="outlined" sx={{ p: { xs: 3, sm: 4 }, borderRadius: 2, border: '2px solid', borderColor: 'text.primary', boxShadow: `5px 5px 0 ${theme.palette.text.primary}`, textAlign: 'center', mb: 3 }}>
                <Chip size="small" icon={<CategoryIcon />} label={gameState.settings.category.name} variant="outlined" sx={{ mb: 2, maxWidth: '100%' }} />
                <Typography variant="overline" component="div" color="text.secondary">Time remaining</Typography>
                <Typography component="div" aria-label={`Time Remaining: ${formatTime(gameState.currentTime)}`} sx={{ fontSize: { xs: '5rem', sm: '7rem' }, fontWeight: 750, letterSpacing: '-0.06em', lineHeight: 1.15, fontVariantNumeric: 'tabular-nums', color: !isGameEnded && gameState.currentTime <= 60 ? 'error.main' : 'text.primary' }}>{formatTime(gameState.currentTime)}</Typography>
                <Typography color={isGameEnded ? 'primary' : 'text.secondary'} sx={{ mt: 1, mb: 3 }}>{isGameEnded ? 'Game Over!' : 'Game in Progress'}</Typography>
                <LinearProgress variant="determinate" value={Math.max(0, Math.min(100, gameState.currentTime / (gameState.settings.timer * 60) * 100))} aria-label="Round time remaining" color={!isGameEnded && gameState.currentTime <= 60 ? 'error' : 'primary'} sx={{ height: 5, borderRadius: 4, bgcolor: 'divider' }} />
              </Paper>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">{isGameEnded ? 'The reveal' : 'The suspects'}</Typography>
                <Typography variant="body2" color="text.secondary">{gameState.players.length} players</Typography>
              </Box>
              <Grid container spacing={1.5}>
                {gameState.players.map(player => (
                  <Grid item xs={6} sm={isGameEnded ? 6 : 3} key={player.id}>
                    <Card variant="outlined" sx={{ p: 2.5, minHeight: isGameEnded ? 180 : 100, height: '100%', borderRadius: 3, bgcolor: isGameEnded && player.isSpy ? '#57232e' : 'background.paper', borderColor: isGameEnded && player.isSpy ? 'error.main' : 'divider' }}>
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

      </Container>
    </Box>
  );
};

export default App;
