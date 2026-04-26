import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Animated,
  Platform,
  BackHandler,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { WebView } from 'react-native-webview';
import * as ScreenCapture from 'expo-screen-capture';
import * as SplashScreen from 'expo-splash-screen';

// Prevent the native splash from auto-hiding
SplashScreen.preventAutoHideAsync();

const WEBAPP_URL = 'https://vesyllabus.fwh.is';
const SPLASH_DURATION = 2500; // ms

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [webViewLoaded, setWebViewLoaded] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const webViewRef = useRef(null);

  // --- Screenshot Prevention ---
  useEffect(() => {
    // Prevent screenshots on both platforms
    const subscription = ScreenCapture.addScreenshotListener(() => {
      // Optionally alert user; currently just silently blocks
    });

    ScreenCapture.preventScreenCaptureAsync();

    return () => {
      subscription.remove();
      ScreenCapture.allowScreenCaptureAsync();
    };
  }, []);

  // --- Splash Screen Logic ---
  useEffect(() => {
    // Animate logo scale-up on mount
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      // Fade out the custom splash
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setShowSplash(false);
      });
    }, SPLASH_DURATION);

    return () => clearTimeout(timer);
  }, []);

  // Hide native splash once our component mounts
  const onLayoutRootView = useCallback(async () => {
    await SplashScreen.hideAsync();
  }, []);

  // --- Android Back Button for WebView ---
  useEffect(() => {
    if (Platform.OS !== 'android') return;

    const onBackPress = () => {
      if (webViewRef.current) {
        webViewRef.current.goBack();
        return true; // prevent default behavior
      }
      return false;
    };

    BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () =>
      BackHandler.removeEventListener('hardwareBackPress', onBackPress);
  }, []);

  // --- Injected JS to prevent long-press save and context menus ---
  const INJECTED_JS = `
    (function() {
      // Disable context menu (long press)
      document.addEventListener('contextmenu', function(e) { e.preventDefault(); });
      // Disable text selection
      document.body.style.webkitUserSelect = 'none';
      document.body.style.userSelect = 'none';
      // Disable image dragging
      document.querySelectorAll('img').forEach(function(img) {
        img.setAttribute('draggable', 'false');
      });
      true;
    })();
  `;

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      <StatusBar style="dark" translucent backgroundColor="transparent" />

      {/* WebView always mounted in the background so it pre-loads */}
      <View style={[styles.webViewContainer, showSplash && styles.hidden]}>
        <SafeAreaView style={styles.safeArea}>
          <WebView
            ref={webViewRef}
            source={{ uri: WEBAPP_URL }}
            style={styles.webview}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            allowsBackForwardNavigationGestures={true}
            injectedJavaScript={INJECTED_JS}
            onLoadEnd={() => setWebViewLoaded(true)}
            renderLoading={() => (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#D32F2F" />
              </View>
            )}
            // Security: prevent opening external links in system browser
            onShouldStartLoadWithRequest={(request) => {
              return request.url.startsWith(WEBAPP_URL) || 
                     request.url.startsWith('https://vesyllabus.fwh.is');
            }}
          />
        </SafeAreaView>
      </View>

      {/* Custom Splash Screen Overlay */}
      {showSplash && (
        <Animated.View
          style={[
            styles.splashContainer,
            { opacity: fadeAnim },
          ]}
        >
          <View style={styles.splashGradient}>
            <Animated.Image
              source={require('./assets/splash-icon.png')}
              style={[
                styles.splashLogo,
                { transform: [{ scale: scaleAnim }] },
              ]}
              resizeMode="contain"
            />
            <View style={styles.splashTextContainer}>
              <Animated.Text
                style={[
                  styles.splashTitle,
                  { opacity: fadeAnim },
                ]}
              >
                VE Syllabus
              </Animated.Text>
              <Animated.Text
                style={[
                  styles.splashSubtitle,
                  { opacity: fadeAnim },
                ]}
              >
                Your Complete Study Companion
              </Animated.Text>
            </View>
            <ActivityIndicator
              size="small"
              color="#D32F2F"
              style={styles.splashLoader}
            />
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  // --- WebView ---
  webViewContainer: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  webview: {
    flex: 1,
  },
  hidden: {
    position: 'absolute',
    width: 0,
    height: 0,
    opacity: 0,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  // --- Splash ---
  splashContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
  },
  splashGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  splashLogo: {
    width: 180,
    height: 180,
    marginBottom: 24,
  },
  splashTextContainer: {
    alignItems: 'center',
  },
  splashTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#D32F2F',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  splashSubtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#555555',
    letterSpacing: 0.5,
  },
  splashLoader: {
    marginTop: 40,
  },
});
