import { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { Category } from '../types/game';

interface CategoryOptionsDialogProps {
  category: Category;
  onClose: () => void;
}

export default function CategoryOptionsDialog({ category, onClose }: CategoryOptionsDialogProps) {
  const [search, setSearch] = useState('');
  const isMobile = useMediaQuery(useTheme().breakpoints.down('sm'));
  const query = search.trim().toLowerCase();
  const options = [...category.locations]
    .sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }))
    .filter(option => option.name.toLowerCase().includes(query));

  return (
    <Dialog
      open
      onClose={onClose}
      aria-labelledby="category-options-title"
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
      scroll="paper"
    >
      <DialogTitle id="category-options-title">{category.name} options</DialogTitle>
      <DialogContent dividers>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          Review the possible answers together before starting the game.
        </Typography>
        <TextField
          autoFocus={!isMobile}
          fullWidth
          type="search"
          label="Search options"
          value={search}
          onChange={event => setSearch(event.target.value)}
          sx={{ mb: 2 }}
        />
        <Typography variant="body2" color="text.secondary" role="status" sx={{ mb: 2 }}>
          Showing {options.length} of {category.locations.length} options
        </Typography>
        {options.length > 0 ? (
          <Box
            component="ul"
            aria-label={`${category.name} possible answers`}
            sx={{
              m: 0,
              pl: 3,
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 1,
              columnGap: 4
            }}
          >
            {options.map((option, index) => (
              <Typography component="li" key={`${option.name}-${index}`} sx={{ overflowWrap: 'anywhere' }}>
                {option.name}
              </Typography>
            ))}
          </Box>
        ) : (
          <Typography>No options match your search.</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">Done</Button>
      </DialogActions>
    </Dialog>
  );
}
