import { Component, createSignal, JSX, onMount } from "solid-js";
import { notifications } from "../assets/notifications.json";
import "./notification.css";

interface NotificationBaseProps {
  notification: NotificationOBJ;
  children?: JSX.Element;
}

const NotificationBase: Component<NotificationBaseProps> = ({
  children,
  notification,
}) => {
  return (
    <>
      <a href="#" class="lg:text-md mr-1 inline text-sm font-extrabold">
        {notification.user}
      </a>
      <p class="lg:text-md inline text-sm text-c-dark-grayish-blue">
        {notification.info.message}
      </p>
      {children}
      {!notification.read ? (
        <div class="ml-1 inline-block h-2 w-2 rounded-full bg-c-red" />
      ) : null}
      <p class="text-sm text-c-grayish-blue">
        {notification.info.relativeTime}
      </p>
    </>
  );
};

type ACTIONTypes = keyof typeof ACTION_CLASS_MAP;

type infoType = {
  message: string;
  name?: string;
  src?: string;
  relativeTime: string;
  content?: string;
};

interface NotificationOBJ {
  user: string;
  read: boolean;
  action: ACTIONTypes | string;
  info: infoType;
  avatarSrc: string;
}

interface DataType {
  notifications: NotificationOBJ[];
  unreadCount: number;
}

const ACTION_CLASS_MAP = {
  "post-reaction": "text-c-dark-grayish-blue",
  "group-action": "text-c-blue",
};

const ELEMENT_BY_ACTION = {
  "post-reaction": (notification: NotificationOBJ, actionClass: string) => {
    return (
      <div class="w-full">
        <NotificationBase notification={notification}>
          <a
            href="#"
            class={`lg:text-md ml-1 inline text-sm font-extrabold ${actionClass}`}
          >
            {notification.info.name}
          </a>
        </NotificationBase>
      </div>
    );
  },
  follow: (notification: NotificationOBJ) => {
    return (
      <div class="w-full">
        <NotificationBase notification={notification} />
      </div>
    );
  },
  "group-action": (notification: NotificationOBJ, actionClass: string) =>
    ELEMENT_BY_ACTION["post-reaction"](notification, actionClass),
  "private-message": (notification: NotificationOBJ) => {
    return (
      <>
        <div class="w-full">
          <NotificationBase notification={notification} />
        </div>
        <div class="mt-2 w-full rounded border border-c-light-grayish-blue-2 p-4 text-c-dark-grayish-blue hover:cursor-pointer hover:bg-c-light-grayish-blue-1">
          <p class="lg:text-md text-sm">{notification.info.content}</p>
        </div>
      </>
    );
  },
  "picture-comment": (notification: NotificationOBJ) => {
    return (
      <div class="w-full">
        <div class="flex justify-between">
          <div>
            <NotificationBase notification={notification} />
          </div>
          <img
            id="picture"
            src={`/images/${notification.info.src}`}
            alt="picture"
            class="h-10 w-10"
          />
        </div>
      </div>
    );
  },
};

const Notifications: Component = () => {
  const [data, setData] = createSignal<DataType>({
    notifications: [],
    unreadCount: 0,
  });

  onMount(() => {
    const unreadCount = notifications.reduce(
      (prev: number, current: NotificationOBJ) => {
        if (!current.read) prev = prev + 1;
        return prev;
      },
      0
    );

    setData({ notifications, unreadCount });
  });

  const isValidAction = (x: string, obj: object): x is keyof typeof obj =>
    x in obj;

  const maskAsSeen = () => {
    setData({
      notifications: notifications.map((v) => {
        v.read = true;
        return v;
      }),
      unreadCount: 0,
    });
  };

  return (
    <div class="max-h-100% flex h-full w-full max-w-[375px] flex-col overflow-y-auto rounded-lg bg-c-white shadow-md md:max-h-[90vh] lg:h-[90%] lg:w-[90vw] lg:max-w-[1440px]">
      <div class="sticky top-0 flex w-full justify-between bg-c-white px-4 py-8 lg:px-8 lg:py-10">
        <div class="flex items-center gap-1.5 lg:gap-3">
          <h1 class="text-lg font-extrabold lg:text-2xl">Notifications</h1>
          <span class="text-md rounded-lg bg-c-blue px-3 font-extrabold text-c-white lg:text-lg">
            {data().unreadCount}
          </span>
        </div>
        <button
          class="text-sm text-c-dark-grayish-blue lg:text-lg"
          onClick={maskAsSeen}
        >
          Mark all as read
        </button>
      </div>
      <ul class="flex flex-col gap-3 px-4 lg:px-8">
        {data().notifications.map((notification: NotificationOBJ) => {
          const actionClass = isValidAction(
            notification.action,
            ACTION_CLASS_MAP
          )
            ? ACTION_CLASS_MAP[notification.action]
            : "";

          const element = isValidAction(notification.action, ELEMENT_BY_ACTION)
            ? ELEMENT_BY_ACTION[notification.action]
            : (_a: any, _b: any) => null;

          return (
            <li
              class={`flex flex-row gap-3 rounded-lg p-2.5 lg:gap-5 lg:p-5 ${
                !notification.read
                  ? "bg-c-very-light-grayish-blue shadow-sm"
                  : ""
              }`}
            >
              <img
                src={`/images/${notification.avatarSrc}`}
                alt="user-image"
                class="h-10 w-10"
              />
              <div class="flex grow flex-col items-start justify-center">
                {element(notification, actionClass)}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Notifications;
