// ========================================
// 데이터 변환 및 처리 유틸리티 함수들
// ========================================

// 배열을 페이지별로 분할
export const paginateArray = (array, page, itemsPerPage) => {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return array.slice(startIndex, endIndex);
};

// 배열을 최신순으로 정렬 (ID 기준)
export const sortByLatest = (array, idField = "id") => {
  return array.sort((a, b) => {
    const idA = parseInt(a[idField]) || 0;
    const idB = parseInt(b[idField]) || 0;
    return idB - idA; // 내림차순 (최신이 위로)
  });
};

// 배열을 오래된순으로 정렬 (ID 기준)
export const sortByOldest = (array, idField = "id") => {
  return array.sort((a, b) => {
    const idA = parseInt(a[idField]) || 0;
    const idB = parseInt(b[idField]) || 0;
    return idA - idB; // 오름차순 (오래된 것이 위로)
  });
};

// 배열을 이름순으로 정렬
export const sortByName = (array, nameField = "name") => {
  return array.sort((a, b) => {
    const nameA = a[nameField] || "";
    const nameB = b[nameField] || "";
    return nameA.localeCompare(nameB, "ko-KR");
  });
};

// 배열을 날짜순으로 정렬
export const sortByDate = (array, dateField = "startDate", ascending = false) => {
  return array.sort((a, b) => {
    const dateA = new Date(a[dateField] || 0);
    const dateB = new Date(b[dateField] || 0);
    return ascending ? dateA - dateB : dateB - dateA;
  });
};

// 배열에서 중복 제거
export const removeDuplicates = (array, keyField) => {
  if (!keyField) {
    return [...new Set(array)];
  }
  
  const seen = new Set();
  return array.filter((item) => {
    const key = item[keyField];
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
};

// 배열을 그룹별로 분류
export const groupBy = (array, keyField) => {
  return array.reduce((groups, item) => {
    const key = item[keyField];
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {});
};

// 배열을 조건에 따라 필터링
export const filterByCondition = (array, condition) => {
  if (typeof condition === "function") {
    return array.filter(condition);
  }
  
  if (typeof condition === "object") {
    return array.filter((item) => {
      return Object.keys(condition).every((key) => {
        return item[key] === condition[key];
      });
    });
  }
  
  return array;
};

// 객체에서 특정 키들만 추출
export const pick = (obj, keys) => {
  const result = {};
  keys.forEach((key) => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
};

// 객체에서 특정 키들 제외
export const omit = (obj, keys) => {
  const result = { ...obj };
  keys.forEach((key) => {
    delete result[key];
  });
  return result;
};

// 깊은 복사
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }
  
  if (obj instanceof Array) {
    return obj.map((item) => deepClone(item));
  }
  
  if (typeof obj === "object") {
    const clonedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  
  return obj;
};

// 객체 병합
export const merge = (target, ...sources) => {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        merge(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return merge(target, ...sources);
};

// 객체인지 확인
const isObject = (item) => {
  return item && typeof item === "object" && !Array.isArray(item);
};

// 배열을 청크로 분할
export const chunk = (array, size) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

// 배열의 첫 번째 요소 반환
export const first = (array) => {
  return array.length > 0 ? array[0] : undefined;
};

// 배열의 마지막 요소 반환
export const last = (array) => {
  return array.length > 0 ? array[array.length - 1] : undefined;
};

// 배열이 비어있는지 확인
export const isEmpty = (array) => {
  return !array || array.length === 0;
};

// 배열의 길이 확인
export const length = (array) => {
  return array ? array.length : 0;
};

// 배열에서 특정 값의 인덱스 찾기
export const findIndex = (array, predicate) => {
  if (typeof predicate === "function") {
    return array.findIndex(predicate);
  }
  
  if (typeof predicate === "object") {
    return array.findIndex((item) => {
      return Object.keys(predicate).every((key) => {
        return item[key] === predicate[key];
      });
    });
  }
  
  return array.indexOf(predicate);
};

// 배열에서 특정 값 찾기
export const find = (array, predicate) => {
  if (typeof predicate === "function") {
    return array.find(predicate);
  }
  
  if (typeof predicate === "object") {
    return array.find((item) => {
      return Object.keys(predicate).every((key) => {
        return item[key] === predicate[key];
      });
    });
  }
  
  return array.find((item) => item === predicate);
};

// 배열에서 특정 값들만 추출
export const pluck = (array, key) => {
  return array.map((item) => item[key]);
};

// 배열의 모든 값이 조건을 만족하는지 확인
export const every = (array, predicate) => {
  if (typeof predicate === "function") {
    return array.every(predicate);
  }
  
  if (typeof predicate === "object") {
    return array.every((item) => {
      return Object.keys(predicate).every((key) => {
        return item[key] === predicate[key];
      });
    });
  }
  
  return array.every((item) => item === predicate);
};

// 배열의 일부 값이 조건을 만족하는지 확인
export const some = (array, predicate) => {
  if (typeof predicate === "function") {
    return array.some(predicate);
  }
  
  if (typeof predicate === "object") {
    return array.some((item) => {
      return Object.keys(predicate).every((key) => {
        return item[key] === predicate[key];
      });
    });
  }
  
  return array.some((item) => item === predicate);
};
