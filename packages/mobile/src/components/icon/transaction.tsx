import React, { FunctionComponent } from 'react';
import Svg, { Path } from 'react-native-svg';

export const TransactionIcon: FunctionComponent<{
  size?: number;
  color?: string;
}> = ({ size, color = 'none' }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path
        d="M15.78 2H8.22C4.44 2 3.5 3.01 3.5 7.04V18.3C3.5 20.96 4.96 21.59 6.73 19.69L6.74 19.68C7.56 18.81 8.81 18.88 9.52 19.83L10.53 21.18C11.34 22.25 12.65 22.25 13.46 21.18L14.47 19.83C15.19 18.87 16.44 18.8 17.26 19.68C19.04 21.58 20.49 20.95 20.49 18.29V7.04C20.5 3.01 19.56 2 15.78 2ZM14.75 10.75H9.25C8.84 10.75 8.5 10.41 8.5 10C8.5 9.59 8.84 9.25 9.25 9.25H14.75C15.16 9.25 15.5 9.59 15.5 10C15.5 10.41 15.16 10.75 14.75 10.75Z"
        fill="#292D32"
      />
    </Svg>
  );
};

export const TransactionOutlineIcon: FunctionComponent<{
  size?: number;
  color?: string;
}> = ({ size, color = 'none' }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path
        d="M6.72827 19.7C7.54827 18.82 8.79828 18.89 9.51828 19.85L10.5283 21.2C11.3383 22.27 12.6483 22.27 13.4583 21.2L14.4683 19.85C15.1883 18.89 16.4383 18.82 17.2583 19.7C19.0383 21.6 20.4883 20.97 20.4883 18.31V7.04C20.4883 3.01 19.5483 2 15.7683 2H8.20828C4.42828 2 3.48828 3.01 3.48828 7.04V18.3C3.49828 20.97 4.95827 21.59 6.72827 19.7Z"
        stroke="#292D32"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M9.25 10H14.75"
        stroke="#292D32"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
};

export const TransactionMinusIcon: FunctionComponent<{
  color?: string;
  size?: number;
}> = ({ size = 19, color = 'none' }) => {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 19 19"
      fill={color}
    >
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M3.2754 2.24418C4.04466 1.42191 5.23721 1.25 6.65621 1.25H12.3262C13.7452 1.25 14.9378 1.42191 15.707 2.24418C16.4596 3.04866 16.6162 4.28019 16.6162 5.78V14.2325C16.6162 14.7911 16.5412 15.2986 16.3704 15.7195C16.1985 16.1428 15.9061 16.5292 15.4528 16.7248C14.994 16.9229 14.5114 16.8649 14.0884 16.6825C13.6727 16.5032 13.2727 16.1894 12.8964 15.7878L12.895 15.7863C12.7285 15.6076 12.5518 15.5549 12.4101 15.5626C12.2681 15.5704 12.0977 15.6423 11.9513 15.8373C11.9513 15.8374 11.9514 15.8373 11.9513 15.8373L11.1942 16.8493L11.1917 16.8527C10.7676 17.4129 10.1608 17.7519 9.49496 17.7519C8.82916 17.7519 8.22229 17.4129 7.79822 16.8527L7.79566 16.8493L7.03871 15.8375C7.03864 15.8374 7.03878 15.8376 7.03871 15.8375C6.89236 15.6425 6.72179 15.5704 6.5798 15.5626C6.43807 15.5549 6.26141 15.6076 6.09491 15.7863L6.09363 15.7877C5.71886 16.1878 5.31954 16.5008 4.90378 16.6796C4.48069 16.8615 3.99857 16.9186 3.54006 16.7216C3.0869 16.5268 2.79264 16.1419 2.61861 15.7181C2.44562 15.2969 2.36832 14.7885 2.36622 14.2278L2.36621 14.225V5.78C2.36621 4.28019 2.52278 3.04866 3.2754 2.24418ZM4.37078 3.26895C4.06214 3.59885 3.86621 4.25731 3.86621 5.78V14.2235C3.86798 14.6634 3.93032 14.9636 4.00616 15.1483C4.04309 15.2382 4.07862 15.2896 4.10203 15.3163C4.11346 15.3293 4.12183 15.3363 4.1263 15.3396C4.12858 15.3413 4.13016 15.3422 4.13101 15.3427L4.13236 15.3434L4.13495 15.344C4.13746 15.3445 4.14431 15.3454 4.15668 15.3447C4.18201 15.3434 4.23268 15.3353 4.31129 15.3015C4.47443 15.2314 4.7098 15.0709 4.99878 14.7623L5.54619 15.275L4.9975 14.7637C5.446 14.2824 6.04559 14.0313 6.66136 14.0649C7.2768 14.0984 7.84511 14.4127 8.23871 14.9375L8.99419 15.9473C8.99457 15.9478 8.99496 15.9483 8.99534 15.9488C9.17841 16.1899 9.36603 16.2519 9.49496 16.2519C9.62389 16.2519 9.8115 16.1899 9.99458 15.9488C9.99496 15.9483 9.99535 15.9478 9.99573 15.9473L10.7507 14.9382C11.1443 14.4134 11.7131 14.0984 12.3285 14.0649C12.944 14.0313 13.5433 14.2821 13.9917 14.7629C14.2826 15.0733 14.5189 15.2346 14.6824 15.3051C14.7913 15.3521 14.8436 15.3501 14.8585 15.3474C14.8698 15.3403 14.9217 15.3003 14.9805 15.1554C15.0553 14.9711 15.1162 14.6714 15.1162 14.2325V5.78C15.1162 4.25731 14.9203 3.59885 14.6116 3.26895C14.3197 2.95684 13.7422 2.75 12.3262 2.75H6.65621C5.24021 2.75 4.66277 2.95684 4.37078 3.26895Z"
        fill="white"
      />
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M6 6.25C6 5.83579 6.33579 5.5 6.75 5.5H12.0833C12.4975 5.5 12.8333 5.83579 12.8333 6.25C12.8333 6.66421 12.4975 7 12.0833 7H6.75C6.33579 7 6 6.66421 6 6.25Z"
        fill="white"
      />
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M6 8.95001C6 8.5358 6.33579 8.20001 6.75 8.20001H10.0833C10.4975 8.20001 10.8333 8.5358 10.8333 8.95001C10.8333 9.36423 10.4975 9.70001 10.0833 9.70001H6.75C6.33579 9.70001 6 9.36423 6 8.95001Z"
        fill="white"
      />
    </Svg>
  );
};
