import * as React from 'react';
export function useGridLogger(privateApiRef, name) {
  var logger = React.useRef(null);
  if (logger.current) {
    return logger.current;
  }
  var newLogger = privateApiRef.current.getLogger(name);
  logger.current = newLogger;
  return newLogger;
}