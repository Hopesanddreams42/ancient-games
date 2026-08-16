/*
 * Ads & consent scaffold for the Seven Ancient Games hub.
 *
 * This file is deliberately a no-op today: it loads no third-party scripts
 * and shows no ads. It exists so that turning ads on later is a matter of
 * filling in the two TODOs below, not restructuring the page.
 *
 * The four reserved <div class="ad-slot" data-ad-size="..."> elements in
 * index.html (see the leaderboard slots and the in-content slot) already
 * have their sizes fixed via CSS, so populating them won't shift layout.
 *
 * IMPORTANT — UK/EEA visitors: most ad networks (including Google/AdSense)
 * require a Google-certified Consent Management Platform (CMP) before any
 * personalized ad or tracking script runs. Do not call loadAdNetwork()
 * until AdsConfig.consented reflects a real user choice from that CMP —
 * gate it behind that, not behind a page-load timer or a default value.
 */

window.AdsConfig = {
  // Set by a real CMP integration once one exists. Never default this to
  // true — an unset/false value means "don't load ad scripts."
  consented: false,
  // Which network is wired up, e.g. 'adsense'. Null means none yet.
  network: null
};

function requestConsentIfNeeded() {
  // TODO: replace with a real Google-certified CMP integration
  // (e.g. a Funding Choices / CMP script) that sets
  // window.AdsConfig.consented based on the visitor's actual choice,
  // then calls loadAdNetwork() only after that.
}

function loadAdNetwork() {
  if (!window.AdsConfig.consented || !window.AdsConfig.network) return;

  // TODO: once a network is chosen, inject its script tag here and fill
  // each `.ad-slot` element (matched via its `data-ad-size` attribute)
  // with that network's unit for the corresponding size. Do not touch
  // the service worker's cache — ad scripts must always be network-fresh.
}

document.addEventListener('DOMContentLoaded', () => {
  requestConsentIfNeeded();
  loadAdNetwork();
});
