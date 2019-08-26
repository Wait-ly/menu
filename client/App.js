import React from 'react';

const letterCount = (str, char) => {
  const count = {};
  str.split('').forEach((cha) => {
    if (!count.hasOwnProperty(cha)) {
      count[cha] = 1;
    } else {
      count[cha] += 1;
    }
  });
  if (count.hasOwnProperty(char)) {
    return count[char];
  }
  return 0;
};
export default letterCount;
