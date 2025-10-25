import React, { useState, useEffect, useRef } from 'react';
import {
  TextField,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Chip,
  Fade,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import {
  Search,
  Clear,
  History,
  TrendingUp,
  LocationOn,
} from '@mui/icons-material';

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'recent' | 'trending' | 'location';
  icon?: React.ReactNode;
}

interface EnhancedSearchProps {
  placeholder?: string;
  suggestions?: SearchSuggestion[];
  onSearch: (query: string) => void;
  onSuggestionClick?: (suggestion: SearchSuggestion) => void;
  loading?: boolean;
  showSuggestions?: boolean;
  maxSuggestions?: number;
}

const EnhancedSearch: React.FC<EnhancedSearchProps> = ({
  placeholder = '搜尋路線...',
  suggestions = [],
  onSearch,
  onSuggestionClick,
  loading = false,
  showSuggestions = true,
  maxSuggestions = 5,
}) => {
  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredSuggestions = suggestions.slice(0, maxSuggestions);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);
    setShowDropdown(value.length > 0 && showSuggestions);
    setFocusedIndex(-1);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!showDropdown) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setFocusedIndex(prev => 
          prev < filteredSuggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        setFocusedIndex(prev => 
          prev > 0 ? prev - 1 : filteredSuggestions.length - 1
        );
        break;
      case 'Enter':
        event.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < filteredSuggestions.length) {
          handleSuggestionClick(filteredSuggestions[focusedIndex]);
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setFocusedIndex(-1);
        break;
    }
  };

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query.trim());
      setShowDropdown(false);
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.text);
    setShowDropdown(false);
    onSuggestionClick?.(suggestion);
    onSearch(suggestion.text);
  };

  const clearSearch = () => {
    setQuery('');
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'recent':
        return <History fontSize="small" />;
      case 'trending':
        return <TrendingUp fontSize="small" />;
      case 'location':
        return <LocationOn fontSize="small" />;
      default:
        return <Search fontSize="small" />;
    }
  };

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      <TextField
        ref={inputRef}
        fullWidth
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => query.length > 0 && setShowDropdown(true)}
        placeholder={placeholder}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              {loading ? (
                <CircularProgress size={20} />
              ) : (
                <Search />
              )}
            </InputAdornment>
          ),
          endAdornment: query && (
            <InputAdornment position="end">
              <Clear
                onClick={clearSearch}
                sx={{ cursor: 'pointer' }}
              />
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
          },
        }}
      />

      {showDropdown && filteredSuggestions.length > 0 && (
        <Fade in={showDropdown}>
          <Paper
            ref={dropdownRef}
            elevation={3}
            sx={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              zIndex: 1000,
              mt: 1,
              maxHeight: 300,
              overflow: 'auto',
            }}
          >
            <List dense>
              {filteredSuggestions.map((suggestion, index) => (
                <ListItem
                  key={suggestion.id}
                  button
                  onClick={() => handleSuggestionClick(suggestion)}
                  selected={index === focusedIndex}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  <ListItemIcon>
                    {suggestion.icon || getSuggestionIcon(suggestion.type)}
                  </ListItemIcon>
                  <ListItemText
                    primary={suggestion.text}
                    secondary={
                      <Chip
                        label={
                          suggestion.type === 'recent' ? '最近搜尋' :
                          suggestion.type === 'trending' ? '熱門' :
                          suggestion.type === 'location' ? '地點' : ''
                        }
                        size="small"
                        color={
                          suggestion.type === 'recent' ? 'default' :
                          suggestion.type === 'trending' ? 'primary' :
                          suggestion.type === 'location' ? 'secondary' : 'default'
                        }
                      />
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Fade>
      )}
    </Box>
  );
};

export default EnhancedSearch;



