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

// from: https://gist.github.com/Rob--W/ec23b9d6db9e56b7e4563f1544e0d546
// A tag for template literals that escapes any value as HTML.
export function safeHTML(strings: TemplateStringsArray, ...values: string[]) {
   let results = [];
   for (let i = 0; i < strings.length; ++i) {
       results.push(strings[i]);
       if (i < values.length) { // values[strings.length-1] can be undefined
           results.push(escapeHTML(values[i]));
       }
   }
   return results.join('');
}

function escapeHTML(str: string) {
    // Note: string cast using String; may throw if `str` is non-serializable, e.g. a Symbol.
    // Most often this is not the case though.
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#39;')
        .replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
