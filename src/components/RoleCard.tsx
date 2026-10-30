import { Box, Card, Typography, useTheme } from '@mui/material';
import { Player } from '../types/game';

interface RoleCardProps {
  player: Player;
  visible: boolean;
  onClick: () => void;
  hideHint: string;
}

export default function RoleCard({ player, visible, onClick, hideHint }: RoleCardProps) {
  const theme = useTheme();
  const color = visible && player.isSpy ? theme.palette.error.main : theme.palette.primary.main;
  return (
    <Card
      component="button"
      type="button"
      onClick={onClick}
      aria-label={visible ? 'Hide player role' : 'Reveal player role'}
      aria-pressed={visible}
      sx={{
        width: '100%', maxWidth: 440, minHeight: { xs: 310, sm: 360 },
        p: { xs: 3, sm: 4 }, display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'space-between', gap: 3, color: 'text.primary', font: 'inherit',
        border: '2px solid', borderColor: 'text.primary',
        background: visible ? theme.palette.background.paper : theme.palette.mode === 'dark' ? '#584723' : '#ffe28a',
        boxShadow: `5px 5px 0 ${theme.palette.text.primary}`, cursor: 'pointer', borderRadius: 2,
        transition: 'background 180ms',
        '&:hover': { borderColor: color },
        '&:focus-visible': { outline: `3px solid ${color}`, outlineOffset: 4 }
      }}
    >
      <Typography variant="overline" color="text.secondary">Player {player.id} · Keep it secret</Typography>
      <Box key={visible ? 'revealed' : 'hidden'} sx={{ animation: 'role-reveal 220ms ease-out', width: '100%' }}>
        {visible ? (
          <>
            <Typography variant="overline" sx={{ color }}>{player.isSpy ? 'SPY' : 'CIVILIAN'}</Typography>
            <Typography variant="h4" sx={{ mt: 1, fontSize: { xs: '1.8rem', sm: '2.3rem' }, overflowWrap: 'anywhere' }}>
              {player.isSpy ? 'You are the Spy!' : player.location}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              {player.isSpy ? 'Act natural. You’ve got this. Probably.' : 'You’re in on it. Don’t make it too obvious.'}
            </Typography>
          </>
        ) : (
          <>
            <svg viewBox="0 0 160 80" width="160" height="80" aria-hidden="true" style={{ marginBottom: 16 }}>
              <ellipse cx="43" cy="40" rx="30" ry="35" fill="#fffdf6" stroke="#242337" strokeWidth="3" />
              <ellipse cx="117" cy="40" rx="30" ry="35" fill="#fffdf6" stroke="#242337" strokeWidth="3" />
              <circle cx="53" cy="43" r="11" fill="#242337" />
              <circle cx="127" cy="43" r="11" fill="#242337" />
            </svg>
            <Typography variant="h5">No peeking.</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>This one’s just for you.</Typography>
          </>
        )}
      </Box>
      <Typography variant="body2" sx={{ color, fontWeight: 600 }}>
        {visible ? hideHint : 'Tap or press SPACE to reveal'}
      </Typography>
    </Card>
  );
}
