import { useLiveTelemetry } from './useLiveTelemetry';

// Export both for backward compatibility and clean naming
export const useSimulatedWebSocket = (intervalMs = 2000) => {
  return useLiveTelemetry('CHAIR001');
};

export { useLiveTelemetry };
export default useLiveTelemetry;
