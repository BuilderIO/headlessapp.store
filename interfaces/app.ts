export type AppInfo = {
  id: string;
  data: {
    handle: string;
    title: string;
    image: string;
    subtitle: string;
    templates: {
      code: string;
      name: string;
    }[];
    defaultInputValues: { key: string; value: string };
  };
};
