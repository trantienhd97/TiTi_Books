import en from '../assets/translate/en.json';

export const useTranslate = () => {
  const translate = (key: string) => {
    const keys = key.split('.');
    let result: any = en;
    for (const k of keys) {
      if (result && result[k]) {
        result = result[k];
      } else {
        return key;
      }
    }
    return result;
  };

  return { translate };
};
