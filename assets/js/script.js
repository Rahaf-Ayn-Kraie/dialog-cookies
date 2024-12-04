'use strict';

function select(selector, scope = document) { 
  return scope.querySelector(selector);
} 

function selectAll(selector, scope = document) { 
  return [...scope.querySelectorAll(selector)];
}

function listen(event, selector, callback) { 
  selector.addEventListener(event, callback);
}

const mainInfo = select('.info');
const mainDialog = select('.dialog-1');
const acceptBtn = select('.accept-button', mainDialog);
const settingsBtn = select('.setting-button', mainDialog);
const settingsDialog = select('.dialog-2');
const saveBtn = select('.save-button', settingsDialog);
const browserCheckbox = select('.browser input', settingsDialog);
const osCheckbox = select('.operating-system input', settingsDialog);
const widthCheckbox = select('.width input', settingsDialog);
const heightCheckbox = select('.height input', settingsDialog);
const overlay = select('.overlay');

setTimeout(() => {
  mainDialog.showModal();
  mainInfo.classList.add('opacity');
  overlay.style.display = 'block';
});

// Helper functions
function getWidth() {
  return `${window.innerWidth}px`;
}

function getHeight() {
  return `${window.innerHeight}px`;
}

function getBrowser() {
  const userAgent = navigator.userAgent.toLowerCase();
  const browserTypes = {
    chrome: /chrome|chromium|crios/,
    firefox: /firefox|fxios/,
    safari: /safari/,
    opera: /opr/,
    edge: /edg/
  };
  for (const [name, regex] of Object.entries(browserTypes)) {
    if (regex.test(userAgent)) {
      return name;
    }
  }
  throw new Error("Browser detection failed");
}

function getOS() {
  const platform = navigator.platform;
  if (/mac/i.test(platform)) return 'Mac OS';
  if (/win/i.test(platform)) return 'Windows';
  if (/linux/i.test(platform)) return 'Linux';
  if (/iphone|ipad|ipod/i.test(platform)) return 'iOS';
  if (/android/i.test(platform)) return 'Android';
  throw new Error("Operating System detection failed");
}

function setCookie(name, value, options = {}) {
  options = { path: '/', SameSite: 'Lax', ...options };
  if (options.expires instanceof Date) {
    options.expires = options.expires.toUTCString();
  }
  let cookieString = encodeURIComponent(name) + "=" + encodeURIComponent(value);
  for (const [key, val] of Object.entries(options)) {
    cookieString += `; ${key}=${val}`;
  }
  document.cookie = cookieString;
}

listen('click', acceptBtn, () => {
  mainDialog.style.display = 'none';
  settingsDialog.style.display = 'none';
  mainInfo.classList.remove('opacity');
  overlay.style.display = 'none';
  setCookie('Browser', getBrowser(), { 'max-age': 15 });
  setCookie('Operating system', getOS(), { 'max-age': 15 });
  setCookie('Width', getWidth(), { 'max-age': 15 });
  setCookie('Height', getHeight(), { 'max-age': 15 });

});

listen('click', settingsBtn, () => {
  settingsDialog.showModal();
  overlay.style.display = 'block';
});

listen('click', saveBtn, () => {
  settingsDialog.style.display = 'none';
  mainDialog.style.display = 'none';
  overlay.style.display = 'none';
  mainInfo.classList.remove('opacity');
  const browserPref = browserCheckbox.checked ? 'Enabled' : 'Disabled';
  const osPref = osCheckbox.checked ? 'Enabled' : 'Disabled';
  const widthPref = widthCheckbox.checked ? 'Enabled' : 'Disabled';
  const heightPref = heightCheckbox.checked ? 'Enabled' : 'Disabled';

  setCookie('BrowserPreference', browserPref, { 'max-age': 15 });
  setCookie('OperatingSystemPreference', osPref, { 'max-age': 15 });
  setCookie('WidthPreference', widthPref, { 'max-age': 15 });
  setCookie('HeightPreference', heightPref, { 'max-age': 15 });
});
