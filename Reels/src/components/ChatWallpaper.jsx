import React from 'react';

export default function ChatWallpaper({ opacity = 0.06 }) {
  return (
    <div className="whatsapp-wallpaper-container" aria-hidden="true">
      <svg className="whatsapp-wallpaper-svg" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        <defs>
          <pattern id="wa-doodle-pattern" x="0" y="0" width="360" height="360" patternUnits="userSpaceOnUse">
            <g stroke="#ffffff" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={opacity}>
              {/* Chat Bubble 1 */}
              <path d="M 30 35 C 30 25, 60 25, 60 35 C 60 45, 45 45, 40 50 L 35 55 L 36 45 C 30 45, 30 35, 30 35 Z" />
              <circle cx="42" cy="35" r="1.5" fill="#ffffff" />
              <circle cx="48" cy="35" r="1.5" fill="#ffffff" />

              {/* Heart */}
              <path d="M 120 40 C 120 30, 135 30, 140 40 C 145 30, 160 30, 160 40 C 160 55, 140 65, 140 65 C 140 65, 120 55, 120 40 Z" />

              {/* Camera */}
              <rect x="220" y="25" width="35" height="24" rx="4" />
              <circle cx="237.5" cy="37" r="6" />
              <path d="M 230 25 L 233 20 L 242 20 L 245 25" />

              {/* Star */}
              <polygon points="310,25 314,35 325,35 316,42 319,52 310,46 301,52 304,42 295,35 306,35" />

              {/* Smartphone */}
              <rect x="35" y="110" width="22" height="38" rx="3" />
              <line x1="42" y1="115" x2="50" y2="115" />
              <circle cx="46" cy="142" r="1.5" fill="#ffffff" />

              {/* Music Note */}
              <path d="M 130 140 L 130 115 L 150 108 L 150 133" />
              <ellipse cx="124" cy="140" rx="6" ry="4" fill="#ffffff" />
              <ellipse cx="144" cy="133" rx="6" ry="4" fill="#ffffff" />

              {/* Coffee Cup */}
              <path d="M 220 120 L 245 120 C 245 138, 220 138, 220 120 Z" />
              <path d="M 245 124 C 252 124, 252 132, 245 132" />
              <line x1="215" y1="140" x2="250" y2="140" />

              {/* Thumbs Up */}
              <path d="M 305 130 L 305 145 L 325 145 C 330 145, 332 135, 325 130 L 325 120 C 325 115, 318 115, 318 122 L 315 130 Z" />

              {/* Umbrella */}
              <path d="M 30 220 C 30 200, 70 200, 70 220 Z" />
              <line x1="50" y1="200" x2="50" y2="235" />
              <path d="M 50 235 C 50 240, 44 240, 44 235" />

              {/* Clock */}
              <circle cx="140" cy="220" r="16" />
              <polyline points="140,210 140,220 148,220" />

              {/* Headphones */}
              <path d="M 220 225 A 18 18 0 0 1 256 225" />
              <rect x="216" y="222" width="6" height="12" rx="2" fill="#ffffff" />
              <rect x="254" y="222" width="6" height="12" rx="2" fill="#ffffff" />

              {/* Gift */}
              <rect x="300" y="210" width="28" height="24" rx="2" />
              <line x1="300" y1="218" x2="328" y2="218" />
              <line x1="314" y1="210" x2="314" y2="234" />
              <path d="M 314 210 C 310 203, 302 205, 308 210 Z" />
              <path d="M 314 210 C 318 203, 326 205, 320 210 Z" />

              {/* Gamepad */}
              <rect x="35" y="295" width="34" height="22" rx="6" />
              <line x1="43" y1="306" x2="51" y2="306" />
              <line x1="47" y1="302" x2="47" y2="310" />
              <circle cx="60" cy="304" r="1.5" fill="#ffffff" />
              <circle cx="63" cy="308" r="1.5" fill="#ffffff" />

              {/* Paper Plane */}
              <path d="M 120 310 L 155 295 L 140 330 L 133 316 Z" />
              <line x1="155" y1="295" x2="133" y2="316" />

              {/* Planet / Saturn */}
              <circle cx="235" cy="310" r="10" />
              <ellipse cx="235" cy="310" rx="18" ry="5" transform="rotate(-25 235 310)" />

              {/* Smile Emoji */}
              <circle cx="315" cy="305" r="14" />
              <circle cx="310" cy="301" r="1.5" fill="#ffffff" />
              <circle cx="320" cy="301" r="1.5" fill="#ffffff" />
              <path d="M 309 309 C 312 314, 318 314, 321 309" />

              {/* Tiny decorative bubbles & crosses */}
              <circle cx="85" cy="80" r="3" />
              <circle cx="180" cy="80" r="2" />
              <circle cx="270" cy="85" r="3" />
              <circle cx="90" cy="180" r="2" />
              <circle cx="185" cy="170" r="4" />
              <circle cx="280" cy="165" r="2" />
              <circle cx="85" cy="260" r="3" />
              <circle cx="190" cy="270" r="2" />
              <circle cx="275" cy="255" r="3" />
              <circle cx="170" cy="345" r="3" />

              {/* Crosses */}
              <path d="M 80 125 L 86 131 M 86 125 L 80 131" strokeWidth="1.2" />
              <path d="M 270 215 L 276 221 M 276 215 L 270 221" strokeWidth="1.2" />
              <path d="M 175 25 L 181 31 M 181 25 L 175 31" strokeWidth="1.2" />
              <path d="M 95 330 L 101 336 M 101 330 L 95 336" strokeWidth="1.2" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#wa-doodle-pattern)" />
      </svg>
    </div>
  );
}
