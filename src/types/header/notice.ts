interface BaseNotice {
  id: string;
  status: boolean;
  title: string;
}

interface Notification extends BaseNotice {
  type: string;
  time: string;
  icon: string;
}

interface Message extends BaseNotice {
  image: string;
  content: string;
  time: string;
}

interface Todo extends BaseNotice {
  tagName: string;
  tagType: string;
  memo: string;
}

export { Notification, Message, Todo };
