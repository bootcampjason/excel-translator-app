import React from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'ko', label: 'Korean' },
  { code: 'ja', label: 'Japanese' },
  { code: 'zh', label: 'Chinese' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
  { code: 'de', label: 'German' },
  { code: 'vi', label: 'Vietnamese' },
  { code: 'id', label: 'Indonesian' },
];

function LanguageSelector({ sourceLang, targetLang, onChange }) {
  return (
    <Box display="flex" gap={4} mt={3}>
      <FormControl fullWidth>
        <InputLabel>Source Language</InputLabel>
        <Select
          value={sourceLang}
          label="Source Language"
          onChange={(e) => onChange('source', e.target.value)}
        >
          {languages.map((lang) => (
            <MenuItem key={lang.code} value={lang.code}>
              {lang.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel>Target Language</InputLabel>
        <Select
          value={targetLang}
          label="Target Language"
          onChange={(e) => onChange('target', e.target.value)}
        >
          {languages.map((lang) => (
            <MenuItem key={lang.code} value={lang.code}>
              {lang.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

export default LanguageSelector;
