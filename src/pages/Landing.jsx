import React from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Container,
  Paper,
  Divider,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import StarIcon from '@mui/icons-material/Star';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ChatBubbleOutlinedIcon from '@mui/icons-material/ChatBubbleOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SensorsIcon from '@mui/icons-material/Sensors';
import SpeedIcon from '@mui/icons-material/Speed';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import ShareIcon from '@mui/icons-material/Share';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';

import { ChairLogo } from '../components/ChairLogo';
import { useNavigate } from 'react-router-dom';
import heroChairImg from '../assets/hero-chair.png';

// ─── Reusable sub-components ────────────────────────────────────────────────

// Speech bubble card — matches the orange/tinted floating bubbles in the reference
const SpeechBubble = ({ icon: Icon, iconBg, iconColor, quote, tailSide = 'bottomLeft', delay = 0, animKey = 1 }) => (
  <Box
    sx={{
      animation: `floatBubble${animKey} ${3.5 + animKey * 0.4}s ease-in-out infinite`,
      [`@keyframes floatBubble${animKey}`]: {
        '0%, 100%': { transform: `translateY(0px) rotate(${animKey % 2 === 0 ? 1 : -1}deg)` },
        '50%': { transform: `translateY(${-8 - animKey * 1.5}px) rotate(${animKey % 2 === 0 ? -0.5 : 0.5}deg)` },
      },
      animationDelay: `${delay}s`,
    }}
  >
    <Paper
      elevation={0}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        p: '12px 18px',
        borderRadius:
          tailSide === 'bottomLeft' ? '18px 18px 18px 4px' :
          tailSide === 'bottomRight' ? '18px 18px 4px 18px' :
          tailSide === 'topLeft' ? '4px 18px 18px 18px' : '18px 4px 18px 18px',
        bgcolor: iconBg.replace(')', ', 0.18)').replace('rgba(', 'rgba(').replace('rgb(', 'rgba('),
        backdropFilter: 'blur(20px)',
        border: `1px solid ${iconColor}30`,
        boxShadow: `0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px ${iconColor}15`,
        maxWidth: 240,
        minWidth: 170,
      }}
    >
      <Avatar sx={{ bgcolor: iconBg, color: iconColor, width: 34, height: 34, flexShrink: 0 }}>
        <Icon sx={{ fontSize: 17 }} />
      </Avatar>
      <Typography sx={{ fontWeight: 800, color: '#F5F5F7', fontSize: 12.5, lineHeight: 1.35 }}>
        {quote}
      </Typography>
    </Paper>
  </Box>
);

// Facebook-style social profile card
const SocialProfileCard = ({ delay = 0 }) => (
  <Box
    sx={{
      animation: 'floatCard1 5.5s ease-in-out infinite',
      '@keyframes floatCard1': {
        '0%, 100%': { transform: 'translateY(0px) rotate(1.5deg)' },
        '50%': { transform: 'translateY(-14px) rotate(0.5deg)' },
      },
      animationDelay: `${delay}s`,
    }}
  >
    <Card
      sx={{
        width: 248,
        borderRadius: '16px',
        bgcolor: 'rgba(22, 22, 32, 0.92)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.12)',
        boxShadow: '0 24px 60px rgba(0,0,0,0.65)',
        overflow: 'hidden',
      }}
    >
      {/* Cover image / header band */}
      <Box
        sx={{
          height: 64,
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          position: 'relative',
        }}
      >
        <Box sx={{ position: 'absolute', bottom: -20, left: 14 }}>
          <Avatar
            sx={{
              width: 42,
              height: 42,
              bgcolor: '#121218',
              border: '2px solid rgba(255,255,255,0.18)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
            }}
          >
            <ChairLogo size={26} color="#F5F5F7" />
          </Avatar>
        </Box>
      </Box>

      <CardContent sx={{ pt: 3.5, pb: '14px !important', px: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.6 }}>
          <Box>
            <Typography sx={{ fontWeight: 900, fontSize: 13.5, color: '#F5F5F7', lineHeight: 1.2 }}>
              Smart Chair IoT
            </Typography>
            <Typography sx={{ fontSize: 10.5, color: '#9A9AA5', mt: 0.3 }}>
              Real-time posture &amp; sedentary analytics
            </Typography>
          </Box>
          <Button
            size="small"
            variant="contained"
            sx={{
              borderRadius: '999px',
              fontSize: 10,
              fontWeight: 900,
              py: 0.4,
              px: 1.5,
              minWidth: 0,
              background: 'linear-gradient(135deg, #C6F26C, #2FBFA0)',
              color: '#0D0D12',
            }}
          >
            Follow
          </Button>
        </Box>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.07)', my: 1.2 }} />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ThumbUpIcon sx={{ fontSize: 12, color: '#9B7BFF' }} />
            <Typography sx={{ fontSize: 11, color: '#9A9AA5' }}>
              <Box component="span" sx={{ fontWeight: 800, color: '#C6F26C' }}>1,420+</Box>
              &nbsp;hours monitored
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckCircleIcon sx={{ fontSize: 12, color: '#2FBFA0' }} />
            <Typography sx={{ fontSize: 11, color: '#9A9AA5' }}>
              <Box component="span" sx={{ fontWeight: 800, color: '#F5F5F7' }}>34</Box>
              &nbsp;chairs connected
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  </Box>
);

// Feature post card (workspace photo + headline + stats row)
const FeaturePostCard = ({ headline, tagline, imgSrc, likes, comments, shares, delay = 0, rotate = 0 }) => (
  <Box
    sx={{
      animation: 'floatPostCard 6s ease-in-out infinite',
      '@keyframes floatPostCard': {
        '0%, 100%': { transform: `translateY(0px) rotate(${rotate}deg)` },
        '50%': { transform: `translateY(-12px) rotate(${rotate - 0.8}deg)` },
      },
      animationDelay: `${delay}s`,
    }}
  >
    <Card
      sx={{
        width: 242,
        borderRadius: '16px',
        bgcolor: 'rgba(22, 22, 32, 0.92)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.12)',
        boxShadow: '0 20px 56px rgba(0,0,0,0.6)',
        overflow: 'hidden',
      }}
    >
      <CardContent sx={{ p: '14px !important' }}>
        {/* Header row */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ width: 28, height: 28, bgcolor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.18)' }}>
              <ChairLogo size={16} color="#F5F5F7" />
            </Avatar>
            <Box>
              <Typography sx={{ fontWeight: 800, fontSize: 11, color: '#F5F5F7', lineHeight: 1 }}>Smart Chair</Typography>
              <Typography sx={{ fontSize: 9.5, color: '#9A9AA5' }}>2h ago</Typography>
            </Box>
          </Box>
          <MoreHorizIcon sx={{ fontSize: 16, color: '#9A9AA5' }} />
        </Box>

        <Typography sx={{ fontWeight: 900, fontSize: 13, color: '#F5F5F7', mb: 0.4, lineHeight: 1.25 }}>
          {headline}
        </Typography>
        <Typography sx={{ fontSize: 10.5, color: '#9A9AA5', mb: 1.2, lineHeight: 1.3 }}>
          {tagline}
        </Typography>

        {/* Photo */}
        <Box
          component="img"
          src={imgSrc}
          alt={headline}
          sx={{
            width: '100%',
            height: 110,
            objectFit: 'cover',
            borderRadius: '10px',
            mb: 1.2,
            display: 'block',
          }}
        />

        {/* Reaction row */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#9A9AA5' }}>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
              <FavoriteIcon sx={{ fontSize: 13, color: '#FF5B6E' }} />
              <Typography sx={{ fontSize: 10.5, fontWeight: 800 }}>{likes}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
              <ChatBubbleOutlinedIcon sx={{ fontSize: 12 }} />
              <Typography sx={{ fontSize: 10.5, fontWeight: 800 }}>{comments}</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
            <ShareIcon sx={{ fontSize: 12 }} />
            <Typography sx={{ fontSize: 10.5, fontWeight: 800 }}>{shares}</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  </Box>
);

// ─── Main Landing Page ────────────────────────────────────────────────────────

export const Landing = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => navigate('/login');
  const handleScrollToFeatures = () => {
    const el = document.getElementById('features-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#09090D', color: '#F5F5F7', overflowX: 'hidden' }}>

      {/* ── NAVBAR ─────────────────────────────────────────────────────────── */}
      <Box
        component="header"
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          py: 1.8,
          px: { xs: 2, sm: 4, md: 6 },
          bgcolor: 'rgba(9,9,13,0.82)',
          backdropFilter: 'blur(22px)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <Box sx={{ maxWidth: 1300, mx: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Brand */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }} onClick={() => navigate('/')}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                bgcolor: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <ChairLogo size={20} color="#F5F5F7" />
            </Box>
            <Typography sx={{ fontWeight: 900, fontSize: 19, letterSpacing: '-0.02em' }}>
              Smart Chair
            </Typography>
          </Box>

          {/* Center links */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3.5 }}>
            {['Features', 'SBI Science', 'Reviews'].map((link) => (
              <Typography
                key={link}
                onClick={handleScrollToFeatures}
                sx={{ fontSize: 14, fontWeight: 700, color: '#9A9AA5', cursor: 'pointer', '&:hover': { color: '#F5F5F7' }, transition: 'color 0.2s' }}
              >
                {link}
              </Typography>
            ))}
          </Box>

          {/* CTAs */}
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
            <Button
              onClick={() => navigate('/login')}
              sx={{ borderRadius: '999px', border: '1px solid rgba(255,255,255,0.18)', color: '#F5F5F7', fontWeight: 800, px: 2.5, fontSize: 13 }}
            >
              Login
            </Button>
            <Button
              variant="contained"
              onClick={handleGetStarted}
              sx={{
                borderRadius: '999px',
                background: 'linear-gradient(135deg, #C6F26C 0%, #2FBFA0 100%)',
                color: '#0D0D12',
                fontWeight: 900,
                px: 3,
                fontSize: 13,
                boxShadow: '0 4px 20px rgba(198,242,108,0.3)',
              }}
            >
              Get Started
            </Button>
          </Box>
        </Box>
      </Box>

      {/* ── HERO STAGE ─────────────────────────────────────────────────────── */}
      <Box
        sx={{
          position: 'relative',
          pt: { xs: 5, md: 7 },
          pb: { xs: 6, md: 10 },
          px: { xs: 2, sm: 3, md: 5 },
          maxWidth: 1340,
          mx: 'auto',
        }}
      >
        {/* Large ambient radial glow — matches the purple/gray spotlight in reference */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -55%)',
            width: { xs: 300, md: 680 },
            height: { xs: 300, md: 680 },
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(100,90,160,0.28) 0%, rgba(60,60,100,0.15) 45%, transparent 72%)',
            filter: 'blur(60px)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        {/* Headline block */}
        <Box sx={{ textAlign: 'center', maxWidth: 860, mx: 'auto', mb: { xs: 5, md: 7 }, position: 'relative', zIndex: 2 }}>
          <Chip
            icon={<SensorsIcon sx={{ color: '#C6F26C !important', fontSize: '14px !important' }} />}
            label="NEXT-GEN IoT ERGONOMIC TELEMETRY"
            sx={{
              bgcolor: 'rgba(198,242,108,0.1)',
              color: '#C6F26C',
              border: '1px solid rgba(198,242,108,0.28)',
              fontWeight: 900,
              fontSize: 10.5,
              letterSpacing: 0.8,
              mb: 3,
              height: 30,
            }}
          />

          <Typography
            variant="h1"
            sx={{
              fontWeight: 900,
              fontSize: { xs: '2.2rem', sm: '3.2rem', md: '4rem' },
              lineHeight: 1.07,
              letterSpacing: '-0.03em',
              color: '#F5F5F7',
              mb: 2.5,
            }}
          >
            The Smart Chair That Watches<br />Your Posture So You Don't Have To.
          </Typography>

          <Typography
            sx={{
              color: '#9A9AA5',
              fontSize: { xs: '1rem', md: '1.18rem' },
              fontWeight: 500,
              lineHeight: 1.55,
              maxWidth: 640,
              mx: 'auto',
              mb: 4.5,
            }}
          >
            Real-time 4-quadrant FSR pressure tracking, cardiovascular signals, and automated Sedentary Behaviour Index alerts — so your posture corrects itself.
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              onClick={handleGetStarted}
              endIcon={<ArrowForwardIcon />}
              sx={{
                borderRadius: '999px',
                background: 'linear-gradient(135deg, #C6F26C 0%, #2FBFA0 100%)',
                color: '#0D0D12',
                fontWeight: 900,
                fontSize: 15,
                px: 4,
                py: 1.5,
                boxShadow: '0 8px 28px rgba(198,242,108,0.35)',
              }}
            >
              Get Started Now
            </Button>
            <Button
              onClick={handleScrollToFeatures}
              sx={{
                borderRadius: '999px',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#F5F5F7',
                fontWeight: 800,
                fontSize: 15,
                px: 3.5,
                py: 1.5,
              }}
            >
              See How It Works
            </Button>
          </Box>
        </Box>

        {/* ── DESKTOP FLOATING STAGE ─────────────────────────────────── */}
        <Box
          sx={{
            display: { xs: 'none', lg: 'block' },
            position: 'relative',
            height: 600,
            maxWidth: 1180,
            mx: 'auto',
            zIndex: 2,
          }}
        >
          {/* ── CENTERPIECE: Real chair photo ── */}
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Spotlight behind chair */}
            <Box
              sx={{
                position: 'absolute',
                width: 420,
                height: 420,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(160,140,255,0.2) 0%, rgba(80,60,160,0.1) 45%, transparent 70%)',
                filter: 'blur(40px)',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 0,
              }}
            />
            {/* Chair photo */}
            <Box
              component="img"
              src={heroChairImg}
              alt="Smart Chair Ergonomic Product"
              sx={{
                position: 'relative',
                zIndex: 1,
                width: 320,
                height: 'auto',
                objectFit: 'contain',
                filter: 'drop-shadow(0 40px 60px rgba(0,0,0,0.75))',
              }}
            />
            {/* Floor reflection ellipse */}
            <Box
              sx={{
                width: 280,
                height: 16,
                borderRadius: '50%',
                bgcolor: 'rgba(0,0,0,0.5)',
                filter: 'blur(14px)',
                mt: -1.5,
                zIndex: 0,
              }}
            />
          </Box>

          {/* ── TOP-LEFT: Heart speech bubble ── */}
          <Box sx={{ position: 'absolute', top: '5%', left: '3%', zIndex: 5 }}>
            <SpeechBubble
              icon={FavoriteIcon}
              iconBg="rgba(255,91,110,0.85)"
              iconColor="#FF5B6E"
              quote='"Finally a chair that adapts to me."'
              tailSide="bottomLeft"
              delay={0}
              animKey={1}
            />
          </Box>

          {/* ── LEFT: Facebook-style social profile card ── */}
          <Box sx={{ position: 'absolute', top: '28%', left: '0%', zIndex: 5 }}>
            <SocialProfileCard delay={0.4} />
          </Box>

          {/* ── TOP-CENTER: Comment speech bubble ── */}
          <Box sx={{ position: 'absolute', top: '3%', left: '38%', zIndex: 5 }}>
            <SpeechBubble
              icon={PersonOutlinedIcon}
              iconBg="rgba(155,123,255,0.6)"
              iconColor="#9B7BFF"
              quote='"All-day comfort. Zero back pain."'
              tailSide="bottomRight"
              delay={0.6}
              animKey={2}
            />
          </Box>

          {/* ── TOP-RIGHT: Feature post card ── */}
          <Box sx={{ position: 'absolute', top: '2%', right: '1%', zIndex: 5 }}>
            <FeaturePostCard
              headline="Dynamic Ergonomic Chair"
              tagline="Engineered for Comfort, Designed for Performance."
              imgSrc="https://images.unsplash.com/photo-1580481072645-022f9a6d83d0?w=500&q=80"
              likes="3.2k"
              comments="138"
              shares="276"
              delay={0.2}
              rotate={1.5}
            />
          </Box>

          {/* ── BOTTOM-LEFT: Star speech bubble ── */}
          <Box sx={{ position: 'absolute', bottom: '7%', left: '5%', zIndex: 5 }}>
            <SpeechBubble
              icon={StarIcon}
              iconBg="rgba(255,176,32,0.75)"
              iconColor="#FFB020"
              quote='"Best investment for my workspace."'
              tailSide="topLeft"
              delay={0.8}
              animKey={3}
            />
          </Box>

          {/* ── BOTTOM-CENTER-RIGHT: Thumbs-up speech bubble ── */}
          <Box sx={{ position: 'absolute', bottom: '3%', left: '40%', zIndex: 5 }}>
            <SpeechBubble
              icon={ThumbUpIcon}
              iconBg="rgba(47,191,160,0.75)"
              iconColor="#2FBFA0"
              quote='"Supports focus, boosts productivity."'
              tailSide="topRight"
              delay={1.0}
              animKey={4}
            />
          </Box>

          {/* ── BOTTOM-RIGHT: Second post card ── */}
          <Box sx={{ position: 'absolute', bottom: '2%', right: '1%', zIndex: 5 }}>
            <FeaturePostCard
              headline="Smart Chair — Home Office"
              tagline="Built for bigger builds. Support that moves with you."
              imgSrc="https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=500&q=80"
              likes="2.1k"
              comments="86"
              shares="162"
              delay={0.5}
              rotate={-1.5}
            />
          </Box>
        </Box>

        {/* ── MOBILE / TABLET FALLBACK ──────────────────────────────────── */}
        <Box sx={{ display: { xs: 'flex', lg: 'none' }, flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          {/* Chair photo */}
          <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box
              sx={{
                position: 'absolute',
                width: 340,
                height: 340,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(160,140,255,0.22) 0%, transparent 70%)',
                filter: 'blur(36px)',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%,-50%)',
              }}
            />
            <Box
              component="img"
              src={heroChairImg}
              alt="Smart Chair Product"
              sx={{ width: '100%', maxWidth: 280, objectFit: 'contain', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.7))', position: 'relative', zIndex: 1 }}
            />
          </Box>

          {/* Stacked mobile cards */}
          <Grid container spacing={2} sx={{ maxWidth: 560 }}>
            {[
              { icon: FavoriteIcon, iconBg: 'rgba(255,91,110,0.85)', iconColor: '#FF5B6E', quote: '"Finally a chair that adapts to me."', tail: 'bottomLeft', ak: 1 },
              { icon: StarIcon, iconBg: 'rgba(255,176,32,0.75)', iconColor: '#FFB020', quote: '"Best investment for my workspace."', tail: 'bottomLeft', ak: 2 },
              { icon: ThumbUpIcon, iconBg: 'rgba(47,191,160,0.75)', iconColor: '#2FBFA0', quote: '"Supports focus, boosts productivity."', tail: 'bottomRight', ak: 3 },
              { icon: PersonOutlinedIcon, iconBg: 'rgba(155,123,255,0.6)', iconColor: '#9B7BFF', quote: '"All-day comfort. Zero back pain."', tail: 'bottomRight', ak: 4 },
            ].map((b, i) => (
              <Grid item xs={12} sm={6} key={i}>
                <SpeechBubble icon={b.icon} iconBg={b.iconBg} iconColor={b.iconColor} quote={b.quote} tailSide={b.tail} delay={i * 0.2} animKey={b.ak} />
              </Grid>
            ))}
          </Grid>

          <SocialProfileCard delay={0.5} />
        </Box>
      </Box>

      {/* ── FEATURES SECTION ─────────────────────────────────────────────── */}
      <Box
        id="features-section"
        sx={{
          py: 10,
          px: { xs: 2, sm: 4, md: 6 },
          bgcolor: '#121218',
          borderTop: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="h3"
              sx={{ fontWeight: 900, letterSpacing: '-0.025em', mb: 1.5 }}
            >
              Built on Posture Science &amp; Cardiovascular Health
            </Typography>
            <Typography sx={{ color: '#9A9AA5', fontSize: '1.05rem', maxWidth: 580, mx: 'auto' }}>
              How embedded pressure sensors and physiological telemetry optimize seating ergonomics in real time.
            </Typography>
          </Box>

          <Grid container spacing={3.5}>
            {[
              {
                icon: SensorsIcon,
                color: '#C6F26C',
                bg: 'rgba(198,242,108,0.12)',
                title: '4-Zone FSR Cushion Sensing',
                desc: 'Measures weight distribution across P1–P4 quadrants to detect slouching, forward lean, and asymmetrical hip loading every 2 seconds.',
              },
              {
                icon: SpeedIcon,
                color: '#9B7BFF',
                bg: 'rgba(155,123,255,0.12)',
                title: 'Sedentary Behaviour Index',
                desc: 'Calculates a live health score from sitting duration, posture stability, and micro-break compliance to prevent vascular stagnation.',
              },
              {
                icon: HealthAndSafetyIcon,
                color: '#2FBFA0',
                bg: 'rgba(47,191,160,0.12)',
                title: 'Physiological Telemetry',
                desc: 'Integrates MAX30102 pulse sensing and thermistor skin temperature monitoring for holistic cardiovascular strain detection.',
              },
            ].map((f) => (
              <Grid item xs={12} md={4} key={f.title}>
                <Card sx={{ height: '100%', p: 0.5 }}>
                  <CardContent>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '14px',
                        bgcolor: f.bg,
                        color: f.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                      }}
                    >
                      <f.icon sx={{ fontSize: 26 }} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 900, mb: 1 }}>
                      {f.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.65 }}>
                      {f.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── BOTTOM CTA BANNER ─────────────────────────────────────────────── */}
      <Box sx={{ py: 10, px: 3, textAlign: 'center', bgcolor: '#09090D' }}>
        <Container maxWidth="md">
          <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: '-0.025em', mb: 2 }}>
            Ready for Healthier Seating?
          </Typography>
          <Typography sx={{ color: '#9A9AA5', fontSize: '1.05rem', mb: 4.5 }}>
            Access the live Smart Chair dashboard, view FSR telemetry, and track your posture health score.
          </Typography>
          <Button
            variant="contained"
            onClick={handleGetStarted}
            size="large"
            endIcon={<ArrowForwardIcon />}
            sx={{
              borderRadius: '999px',
              background: 'linear-gradient(135deg, #C6F26C 0%, #2FBFA0 100%)',
              color: '#0D0D12',
              fontWeight: 900,
              px: 5,
              py: 1.8,
              fontSize: 16,
              boxShadow: '0 8px 32px rgba(198,242,108,0.4)',
            }}
          >
            Launch Smart Chair Dashboard
          </Button>
        </Container>
      </Box>
    </Box>
  );
};
