export const checkImage = (url: string, setStateFunction: (value: boolean) => void) => {
  const checkTokenImg = new Image();
  checkTokenImg.src = url;

  checkTokenImg.onload = () => {
    setStateFunction(false);
  }

  checkTokenImg.onerror = () => {
    setStateFunction(true);
  }
}