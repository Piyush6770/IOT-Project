import React from 'react';
import { Card, CardContent, Typography, Box, Chip, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export const KPICard = ({
  title,
  value,
  subtext,
  icon: IconComponent,
  variant = 'standard', // 'standard', 'hero-lime', 'hero-purple'
  delta, // e.g. "+15.7%" or "-8.4%"
  deltaType = 'positive', // 'positive' (green), 'negative' (coral), 'neutral'
  badgeText,
  badgeColor = 'default',
  primaryActionLabel,
  secondaryActionLabel,
  onPrimaryAction,
  onSecondaryAction,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const isHeroLime = variant === 'hero-lime';
  const isHeroPurple = variant === 'hero-purple';
  const isHero = isHeroLime || isHeroPurple;

  // Background styling
  let bgStyle = isDark ? '#17171F' : '#FFFFFF';
  let textColor = isDark ? '#F5F5F7' : '#121218';
  let subtitleColor = isDark ? '#9A9AA5' : '#646473';

  if (isHeroLime) {
    bgStyle = 'linear-gradient(135deg, #C6F26C 0%, #2FBFA0 100%)';
    textColor = '#0D0D12';
    subtitleColor = 'rgba(13, 13, 18, 0.75)';
  } else if (isHeroPurple) {
    bgStyle = 'linear-gradient(135deg, #9B7BFF 0%, #5B4CFF 100%)';
    textColor = '#FFFFFF';
    subtitleColor = 'rgba(255, 255, 255, 0.75)';
  }

  return (
    <Card
      sx={{
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        background: bgStyle,
        borderRadius: '20px', // 20px corners
        border: isHero
          ? 'none'
          : `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'}`,
        boxShadow: isHeroLime
          ? '0 12px 32px rgba(198, 242, 108, 0.3)'
          : isHeroPurple
          ? '0 12px 32px rgba(155, 123, 255, 0.3)'
          : isDark
          ? '0 8px 24px rgba(0, 0, 0, 0.35)'
          : '0 8px 24px rgba(0, 0, 0, 0.04)',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
        '&:hover': {
          transform: 'translateY(-3px)',
        },
      }}
    >
      <CardContent sx={{ p: 3, '&:last-child': { pb: 3 }, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
            <Typography
              variant="caption"
              sx={{
                color: subtitleColor,
                fontWeight: 800,
                letterSpacing: 0.8,
                textTransform: 'uppercase',
                fontSize: 11,
              }}
            >
              {title}
            </Typography>

            {/* Signed Percentage Delta Pill or Badge */}
            {delta && (
              <Chip
                label={delta}
                size="small"
                sx={{
                  fontWeight: 900,
                  fontSize: 11,
                  height: 22,
                  bgcolor:
                    deltaType === 'positive'
                      ? 'rgba(47, 191, 160, 0.15)'
                      : deltaType === 'negative'
                      ? 'rgba(255, 91, 110, 0.15)'
                      : 'rgba(255, 255, 255, 0.15)',
                  color:
                    deltaType === 'positive'
                      ? '#2FBFA0'
                      : deltaType === 'negative'
                      ? '#FF5B6E'
                      : textColor,
                  border: `1px solid ${
                    deltaType === 'positive'
                      ? '#2FBFA040'
                      : deltaType === 'negative'
                      ? '#FF5B6E40'
                      : 'transparent'
                  }`,
                }}
              />
            )}

            {!delta && badgeText && (
              <Chip
                label={badgeText}
                size="small"
                color={badgeColor}
                sx={{ fontWeight: 800, fontSize: 10, height: 20 }}
              />
            )}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'nowrap' }}>
            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant={isHero ? 'h2' : 'h3'}
                sx={{
                  fontWeight: 900,
                  color: textColor,
                  letterSpacing: '-0.03em',
                  lineHeight: 1.1,
                }}
              >
                {value}
              </Typography>
              {subtext && (
                <Typography variant="body2" sx={{ color: subtitleColor, fontWeight: 600, mt: 0.8 }}>
                  {subtext}
                </Typography>
              )}
            </Box>

            {IconComponent && !isHero && (
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  minWidth: 40,
                  borderRadius: '50%',
                  bgcolor: isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(0,0,0,0.06)',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'primary.main',
                  flexShrink: 0,
                  alignSelf: 'center',
                }}
              >
                <IconComponent sx={{ fontSize: 20 }} />
              </Box>
            )}
          </Box>
        </Box>

        {/* Hero Card Pill Action Buttons */}
        {isHero && (primaryActionLabel || secondaryActionLabel) && (
          <Box sx={{ display: 'flex', gap: 1.5, mt: 3 }}>
            {primaryActionLabel && (
              <Button
                variant="contained"
                onClick={onPrimaryAction}
                sx={{
                  bgcolor: isHeroLime ? '#0D0D12' : '#FFFFFF',
                  color: isHeroLime ? '#FFFFFF' : '#0D0D12',
                  borderRadius: '999px',
                  fontWeight: 800,
                  px: 2.5,
                  py: 0.8,
                  fontSize: 12,
                  '&:hover': {
                    bgcolor: isHeroLime ? '#1E1E28' : '#F0F0F5',
                  },
                }}
              >
                {primaryActionLabel}
              </Button>
            )}
            {secondaryActionLabel && (
              <Button
                variant="outlined"
                onClick={onSecondaryAction}
                sx={{
                  borderColor: isHeroLime ? 'rgba(13, 13, 18, 0.3)' : 'rgba(255, 255, 255, 0.4)',
                  color: textColor,
                  borderRadius: '999px',
                  fontWeight: 800,
                  px: 2.5,
                  py: 0.8,
                  fontSize: 12,
                }}
              >
                {secondaryActionLabel}
              </Button>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
