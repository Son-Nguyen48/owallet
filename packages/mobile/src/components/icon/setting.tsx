import React, { FunctionComponent } from 'react';
import Svg, { Path } from 'react-native-svg';

export const SettingIcon: FunctionComponent<{
  color?: string;
  height?: number;
}> = ({ color = '#292D32' }) => {
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
        stroke={color}
        stroke-width="1.5"
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M2 12.8801V11.1201C2 10.0801 2.85 9.22006 3.9 9.22006C5.71 9.22006 6.45 7.94006 5.54 6.37006C5.02 5.47006 5.33 4.30006 6.24 3.78006L7.97 2.79006C8.76 2.32006 9.78 2.60006 10.25 3.39006L10.36 3.58006C11.26 5.15006 12.74 5.15006 13.65 3.58006L13.76 3.39006C14.23 2.60006 15.25 2.32006 16.04 2.79006L17.77 3.78006C18.68 4.30006 18.99 5.47006 18.47 6.37006C17.56 7.94006 18.3 9.22006 20.11 9.22006C21.15 9.22006 22.01 10.0701 22.01 11.1201V12.8801C22.01 13.9201 21.16 14.7801 20.11 14.7801C18.3 14.7801 17.56 16.0601 18.47 17.6301C18.99 18.5401 18.68 19.7001 17.77 20.2201L16.04 21.2101C15.25 21.6801 14.23 21.4001 13.76 20.6101L13.65 20.4201C12.75 18.8501 11.27 18.8501 10.36 20.4201L10.25 20.6101C9.78 21.4001 8.76 21.6801 7.97 21.2101L6.24 20.2201C5.33 19.7001 5.02 18.5301 5.54 17.6301C6.45 16.0601 5.71 14.7801 3.9 14.7801C2.85 14.7801 2 13.9201 2 12.8801Z"
        stroke={color}
        stroke-width="1.5"
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
};

export const SettingFillIcon: FunctionComponent<{
  color?: string;
  size?: number;
}> = ({ color = 'none', size = 24 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path
        d="M20.1 9.22C18.29 9.22 17.55 7.94 18.45 6.37C18.97 5.46 18.66 4.3 17.75 3.78L16.02 2.79C15.23 2.32 14.21 2.6 13.74 3.39L13.63 3.58C12.73 5.15 11.25 5.15 10.34 3.58L10.23 3.39C9.78 2.6 8.76 2.32 7.97 2.79L6.24 3.78C5.33 4.3 5.02 5.47 5.54 6.38C6.45 7.94 5.71 9.22 3.9 9.22C2.86 9.22 2 10.07 2 11.12V12.88C2 13.92 2.85 14.78 3.9 14.78C5.71 14.78 6.45 16.06 5.54 17.63C5.02 18.54 5.33 19.7 6.24 20.22L7.97 21.21C8.76 21.68 9.78 21.4 10.25 20.61L10.36 20.42C11.26 18.85 12.74 18.85 13.65 20.42L13.76 20.61C14.23 21.4 15.25 21.68 16.04 21.21L17.77 20.22C18.68 19.7 18.99 18.53 18.47 17.63C17.56 16.06 18.3 14.78 20.11 14.78C21.15 14.78 22.01 13.93 22.01 12.88V11.12C22 10.08 21.15 9.22 20.1 9.22ZM12 15.25C10.21 15.25 8.75 13.79 8.75 12C8.75 10.21 10.21 8.75 12 8.75C13.79 8.75 15.25 10.21 15.25 12C15.25 13.79 13.79 15.25 12 15.25Z"
        fill="#292D32"
      />
    </Svg>
  );
};

export const SettingOutLineIcon: FunctionComponent<{
  color?: string;
  size?: number;
}> = ({ color = 'none', size = 24 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path
        d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
        stroke="#292D32"
        stroke-width="1.5"
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M2 12.88V11.12C2 10.08 2.85 9.22 3.9 9.22C5.71 9.22 6.45 7.94 5.54 6.37C5.02 5.47 5.33 4.3 6.24 3.78L7.97 2.79C8.76 2.32 9.78 2.6 10.25 3.39L10.36 3.58C11.26 5.15 12.74 5.15 13.65 3.58L13.76 3.39C14.23 2.6 15.25 2.32 16.04 2.79L17.77 3.78C18.68 4.3 18.99 5.47 18.47 6.37C17.56 7.94 18.3 9.22 20.11 9.22C21.15 9.22 22.01 10.07 22.01 11.12V12.88C22.01 13.92 21.16 14.78 20.11 14.78C18.3 14.78 17.56 16.06 18.47 17.63C18.99 18.54 18.68 19.7 17.77 20.22L16.04 21.21C15.25 21.68 14.23 21.4 13.76 20.61L13.65 20.42C12.75 18.85 11.27 18.85 10.36 20.42L10.25 20.61C9.78 21.4 8.76 21.68 7.97 21.21L6.24 20.22C5.33 19.7 5.02 18.53 5.54 17.63C6.45 16.06 5.71 14.78 3.9 14.78C2.85 14.78 2 13.92 2 12.88Z"
        stroke="#292D32"
        stroke-width="1.5"
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
};

export const SettingDashboardIcon: FunctionComponent<{
  color?: string;
  size?: number;
}> = ({ color = 'none', size = 24 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M6.66668 2.75C5.79223 2.75 5.08334 3.45888 5.08334 4.33333C5.08334 5.20778 5.79223 5.91667 6.66668 5.91667C7.54113 5.91667 8.25001 5.20778 8.25001 4.33333C8.25001 3.45888 7.54113 2.75 6.66668 2.75ZM1.33334 5.08334H3.6752C4.01019 6.42376 5.22248 7.41667 6.66668 7.41667C8.36955 7.41667 9.75001 6.03621 9.75001 4.33333C9.75001 2.63046 8.36955 1.25 6.66668 1.25C5.22247 1.25 4.01017 2.24292 3.6752 3.58334H1.33334C0.91913 3.58334 0.583344 3.91913 0.583344 4.33334C0.583344 4.74756 0.91913 5.08334 1.33334 5.08334ZM10.6667 3.58334C10.2524 3.58334 9.91666 3.91913 9.91666 4.33334C9.91666 4.74756 10.2524 5.08334 10.6667 5.08334H14.6667C15.0809 5.08334 15.4167 4.74756 15.4167 4.33334C15.4167 3.91913 15.0809 3.58334 14.6667 3.58334H10.6667ZM0.583344 11.6667C0.583344 11.2524 0.91913 10.9167 1.33334 10.9167H5.33334C5.74756 10.9167 6.08334 11.2524 6.08334 11.6667C6.08334 12.0809 5.74756 12.4167 5.33334 12.4167H1.33334C0.91913 12.4167 0.583344 12.0809 0.583344 11.6667ZM9.33333 10.0833C8.45888 10.0833 7.75 10.7922 7.75 11.6667C7.75 12.5411 8.45888 13.25 9.33333 13.25C10.2078 13.25 10.9167 12.5411 10.9167 11.6667C10.9167 10.7922 10.2078 10.0833 9.33333 10.0833ZM6.25 11.6667C6.25 9.9638 7.63046 8.58334 9.33333 8.58334C10.7775 8.58334 11.9898 9.57625 12.3248 10.9167H14.6667C15.0809 10.9167 15.4167 11.2524 15.4167 11.6667C15.4167 12.0809 15.0809 12.4167 14.6667 12.4167H12.3248C11.9898 13.7571 10.7775 14.75 9.33333 14.75C7.63046 14.75 6.25 13.3696 6.25 11.6667Z"
        fill={color}
      />
    </Svg>
  );
};
