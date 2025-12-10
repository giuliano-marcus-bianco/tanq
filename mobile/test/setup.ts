import '@testing-library/react-native/extend-expect';
import { vi } from 'vitest';

// Mock expo modules
vi.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: vi.fn(),
  getCurrentPositionAsync: vi.fn(),
}));

vi.mock('expo-camera', () => ({
  Camera: {
    requestCameraPermissionsAsync: vi.fn(),
  },
}));

vi.mock('expo-image-picker', () => ({
  launchCameraAsync: vi.fn(),
  launchImageLibraryAsync: vi.fn(),
}));
