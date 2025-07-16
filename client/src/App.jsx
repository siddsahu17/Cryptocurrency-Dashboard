import { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import './App.css';

const CRYPTOS = [
  { symbol: 'X:BTCUSD', name: 'Bitcoin (BTC)' },
  { symbol: 'X:ETHUSD', name: 'Ethereum (ETH)' },
  { symbol: 'X:LTCUSD', name: 'Litecoin (LTC)' },
  { symbol: 'X:BCHUSD', name: 'Bitcoin Cash (BCH)' },
  { symbol: 'X:XRPUSD', name: 'Ripple (XRP)' },
];

function App() {
  const [priceData, setPriceData] = useState({});
  const [newsData, setNewsData] = useState([]);
  const [loadingPrice, setLoadingPrice] = useState(true);
  const [loadingNews, setLoadingNews] = useState(true);
  const [errorPrice, setErrorPrice] = useState(null);
  const [errorNews, setErrorNews] = useState(null);
  const [selectedCrypto, setSelectedCrypto] = useState(CRYPTOS[0].symbol);

  useEffect(() => {
    Promise.all(
      CRYPTOS.map(crypto =>
        fetch(`http://localhost:8000/api/price?symbol=${crypto.symbol}`)
          .then(res => res.json())
          .then(data => ({ symbol: crypto.symbol, data: data.data || [] }))
          .catch(() => ({ symbol: crypto.symbol, data: [], error: true }))
      )
    ).then(results => {
      const dataObj = {};
      results.forEach(r => {
        dataObj[r.symbol] = r;
      });
      setPriceData(dataObj);
      setLoadingPrice(false);
    }).catch(() => {
      setErrorPrice('Failed to fetch price data');
      setLoadingPrice(false);
    });

    fetch('http://localhost:8000/summarize_news')
      .then(res => res.json())
      .then(data => {
        setNewsData(data.results || []);
        setLoadingNews(false);
      })
      .catch(() => {
        setErrorNews('Failed to fetch news data');
        setLoadingNews(false);
      });
  }, []);

  const getPlotlyCandlestickData = (data) => [{
    x: data.map(item => item.time),
    open: data.map(item => item.open),
    high: data.map(item => item.high),
    low: data.map(item => item.low),
    close: data.map(item => item.close),
    type: 'candlestick',
    increasing: { line: { color: '#26a69a' } },
    decreasing: { line: { color: '#ef5350' } },
  }];

  const selectedData = priceData[selectedCrypto]?.data || [];
  const latest = selectedData.length ? selectedData[selectedData.length - 1] : null;
  const selectedCryptoObj = CRYPTOS.find(c => c.symbol === selectedCrypto);

  return (
    <div className="dashboard-root">
      <div className="dashboard-left">
        <h1 className="main-heading">Crypto Visualizations</h1>
        <section>
          <div className="dropdown-row">
            <label htmlFor="crypto-select">Select Currency: </label>
            <select
              id="crypto-select"
              value={selectedCrypto}
              onChange={e => setSelectedCrypto(e.target.value)}
              className="crypto-dropdown"
            >
              {CRYPTOS.map(crypto => (
                <option key={crypto.symbol} value={crypto.symbol}>{crypto.name}</option>
              ))}
            </select>
          </div>
          <div className="candlestick-single">
            <h2 className="crypto-title">{selectedCryptoObj.name}</h2>
            {loadingPrice ? (
              <p>Loading price data...</p>
            ) : errorPrice ? (
              <p style={{ color: 'red' }}>{errorPrice}</p>
            ) : priceData[selectedCrypto]?.error ? (
              <p style={{ color: 'red' }}>Error loading data</p>
            ) : (
              <>
                {latest && (
                  <div className="price-volume-block">
                    <div className="pv-label">Current Price</div>
                    <div className="pv-value">${Number(latest.close).toLocaleString()}</div>
                    <div className="pv-label" style={{ marginTop: '1rem' }}>24H Volume</div>
                    <div className="pv-value">{Number(latest.volume).toLocaleString()}</div>
                  </div>
                )}
                <Plot
                  data={getPlotlyCandlestickData(selectedData)}
                  layout={{
                    title: '',
                    plot_bgcolor: "#181a20",
                    paper_bgcolor: "#181a20",
                    font: { color: "#fff", size: 16 },
                    xaxis: {
                      title: '',
                      type: 'date',
                      gridcolor: "#333",
                      tickfont: { color: "#fff" },
                    },
                    yaxis: {
                      title: 'USD',
                      gridcolor: "#333",
                      tickfont: { color: "#fff" },
                    },
                    margin: { t: 20, l: 60, r: 20, b: 40 },
                    height: 400,
                  }}
                  config={{
                    displayModeBar: false,
                    responsive: true,
                  }}
                  style={{ width: '100%', height: '100%' }}
                />
              </>
            )}
          </div>
        </section>
      </div>
      <div className="dashboard-right">
        <h1 className="main-heading">Financial News</h1>
        <section>
          {loadingNews ? (
            <p>Loading news...</p>
          ) : errorNews ? (
            <p style={{ color: 'red' }}>{errorNews}</p>
          ) : (
            <ul className="news-list">
              {newsData.map((item, idx) => (
                <li key={idx} className="news-card">
                  <strong className="news-title">{item.title}</strong>
                  <p className="news-summary">{item.summary}</p>
                  <span className="news-source">Source: {item.source}</span>
                  <br />
                  <a className="news-link" href={item.url} target="_blank" rel="noopener noreferrer">Read Full Article</a>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

export default App;
