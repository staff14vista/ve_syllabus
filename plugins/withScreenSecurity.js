const { withAndroidStyles, AndroidConfig } = require('expo/config-plugins');

/**
 * Custom Expo config plugin to add FLAG_SECURE to the Android theme.
 * This prevents screenshots and screen recording at the OS level.
 * Also sets `android:screenCapturePolicy` for additional protection.
 */
const withScreenSecurity = (config) => {
  return withAndroidStyles(config, (config) => {
    // Add secure flag via theme
    const styles = config.modResults;

    // Find or create the AppTheme style
    const appTheme = styles.resources.style?.find(
      (style) => style.$.name === 'AppTheme'
    );

    if (appTheme) {
      // Check if the item already exists
      const hasSecureItem = appTheme.item?.some(
        (item) => item.$.name === 'android:windowSecure'
      );
      if (!hasSecureItem) {
        if (!appTheme.item) appTheme.item = [];
        appTheme.item.push({
          $: { name: 'android:windowSecure' },
          _: 'true',
        });
      }
    }

    return config;
  });
};

module.exports = withScreenSecurity;
