export type FittingStation = {
  value: string;
  label: string;
  city?: string;
  postcode?: string;
};

export type CurrencyConfig = {
  currencyCode: string;
  currencySymbol: string;
  currencyMinorUnit: number;
  currencyPrefix: string;
  currencySuffix: string;
};

export type WordPressRuntimeConfig = {
  enabled: boolean;
  wooEnabled: boolean;
  restUrl: string;
  apiBase: string;
  storeApiBase: string;
  homeUrl: string;
  shopUrl: string;
  cartUrl: string;
  checkoutUrl: string;
  nativeCheckoutUrl: string;
  accountUrl: string;
  privacyPolicyUrl: string;
  termsUrl: string;
  currentTemplate: 'home' | 'store' | 'product' | 'checkout' | 'page';
  currentProduct: {
    id?: number;
    slug?: string;
    permalink?: string;
  };
  showPrototypeTools: boolean;
  storeApiNonce?: string;
  currency: CurrencyConfig;
  fittingStations: FittingStation[];
};

declare global {
  interface Window {
    NonoMagsWp?: Partial<WordPressRuntimeConfig>;
  }
}

const defaultCurrency: CurrencyConfig = {
  currencyCode: 'NZD',
  currencySymbol: '$',
  currencyMinorUnit: 2,
  currencyPrefix: '$',
  currencySuffix: '',
};

const defaultConfig: WordPressRuntimeConfig = {
  enabled: false,
  wooEnabled: false,
  restUrl: '/wp-json/',
  apiBase: '/wp-json/nonomags/v1/',
  storeApiBase: '/wp-json/wc/store/v1/',
  homeUrl: '/',
  shopUrl: '/shop/',
  cartUrl: '/cart/',
  checkoutUrl: '/checkout/',
  nativeCheckoutUrl: '/checkout/?native-checkout=1',
  accountUrl: '',
  privacyPolicyUrl: '',
  termsUrl: '',
  currentTemplate: 'home',
  currentProduct: {},
  showPrototypeTools: true,
  storeApiNonce: undefined,
  currency: defaultCurrency,
  fittingStations: [
    { value: 'auckland-central', label: 'Tyre Plus - Auckland Central', city: 'Auckland', postcode: '1010' },
    { value: 'auckland-east', label: 'Fast Fit - East Auckland', city: 'Auckland', postcode: '2013' },
    { value: 'wellington', label: 'Capital Tyres - Wellington CBD', city: 'Wellington', postcode: '6011' },
    { value: 'christchurch', label: 'South Island Tyres - Christchurch', city: 'Christchurch', postcode: '8011' },
    { value: 'hamilton', label: 'Waikato Wheel Works - Hamilton', city: 'Hamilton', postcode: '3204' },
  ],
};

let cachedConfig: WordPressRuntimeConfig | null = null;

const normalizeUrl = (candidate: string) => {
  try {
    return new URL(candidate, window.location.origin).toString();
  } catch {
    return candidate;
  }
};

export function getWpRuntimeConfig(): WordPressRuntimeConfig {
  if (cachedConfig) {
    return cachedConfig;
  }

  const runtime = typeof window !== 'undefined' ? window.NonoMagsWp ?? {} : {};

  cachedConfig = {
    ...defaultConfig,
    ...runtime,
    currency: {
      ...defaultCurrency,
      ...(runtime.currency ?? {}),
    },
    currentProduct: {
      ...defaultConfig.currentProduct,
      ...(runtime.currentProduct ?? {}),
    },
    fittingStations: runtime.fittingStations?.length ? runtime.fittingStations : defaultConfig.fittingStations,
  };

  if (typeof window !== 'undefined') {
    cachedConfig.homeUrl = normalizeUrl(cachedConfig.homeUrl);
    cachedConfig.shopUrl = normalizeUrl(cachedConfig.shopUrl);
    cachedConfig.cartUrl = normalizeUrl(cachedConfig.cartUrl);
    cachedConfig.checkoutUrl = normalizeUrl(cachedConfig.checkoutUrl);
    cachedConfig.nativeCheckoutUrl = normalizeUrl(cachedConfig.nativeCheckoutUrl);
    cachedConfig.accountUrl = cachedConfig.accountUrl ? normalizeUrl(cachedConfig.accountUrl) : '';
    cachedConfig.privacyPolicyUrl = cachedConfig.privacyPolicyUrl ? normalizeUrl(cachedConfig.privacyPolicyUrl) : '';
    cachedConfig.termsUrl = cachedConfig.termsUrl ? normalizeUrl(cachedConfig.termsUrl) : '';
    cachedConfig.restUrl = normalizeUrl(cachedConfig.restUrl);
    cachedConfig.apiBase = normalizeUrl(cachedConfig.apiBase);
    cachedConfig.storeApiBase = normalizeUrl(cachedConfig.storeApiBase);
  }

  return cachedConfig;
}

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '') || '/';
const trimLeadingSlash = (value: string) => value.replace(/^\/+/, '');

export function buildApiUrl(base: string, path: string, params?: Record<string, string | number | boolean | undefined>) {
  const url = new URL(trimLeadingSlash(path), base.endsWith('/') ? base : `${base}/`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === '') {
        return;
      }

      url.searchParams.set(key, String(value));
    });
  }

  return url.toString();
}

function pathMatches(currentUrl: string, targetUrl: string) {
  try {
    const current = new URL(currentUrl, window.location.origin);
    const target = new URL(targetUrl, window.location.origin);

    return trimTrailingSlash(current.pathname) === trimTrailingSlash(target.pathname);
  } catch {
    return false;
  }
}

export function getInitialPageFromLocation() {
  const config = getWpRuntimeConfig();

  if (typeof window === 'undefined') {
    return 'home';
  }

  const currentUrl = window.location.href;

  if (pathMatches(currentUrl, config.checkoutUrl) || pathMatches(currentUrl, config.cartUrl)) {
    return 'checkout';
  }

  if (pathMatches(currentUrl, config.shopUrl)) {
    return 'store';
  }

  if (config.enabled) {
    if (config.currentTemplate === 'store') {
      return 'store';
    }

    if (config.currentTemplate === 'checkout') {
      return 'checkout';
    }

    if (config.currentTemplate === 'home') {
      return 'home';
    }
  }

  if (config.currentTemplate === 'product') {
    if (config.currentProduct.slug) {
      return `product:${config.currentProduct.slug}`;
    }

    if (config.currentProduct.id) {
      return `product:${config.currentProduct.id}`;
    }
  }

  const pathSegments = window.location.pathname.split('/').filter(Boolean);
  if (!config.enabled && pathSegments.length > 1) {
    return `product:${pathSegments[pathSegments.length - 1]}`;
  }

  return 'home';
}

export function getUrlForPage(page: string) {
  const config = getWpRuntimeConfig();

  if (page === 'home') {
    return config.homeUrl;
  }

  if (page === 'store') {
    return config.shopUrl;
  }

  if (page === 'checkout') {
    return config.checkoutUrl;
  }

  return null;
}

export function setStoreApiNonce(nextNonce?: string | null) {
  if (!nextNonce) {
    return;
  }

  const config = getWpRuntimeConfig();
  config.storeApiNonce = nextNonce;
}

export function getStoreApiNonce() {
  return getWpRuntimeConfig().storeApiNonce;
}

export function formatCurrency(amount: number, currencyOverride?: Partial<CurrencyConfig>) {
  const currency = {
    ...getWpRuntimeConfig().currency,
    ...(currencyOverride ?? {}),
  };

  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currency.currencyCode,
    }).format(amount);
  } catch {
    const prefix = currency.currencyPrefix || currency.currencySymbol || '$';
    const suffix = currency.currencySuffix ? ` ${currency.currencySuffix}` : '';
    return `${prefix}${amount.toFixed(currency.currencyMinorUnit ?? 2)}${suffix}`;
  }
}

export function amountFromMinorUnit(rawAmount: string | number, currencyOverride?: Partial<CurrencyConfig>) {
  const currency = {
    ...getWpRuntimeConfig().currency,
    ...(currencyOverride ?? {}),
  };
  const minorUnit = currency.currencyMinorUnit ?? 2;
  const numericValue = typeof rawAmount === 'number' ? rawAmount : parseInt(rawAmount || '0', 10);

  return numericValue / Math.pow(10, minorUnit);
}

export function getFittingStationByValue(value: string) {
  return getWpRuntimeConfig().fittingStations.find((station) => station.value === value);
}
