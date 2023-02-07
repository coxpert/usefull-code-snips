export const getCountryData = () => {
    axios
        .get(`https://restcountries.com/v3.1/alpha/${country}`)
        .then(response => {
            const region = response.data[0].region;
            if (mounted) {
                setRegion(region);
            }
        })
        .catch(error => {
            console.error(error);
        });
};

const getCountries = () => {
    axios
        .get('https://api.countrystatecity.in/v1/countries', {
            headers: {
                'X-CSCAPI-KEY': process.env.REACT_APP_CSC_APIKEY,
            },
        })
        .then(response => {
        })
        .catch(err => console.error({ err }));
};