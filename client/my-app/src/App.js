import logo from './logo.svg';
import './App.css';
import './index.js'

import {
  useQuery,
  gql
} from "@apollo/client";

const EXCHANGE_RATES = gql`
  query GetExchangeRates {
    rates(currency: "USD") {
      currency
      rate
    }
  }
`;

var cnt = 0
function ExchangeRates() {
  const { loading, error, data } = useQuery(EXCHANGE_RATES);
  console.log(cnt++);
  console.log(loading);
  console.log(error);
  console.log(data);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return data.rates.map(({ currency, rate }) => (
    <div key={currency}>
      <p>
        {currency}: {rate}
      </p>
    </div>
  ));
}

function App() {
  return (
    <div>
      <h2>My first Apollo app 🚀</h2>
      <ExchangeRates />
    </div>
  );
}

export default App;
