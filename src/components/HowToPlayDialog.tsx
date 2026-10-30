import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';

const steps = [
  ['Pick your category', 'Set the players, spies, and timer. You can review the possible answers together before starting.'],
  ['Peek. Hide. Pass.', 'Pass the phone around privately. Civilians all get the same answer. Spies don’t know it. Hide your card before passing.'],
  ['Ask a few questions', 'Take turns asking questions about the answer. Give enough away to prove you know it, but not enough to help the spies.'],
  ['Find the spies', 'Discuss who’s bluffing before time runs out. End Game reveals everyone’s roles; the timer ending does too.']
];

export default function HowToPlayDialog({ onClose, timerRunning }: { onClose: () => void; timerRunning: boolean }) {
  return (
    <Dialog open onClose={onClose} maxWidth="xs" fullWidth aria-labelledby="how-to-play-title"
      PaperProps={{ sx: { m: 2, width: 'calc(100% - 32px)', maxHeight: 'calc(100dvh - 32px)' } }}>
      <DialogTitle id="how-to-play-title">How to play</DialogTitle>
      <DialogContent>
        <Box component="ol" sx={{ p: 0, m: 0, listStyle: 'none', display: 'grid', gap: 2.5 }}>
          {steps.map(([title, description], index) => (
            <Box component="li" key={title} sx={{ display: 'flex', gap: 1.5 }}>
              <Box aria-hidden="true" sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', width: 28, height: 28, flexShrink: 0, display: 'grid', placeItems: 'center', borderRadius: 1, fontWeight: 800, transform: `rotate(${index % 2 ? 4 : -4}deg)` }}>{index + 1}</Box>
              <Box><Typography sx={{ fontWeight: 800 }}>{title}</Typography><Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, lineHeight: 1.6 }}>{description}</Typography></Box>
            </Box>
          ))}
        </Box>
        {timerRunning && <Typography variant="body2" color="text.secondary" sx={{ mt: 2.5 }}>The round’s timer keeps running while this is open.</Typography>}
      </DialogContent>
      <DialogActions><Button variant="contained" fullWidth onClick={onClose}>Got it, let’s play</Button></DialogActions>
    </Dialog>
  );
}
