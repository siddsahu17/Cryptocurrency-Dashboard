import { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import './App.css';
import Chatbot from './Chatbot';

const CRYPTOS = [
  { symbol: 'BTC-USD', name: 'Bitcoin (BTC)' },
  { symbol: 'ETH-USD', name: 'Ethereum (ETH)' },
  { symbol: 'DOGE-USD', name: 'Dogecoin (DOGE)' },
  { symbol: 'MATIC-USD', name: 'Polygon (MATIC)' },
  { symbol: 'SOL-USD', name: 'Solana (SOL)' },
];

function App() {
  const [priceData, setPriceData] = useState({});
  const [newsData, setNewsData] = useState([]);
  // const [forecastData, setForecastData] = useState(null);
  const [loadingPrice, setLoadingPrice] = useState(true);
  const [loadingNews, setLoadingNews] = useState(true);
  // const [loadingForecast, setLoadingForecast] = useState(false);
  const [errorPrice, setErrorPrice] = useState(null);
  const [errorNews, setErrorNews] = useState(null);
  // const [errorForecast, setErrorForecast] = useState(null);
  const [selectedCrypto, setSelectedCrypto] = useState(CRYPTOS[0].symbol);
  const [newsIndex, setNewsIndex] = useState(0);

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

  // useEffect(() => {
  //   setLoadingForecast(true);
  //   setErrorForecast(null);
  //   setForecastData(null);
  //   fetch(`http://localhost:8000/api/forecast?symbol=${selectedCrypto}&days=7`)
  //     .then(res => res.json())
  //     .then(data => {
  //       setForecastData(data.forecast || []);
  //       setLoadingForecast(false);
  //     })
  //     .catch(() => {
  //       setErrorForecast('Failed to fetch forecast data');
  //       setLoadingForecast(false);
  //     });
  // }, [selectedCrypto]);

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

  // News navigation handlers
  const handlePrevNews = () => setNewsIndex(i => (i > 0 ? i - 1 : newsData.length - 1));
  const handleNextNews = () => setNewsIndex(i => (i < newsData.length - 1 ? i + 1 : 0));

  const currentNews = newsData[newsIndex] || null;

  return (
    <div className="dashboard-root-static">
      <div className="dashboard-section dashboard-prices">
        <div className="dashboard-block">
          <div className="dashboard-label">Cryptocurrency</div>
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
        <div className="dashboard-block dashboard-chart">
          <div className="dashboard-label">Price Chart</div>
          {loadingPrice ? (
            <p>Loading price data...</p>
          ) : errorPrice ? (
            <p style={{ color: 'red' }}>{errorPrice}</p>
          ) : priceData[selectedCrypto]?.error ? (
            <p style={{ color: 'red' }}>Error loading data</p>
          ) : selectedData.length === 0 ? (
            <p style={{ color: '#ffd166', fontWeight: 600, fontSize: '1.2rem', margin: '2rem 0' }}>No data available for this currency.</p>
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
                  height: 320,
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
        {/*
        <div className="dashboard-block dashboard-forecast">
          <div className="dashboard-label">7-Day Price Forecast (ARIMA)</div>
          {loadingForecast ? (
            <p>Loading forecast...</p>
          ) : errorForecast ? (
            <p style={{ color: 'red' }}>{errorForecast}</p>
          ) : forecastData && forecastData.length > 0 ? (
            <table className="forecast-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Forecast Price (USD)</th>
                </tr>
              </thead>
              <tbody>
                {forecastData.map((row, idx) => (
                  <tr key={idx}>
                    <td>{row.date}</td>
                    <td>${Number(row.forecast).toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No forecast data available.</p>
          )}
        </div>
        */}
      </div>
      <div className="dashboard-section dashboard-news">
        <div className="dashboard-block">
          <div className="dashboard-label">Latest News</div>
          <div className="news-card news-card-fixed dashboard-news-card">
            {currentNews && (
              <>
                {currentNews.image ? (
                  <img className="news-image-placeholder" src={currentNews.image} alt="news" />
                ) : (
                  <div className="news-image-placeholder">
                    <span role="img" aria-label="placeholder">🖼️</span>
                  </div>
                )}
                <strong className="news-title">{currentNews.title}</strong>
                <p className="news-summary">{currentNews.summary}</p>
                <span className="news-source">Source: {currentNews.source}</span>
                <br />
                <a className="news-link" href={currentNews.url} target="_blank" rel="noopener noreferrer">Read Full Article</a>
              </>
            )}
            <div className="news-nav-btns">
              <button className="news-nav-btn" onClick={handlePrevNews} disabled={newsData.length === 0}>Previous</button>
              <span className="news-nav-index">{newsIndex + 1} / {newsData.length}</span>
              <button className="news-nav-btn" onClick={handleNextNews} disabled={newsData.length === 0}>Next</button>
            </div>
          </div>
        </div>
      </div>
      <Chatbot />
    </div>
  );
}

export default App;
