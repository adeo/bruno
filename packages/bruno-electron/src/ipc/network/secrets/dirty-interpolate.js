// TODO: remove this function from here and use the one from @usebruno/common

const flattenObject = (obj, parentKey = '') => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    const newKey = parentKey ? (Array.isArray(obj) ? `${parentKey}[${key}]` : `${parentKey}.${key}`) : key;
    if (typeof value === 'object' && value !== null) {
      Object.assign(acc, flattenObject(value, newKey));
    } else {
      acc[newKey] = value;
    }
    return acc;
  }, {});
};

async function replaceAsync(str, patternRegex, injection, flattenedObj) {
  return str.replace(patternRegex, async (match, placeholder) => {
    const replacement = (await injection?.(match)) || flattenedObj[placeholder];
    return replacement !== undefined ? replacement : match;
  });
}

const interpolateAsync = async (str, obj, injection) => {
  if (!str || typeof str !== 'string' || !obj || typeof obj !== 'object') {
    return str;
  }
  const patternRegex = /\{\{([^}]+)\}\}/g;
  const flattenedObj = flattenObject(obj);
  const result = await replaceAsync(str, patternRegex, injection, flattenedObj);
  console.log('the result is this', result);
  return result;
};

const interpolate = (str, obj) => {
  if (!str || typeof str !== 'string' || !obj || typeof obj !== 'object') {
    return str;
  }
  const patternRegex = /\{\{([^}]+)\}\}/g;
  const flattenedObj = flattenObject(obj);
  return str.replace(patternRegex, (match, placeholder) => {
    const replacement = flattenedObj[placeholder];
    return replacement !== undefined ? replacement : match;
  });
};

module.exports = {
  interpolate,
  interpolateAsync
};
