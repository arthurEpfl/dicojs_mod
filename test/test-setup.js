import mock from 'mock-require';

// Mock the 'isomorphic-wrtc' module
mock('isomorphic-wrtc', {});

// Load the rest of your test files
import '../src/core/weights/aggregation.spec.ts';