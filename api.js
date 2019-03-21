const fetch = require("node-fetch");

const url = id => `https://petition.parliament.uk/petitions/${id}/count.json`;

const getCount = async petitionId => {
  const res = await fetch(url(petitionId));
  if (!res.ok) {
    throw new Error(
      `Parliament API gave bad response (${res.status} ${res.statusText})`
    );
  }
  const { signature_count } = await res.json();

  return signature_count;
};

const watchCount = (petitionId, onUpdate, rate = 30) => {
  const runUpdate = async () => {
    try {
      onUpdate(await getCount(petitionId));
    } catch (error) {
      onUpdate(error);
    }
  };
  const interval = setInterval(runUpdate, rate * 1000);
  runUpdate();
  return () => clearInterval(interval);
};

module.exports = { url, getCount, watchCount };
