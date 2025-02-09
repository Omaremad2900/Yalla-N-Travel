import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CurrencyConverter = ({ defaultCurrency = 'USD', prices, onCurrencyChange }) => {
    const [exchangeRates, setExchangeRates] = useState({});
    const [currency, setCurrency] = useState(defaultCurrency);
    const [convertedPrices, setConvertedPrices] = useState([]);

    // Fetch exchange rates for USD, EUR, and EGP
    useEffect(() => {
        const fetchExchangeRates = async () => {
            try {
                const currencies = ['USD', 'EUR', 'EGP'];
                const rates = {};

                for (let baseCurrency of currencies) {
                    const response = await axios.get(
                        `https://api.exchangerate-api.com/v4/latest/${baseCurrency}`
                    );
                    rates[baseCurrency] = response.data.rates;
                }
                setExchangeRates(rates);
            } catch (error) {
                console.error('Failed to fetch exchange rates:', error);
            }
        };
        fetchExchangeRates();
    }, []); // Empty dependency array, so this only runs once

    // Update prices based on selected currency
    useEffect(() => {
        if (exchangeRates[currency]) {
            const newPrices = prices.map(price =>
                (price * exchangeRates['USD'][currency]).toFixed(2)
            );
            setConvertedPrices(newPrices);
            if (onCurrencyChange) onCurrencyChange(currency, newPrices); // Update both currency and prices
        }
    }, [currency, exchangeRates]); // Remove prices from dependency array

    const handleCurrencyChange = (e) => {
        setCurrency(e.target.value);
    };

    return (
        <div>
            <label htmlFor="currency">Select Currency: </label>
            <select id="currency" value={currency} onChange={handleCurrencyChange}>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="EGP">EGP</option>
            </select>
        </div>
    );
};

export default CurrencyConverter;
