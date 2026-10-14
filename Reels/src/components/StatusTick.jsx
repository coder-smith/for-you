import React from 'react';
import { SingleCheckIcon, DoubleCheckIcon, ClockIcon } from '../utils/svgIcons';

export default function StatusTick({ status = 'seen', isOverlay = false, size = 26 }) {
  const grayColor = isOverlay ? '#ffffff' : '#8696a0';
  const blueColor = '#53bdeb';

  switch (status) {
    case 'clock':
    case 'sending':
    case 'pending':
      return <ClockIcon size={Math.round(size * 0.8)} color={grayColor} />;

    case 'sent':
    case 'single':
    case 'single-tick':
      return <SingleCheckIcon size={size} color={grayColor} />;

    case 'delivered':
    case 'double':
    case 'double-tick':
      return <DoubleCheckIcon size={size + 2} color={grayColor} />;

    case 'seen':
    case 'read':
    case 'blue':
    case 'blue-tick':
    default:
      return <DoubleCheckIcon size={size + 2} color={blueColor} />;
  }
}
