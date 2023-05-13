export function ready(fn: any) {
  if (document.readyState !== 'loading') {
    fn();
    return;
  }
  document.addEventListener('DOMContentLoaded', fn);
}

export const $ = (selector: any): HTMLElement => document.querySelector(selector);
export const $$ = (selector: any): NodeListOf<HTMLElement> => document.querySelectorAll(selector);

export function addEventListener(el: HTMLElement, eventName: string, eventHandler: Function, selector?: string) {
  if (selector) {
    const wrappedHandler: EventListener = (e) => {
      if (!e.target) return;
      if (!(e.target instanceof HTMLElement)) return;

      const el = e.target.closest(selector);
      if (el) {
        const newEvent = Object.create(e, {
          target: {
            value: el
          }
        });
        eventHandler.call(el, newEvent);
      }
    };
    el.addEventListener(eventName, wrappedHandler);
    return wrappedHandler;
  } else {
    const wrappedHandler: EventListener = (e) => {
      eventHandler.call(el, e);
    };
    el.addEventListener(eventName, wrappedHandler);
    return wrappedHandler;
  }
}

export function wrap(el: HTMLElement) {
    const wrappingElement = document.createElement('div');
    el.replaceWith(wrappingElement);
    wrappingElement.appendChild(el);
}

export function next(el: HTMLElement, selector: string) {
  if (selector) {
    const next = el.nextElementSibling;
    if (next && next.matches(selector)) {
      return next;
    }
    return undefined;
  } else {
    return el.nextElementSibling;
  }
}

export function last(el: HTMLElement, selector: string) {
    return Array.from(el.querySelectorAll(selector)).at(-1) ?? null;
}
