import { Component, createSignal, onMount } from "solid-js";
import { notifications } from "../assets/notifications.json";
import "./notification.css";

type infoType = {
  message: string;
  name?: string;
  src?: string;
  relativeTime: string;
  content?: string;
};

interface notifactionObj {
  user: string;
  read: boolean;
  action: ACTIONTypes | string;
  info: infoType;
}

interface dataType {
  notifications: notifactionObj[];
  unreadCount?: number;
}

type ACTIONTypes = keyof typeof ACTION_CLASS_MAP;

const ACTION_CLASS_MAP = {
  "post-reaction": "text-c-dark-grayish-blue",
  "group-action": "text-c-blue",
};

const ELEMENT_BY_ACTION = {
  "post-reaction": (notification: notifactionObj, actionClass: string) => {
    return (
      <span class="w-full">
        <a href="#" class="lg:text-md mr-1 inline text-sm font-extrabold">
          {notification.user}
        </a>
        <p class="lg:text-md inline text-sm text-c-dark-grayish-blue">
          {notification.info.message}
        </p>
        <a
          href="#"
          class={`lg:text-md ml-1 inline text-sm font-extrabold ${actionClass}`}
        >
          {notification.info.name}
        </a>
        {!notification.read ? (
          <div class="ml-1 inline-block h-2 w-2 rounded-full bg-c-red" />
        ) : null}
        <p class="text-sm text-c-grayish-blue">
          {notification.info.relativeTime}
        </p>
      </span>
    );
  },
  follow: (notification: notifactionObj) => {
    return (
      <span class="w-full">
        <a href="#" class="lg:text-md mr-1 inline text-sm font-extrabold">
          {notification.user}
        </a>
        <p class="lg:text-md inline text-sm text-c-dark-grayish-blue">
          {notification.info.message}
        </p>
        {!notification.read ? (
          <div class="ml-1 inline-block h-2 w-2 rounded-full bg-c-red" />
        ) : null}
        <p class="text-sm text-c-grayish-blue">
          {notification.info.relativeTime}
        </p>
      </span>
    );
  },
  "group-action": (notification: notifactionObj, actionClass: string) =>
    ELEMENT_BY_ACTION["post-reaction"](notification, actionClass),
  "private-message": (notification: notifactionObj) => {
    return (
      <>
        <span class="w-full">
          <a href="#" class="lg:text-md mr-1 inline text-sm font-extrabold">
            {notification.user}
          </a>
          <p class="lg:text-md inline text-sm text-c-dark-grayish-blue">
            {notification.info.message}
          </p>
          {!notification.read ? (
            <div class="ml-1 inline-block h-2 w-2 rounded-full bg-c-red" />
          ) : null}
          <p class="text-sm text-c-grayish-blue">
            {notification.info.relativeTime}
          </p>
        </span>
        <div class="mt-2 w-full rounded border border-c-light-grayish-blue-2 p-4 text-c-dark-grayish-blue hover:cursor-pointer hover:bg-c-light-grayish-blue-1">
          <p class="lg:text-md text-sm">{notification.info.content}</p>
        </div>
      </>
    );
  },
  "picture-comment": (notification: notifactionObj) => {
    return (
      <span class="w-full">
        <div class="flex justify-between">
          <div>
            <a href="#" class="lg:text-md mr-1 inline text-sm font-extrabold">
              {notification.user}
            </a>
            <p class="lg:text-md inline text-sm text-c-dark-grayish-blue">
              {notification.info.message}
            </p>
            {!notification.read ? (
              <div class="ml-1 inline-block h-2 w-2 rounded-full bg-c-red" />
            ) : null}
            <p class="text-sm text-c-grayish-blue">
              {notification.info.relativeTime}
            </p>
          </div>
          <img
            id="picture"
            src={`/images/${notification.info.src}`}
            alt="picture"
            class="h-10 flex-none"
          />
        </div>
      </span>
    );
  },
};

const Notifications: Component = () => {
  const [data, setData] = createSignal<dataType>({ notifications: [] });
  const [isLoading, setIsLoading] = createSignal(true);

  onMount(() => {
    const unreadCount = notifications.reduce(
      (prev: number, current: notifactionObj) => {
        if (!current.read) prev = prev + 1;
        return prev;
      },
      0
    );

    setTimeout(() => setIsLoading(false), 1000);
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
    <>
      {!isLoading() ? (
        <div class="max-h-100% flex h-full w-full max-w-[375px] flex-col gap-4 overflow-y-scroll rounded bg-c-white pb-4 shadow-sm lg:h-[90%] lg:max-h-[90vh] lg:w-[90vw] lg:max-w-[1440px] lg:gap-8">
          <div class="sticky top-0 flex w-full justify-between bg-c-white px-4 py-2 lg:px-8 lg:py-4">
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
            {data().notifications.map((notification: notifactionObj) => {
              const src = `avatar-${notification.user
                .toLowerCase()
                .replaceAll(" ", "-")}.webp`;
              const actionClass = isValidAction(
                notification.action,
                ACTION_CLASS_MAP
              )
                ? ACTION_CLASS_MAP[notification.action]
                : "";

              const element = isValidAction(
                notification.action,
                ELEMENT_BY_ACTION
              )
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
                    src={`/images/${src}`}
                    alt="user-image"
                    class="h-10 flex-none"
                  />
                  <div class="flex grow flex-col items-start justify-center">
                    {element(notification, actionClass)}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <svg
          aria-hidden="true"
          class="mr-2 h-8 w-8 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
      )}
    </>
  );
};

export default Notifications;
