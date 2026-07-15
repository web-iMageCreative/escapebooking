import React from 'react';

export class  Helpers  {
  static formatPhone = (num: string) => {
    let cleanNum = num.replace(/\s/g, '');
    let anyElse = cleanNum.startsWith('+');
    let pref = anyElse ? '+' : '';
    let nums = anyElse ? cleanNum.substring(1) : cleanNum;
    let groups = [];

    if (nums.length === 0) return num;
    
    for (let i = nums.length; i > 0; i -= 3) {
      groups.unshift(nums.substring(Math.max(0, i - 3), i));
    }

    return pref + groups.join(' ');
  };
}

export default Helpers;