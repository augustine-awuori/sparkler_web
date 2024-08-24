import { useEffect } from "react";

const useTitleChanger = (title: string) => {
  useEffect(() => {
    document.title = `Sparkler | ${title}`;
  }, [title]);
};

export default useTitleChanger;
