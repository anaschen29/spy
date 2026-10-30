import { Box, Card, Typography, alpha, useTheme } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
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
        border: '1px solid', borderColor: visible ? alpha(color, 0.65) : 'divider',
        background: visible ? alpha(color, 0.07) : theme.palette.background.paper,
        boxShadow: `0 18px 50px ${alpha('#000', 0.12)}`, cursor: 'pointer', borderRadius: 3,
        transition: 'border-color 180ms, background 180ms',
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
              {player.isSpy ? 'Blend in. Listen closely. Stay undiscovered.' : 'You know the answer. Can you spot who doesn’t?'}
            </Typography>
          </>
        ) : (
          <>
            <Box sx={{ display: 'inline-flex', p: 2.5, borderRadius: '50%', bgcolor: alpha(color, 0.09), color, mb: 2 }}>
              <SecurityIcon sx={{ fontSize: 36 }} />
            </Box>
            <Typography variant="h5">Your secret awaits.</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Make sure only you can see the screen.</Typography>
          </>
        )}
      </Box>
      <Typography variant="body2" sx={{ color, fontWeight: 600 }}>
        {visible ? hideHint : 'Tap or press SPACE to reveal'}
      </Typography>
    </Card>
  );
}
