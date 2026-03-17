import React from 'react';
import { Link } from 'expo-router';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';

function NavLinks({ mobile = false, compact = false }: { mobile?: boolean; compact?: boolean }) {
  const itemStyle = mobile
    ? compact
      ? styles.mobileNavItemCompact
      : styles.mobileNavItem
    : styles.desktopNavItem;
  const textStyle = mobile ? styles.mobileNavText : styles.desktopNavText;

  return (
    <>
      <Link href="/bullets" asChild>
        <TouchableOpacity style={itemStyle}>
          <Text style={textStyle}>Bullet AI</Text>
        </TouchableOpacity>
      </Link>

      <Link href="/cover-letter" asChild>
        <TouchableOpacity style={itemStyle}>
          <Text style={textStyle}>Cover Letter</Text>
        </TouchableOpacity>
      </Link>

      <Link href="/resume" asChild>
        <TouchableOpacity style={itemStyle}>
          <Text style={textStyle}>Resume Generator</Text>
        </TouchableOpacity>
      </Link>

      <Link href="/profile" asChild>
        <TouchableOpacity style={itemStyle}>
          <Text style={textStyle}>Profile</Text>
        </TouchableOpacity>
      </Link>
    </>
  );
}

export default function Header() {
  const { width } = useWindowDimensions();

  if (width < 520) {
    return (
      <View style={styles.header}>
        <View style={styles.inner}>
          <View style={styles.compactTopRow}>
            <Link href="/" asChild>
              <TouchableOpacity style={styles.centeredLogoWrap}>
                <Image source={require('../assets/logo.png')} style={styles.logoCompact} />
              </TouchableOpacity>
            </Link>

            <Link href="/profile" asChild>
              <TouchableOpacity style={styles.compactCta}>
                <Text style={styles.compactCtaText}>Create Resume</Text>
              </TouchableOpacity>
            </Link>
          </View>

          <View style={styles.compactNavGrid}>
            <NavLinks mobile compact />
          </View>
        </View>
      </View>
    );
  }

  if (width < 1120) {
    return (
      <View style={styles.header}>
        <View style={styles.inner}>
          <View style={styles.mobileTopRow}>
            <View style={styles.mobileBrandSlot}>
              <Link href="/" asChild>
                <TouchableOpacity style={styles.logoWrap}>
                  <Image
                    source={require('../assets/logo.png')}
                    style={width < 700 ? styles.logoSmall : styles.logo}
                  />
                </TouchableOpacity>
              </Link>
            </View>

            <View style={styles.mobileActionSlot}>
              <Link href="/profile" asChild>
                <TouchableOpacity style={width < 700 ? styles.smallCta : styles.desktopCta}>
                  <Text style={width < 700 ? styles.smallCtaText : styles.desktopCtaText}>
                    Create Resume
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>

          <View style={styles.mobileNavRow}>
            <NavLinks mobile />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.header}>
      <View style={styles.inner}>
        <View style={styles.desktopRow}>
          <View style={styles.desktopBrandSlot}>
            <Link href="/" asChild>
              <TouchableOpacity style={styles.logoWrap}>
                <Image source={require('../assets/logo.png')} style={styles.logo} />
              </TouchableOpacity>
            </Link>
          </View>

          <View style={styles.desktopCenterNav}>
            <NavLinks />
          </View>

          <View style={styles.desktopActionSlot}>
            <Link href="/profile" asChild>
              <TouchableOpacity style={styles.desktopCta}>
                <Text style={styles.desktopCtaText}>Create Resume</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  inner: {
    width: '100%',
    maxWidth: 1240,
    alignSelf: 'center',
  },
  desktopRow: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  desktopCenterNav: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginHorizontal: 16,
  },
  desktopBrandSlot: {
    width: 240,
    alignItems: 'flex-start',
    justifyContent: 'center',
    flexShrink: 0,
  },
  desktopActionSlot: {
    width: 190,
    alignItems: 'flex-end',
    justifyContent: 'center',
    flexShrink: 0,
  },
  mobileTopRow: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mobileBrandSlot: {
    flex: 1,
    minWidth: 180,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  mobileActionSlot: {
    minWidth: 150,
    alignItems: 'flex-end',
    justifyContent: 'center',
    flexShrink: 0,
  },
  compactTopRow: {
    minHeight: 64,
    flexDirection: 'column',
    alignItems: 'center',
  },
  mobileNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    paddingTop: 8,
    marginHorizontal: -6,
  },
  compactNavGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    paddingTop: 8,
    marginHorizontal: -4,
  },
  logoWrap: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredLogoWrap: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  logo: {
    width: 220,
    height: 60,
    resizeMode: 'contain',
  },
  logoSmall: {
    width: 180,
    height: 50,
    resizeMode: 'contain',
  },
  logoCompact: {
    width: 170,
    height: 48,
    resizeMode: 'contain',
  },
  desktopNavItem: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginHorizontal: 2,
  },
  desktopNavText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
  },
  mobileNavItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 6,
  },
  mobileNavItemCompact: {
    width: '50%',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 8,
    marginBottom: 4,
  },
  mobileNavText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
    textAlign: 'center',
  },
  desktopCta: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 14,
  },
  desktopCtaText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  smallCta: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  smallCtaText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  compactCta: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
    alignSelf: 'center',
  },
  compactCtaText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
