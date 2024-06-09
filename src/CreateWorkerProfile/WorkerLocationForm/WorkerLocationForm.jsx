import React, { useRef, useState, useEffect } from 'react';
import s from './WorkerLocationForm.module.css';
import arrowsvg from '../../assets/arrow.svg';
import blackarr from '../../assets/black.svg';
import { Link } from 'react-router-dom';

function WorkerLocationForm(props) {
  //variables for countries
  const [countries, setCountries] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [offsetLoadedCountries, setOffsetLoadedCountries] = useState(0);
  const limitLoadedCountries = 25; 
  const [searchCountryQuery, setSearchCountryQuery] = useState(''); 
  const [isCountryFormOpen, setIsCountryFormOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState([]);
  const dropdownRef = useRef(null);
  const scrollContainerRef = useRef(null);


  //variables for cities
  const [cities, setCities] = useState([])
  const [scrollbarHeight, setScrollbarHeight] = useState(0);
  const [loadingCities, setLoadingCities] = useState(false);
  const [offsetLoadedCities, setOffsetLoadedCities] = useState(0);
  const limitLoadedCities = 25; 
  const [searchCityQuery, setSearchCityQuery] = useState(''); 
  const [isCityFormOpen, setIsCityFormOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState('');
  const dropdownRef2 = useRef(null);
  const scrollContainerRef2 = useRef(null);
  const [scrollbarHeight2, setScrollbarHeight2] = useState(0);
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [isCancelled, setIsCancelled] = useState(false); // Флаг отмены запроса

  //errors
  const [errorFields, setErrorFields] = useState({
    selectedCity: false,
    selectedCountry: false
  });

  const validateFields = () => {
    const errors = {
      selectedCity: selectedCity === '',
      selectedCountry: selectedCountry === ''
    };
    setErrorFields(errors);
    return !Object.values(errors).some(Boolean);
  };

  useEffect(() => {
    setSelectedCity(sessionStorage.getItem('selectedCity') !== null ? sessionStorage.getItem('selectedCity') : '')
    setSearchCountryQuery(sessionStorage.getItem('selectedCountry') !== null ? sessionStorage.getItem('selectedCountry').split(',')[0] : '')
    setSearchCityQuery(sessionStorage.getItem('selectedCity') !== null ? sessionStorage.getItem('selectedCity').split(',')[0] : '')
    setSelectedCountry(sessionStorage.getItem('selectedCountry') !== null ? sessionStorage.getItem('selectedCountry') : '')
  }, [])


//those useEffects are for checking click outside window
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsCountryFormOpen(false);
      }
    };
    const handleClickOutside2 = (event) => {
      if (dropdownRef2.current && !dropdownRef2.current.contains(event.target)) {
        setIsCityFormOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    document.addEventListener('mousedown', handleClickOutside2);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('mousedown', handleClickOutside2);

    };
  }, []);


  useEffect(() => {
    const calculateScrollbarHeight = () => {
      const scrollContainerHeight = scrollContainerRef.current.offsetHeight;
      const contentHeight = scrollContainerRef.current.scrollHeight;
      const scrollbarHeightPercentage = (scrollContainerHeight / contentHeight) * 100;
      setScrollbarHeight(scrollbarHeightPercentage);
    };

    calculateScrollbarHeight();

    const handleResize = () => {
      calculateScrollbarHeight();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


//getting cities and countries
  const fetchCountries = async () => {
    if (isCancelled) return;
    setLoadingCountries(true);
    try {
      const response = await fetch(`https://assista1.ru/api/v1/items/country?startswith=${searchCountryQuery}&offset=${offsetLoadedCountries}&limit=${limitLoadedCountries}`);
      const data = await response.json();
      const newCountries = data.items.map(([country, id]) => ({ label: country, value: id }));

      setCountries(prevCountries => [...prevCountries, ...newCountries]);
      setOffsetLoadedCountries(prevOffset => prevOffset + limitLoadedCountries); 
      setLoadingCountries(false);
    } catch (error) {
      setLoadingCountries(false);
    } 
  };


  const fetchCities = async () => {
    if (isCancelled) return;
    if (selectedCountry[1] === '' || selectedCountry[1] === undefined) {
      return;
    }
    setLoadingCities(true);
    try {
      const response = await fetch(`https://assista1.ru/api/v1/items/country/cities?country_id=${selectedCountry[1]}&startswith=${searchCityQuery}&offset=${offsetLoadedCities}&limit=${limitLoadedCities}`);
      const data = await response.json();
      const newCities = data.items.map(([citys, id]) => ({ label: citys, value: id }));

      setCities(prevCountries => [...prevCountries, ...newCities]); 
      setOffsetLoadedCities(prevOffset => prevOffset + limitLoadedCities); 
      setLoadingCities(false);
    } catch (error) {
      setLoadingCities(false);
    }
  };


  const toggleDropdownCountryForm = () => {
    setIsCountryFormOpen(!isCountryFormOpen);
    fetchCities()
  };
  const toggleDropdownCityForm = () => {
    setIsCityFormOpen(!isCityFormOpen);
  };

 const selectCountry = (country) => {
    setSelectedCountry(country);
    if (searchCityQuery !== ''){

       fetchCities()
    }
    setSearchCountryQuery(country[0]); 
    setIsCountryFormOpen(false);
  };
 const selectCity = (country) => {
    setSelectedCity(country);
    setSearchCityQuery(country[0]); 

    setIsCityFormOpen(false);
  };


//if empty then cities and countries won't load

useEffect(() => {
  setOffsetLoadedCountries(0);
  setCountries([]); 
    if (searchCountryQuery === ''){
    setSelectedCountry([])
  }
}, [searchCountryQuery]);


useEffect(() => {
  if (searchCityQuery === ''){
    setSelectedCity('')
  }
  setOffsetLoadedCities(0); 
  setCities([]); 
}, [searchCityQuery]);



//invisible scrolls, if it gets down to end of list, then func would load a new list of countries/cities
  const handleScrollCountry = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const scrollbarHeightPercentage = (clientHeight / scrollHeight) * 100;
    setScrollbarHeight(scrollbarHeightPercentage);
    if (
      scrollTop + clientHeight >= scrollHeight - (0.10 *scrollTop + 0.10 *clientHeight)
    ) {
      if (!loadingCountries) {
        setIsCancelled(false); 
        if (debounceTimeout) {
          clearTimeout(debounceTimeout);
        }
        if (searchCountryQuery !== ''){

        const timeout = setTimeout(() => {
          fetchCountries();
        }, 300); // Delay for request
      
        setDebounceTimeout(timeout);
      }
        return () => {
          setIsCancelled(true); 
        }; 
      }
    }
  };

  const handleScrollCity = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const scrollbarHeightPercentage = (clientHeight / scrollHeight) * 100;
    setScrollbarHeight2(scrollbarHeightPercentage);
    if (
      scrollTop + clientHeight >= scrollHeight-30
    ) {
      
      if (!loadingCities) {
        setIsCancelled(false);
        if (debounceTimeout) {
          clearTimeout(debounceTimeout);
        }
        if (searchCityQuery !== ''){
        const timeout = setTimeout(() => {
          fetchCities();
        }, 300); 
        setDebounceTimeout(timeout);// Delay for request
      }
        
        return () => {
          setIsCancelled(true); // Flag for not loading array twice
        };
      }
    }
  };
  
//if value changes, then load new list of countries with debounce
useEffect(() => {
  if (searchCountryQuery !== ''){
    setIsCancelled(false);
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    if (searchCountryQuery !== ''){

    const timeout = setTimeout(() => {
      fetchCountries();
    }, 300);

    setDebounceTimeout(timeout);
  }
    return () => {
      setIsCancelled(true); 
    }; 
  }
}, [searchCountryQuery]);

useEffect(() => {
  setIsCancelled(false);
  if (debounceTimeout) {
    clearTimeout(debounceTimeout);
  }
  if (searchCityQuery !== ''){

  const timeout = setTimeout(() => {
    fetchCities();
  }, 300); 

  setDebounceTimeout(timeout);
}
  return () => {
    setIsCancelled(true); 
  };
}, [searchCityQuery]);


//handlers for input value, we should write for request cities/countries with first char in upperCase
const handleInputCountryChange = (e) => {
  const newSearchQuery = e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1);
  setSearchCountryQuery(newSearchQuery);
  setOffsetLoadedCountries(0); 
};

const handleInputCityChange = (e) => {
  const newSearchQuery = e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1);
  setSearchCityQuery(newSearchQuery);
  setOffsetLoadedCities(0);
};

  return (
    <div className={s.locationForm} style={props.colorB==="light" ? {backgroundColor:"white"} : {backgroundColor:"#232323"} }>  
         <div className={s.locationForm_wrapper}>
        <div className={s.locationForm_header}>
        <Link to='/worker_registration'>
            <img src={props.colorB === 'light' ? blackarr : arrowsvg} className={s.locationForm_header__arrow}></img>
        </Link>
            <h1 className={s.locationForm_text} style={props.colorB==='light' ? {color:'black'} : {color:'white'} }>Регистрация</h1>
        </div>
        <div className={s.dropdown_container} ref={dropdownRef}>
      <input
        type="text"
        value={searchCountryQuery}
        placeholder="Страна (Начните вводить...)"
        onChange={(e) => {handleInputCountryChange(e)}}
        onClick={toggleDropdownCountryForm}

        className={`${s.country_field} ${props.colorB === 'light' ? s.light : s.dark}`}
      />
      <div className={`${s.dropdown_options} ${props.colorB === 'light' ? s.light : s.dark} ${isCountryFormOpen ? s.open : ''}`}>
        <div className={s.scroll_container} ref={scrollContainerRef} onScroll={handleScrollCountry}>
          {countries.map((country, index) => (
            <div key={index} className={`${s.dropdown_option} ${props.colorB === 'light' ? s.light : s.dark}`} onClick={() => selectCountry([country.label, country.value])}>
              {country.label}
            </div>
          ))}
        </div>
        <div className={`${s.scrollbar_1} ${props.colorB === 'light' ? s.light : s.dark}`} style={{ height: `90%`}} />        
      </div>
      
      {selectedCountry === '' && (errorFields.selectedCountry && <span className={s.error_message}>Выберите вашу страну</span>)}
    </div>
    
      <div className={s.dropdown_container2} ref={dropdownRef2}>
        <input
          type="text"
          placeholder="Город (Начните вводить...)"
          value={searchCityQuery}
          className={`${s.city_field} ${props.colorB === 'light' ? s.light : s.dark}`}
          onChange={(e) => {handleInputCityChange(e)}}
          onClick={toggleDropdownCityForm}
        />
        <div className={`${s.dropdown_options2} ${props.colorB === 'light' ? s.light : s.dark} ${isCityFormOpen ? s.open : ''}`}>
          <div className={s.scroll_container2} ref={scrollContainerRef2} onScroll={handleScrollCity}>
          {cities.map((citymap, index) => (
            <div key={index} className={`${s.dropdown_option2} ${props.colorB === 'light' ? s.light : s.dark}`} onClick={() => selectCity([citymap.label, citymap.value])}>
              {citymap.label}
            </div>
          ))}
        </div>
        <div className={`${s.scrollbar_12} ${props.colorB === 'light' ? s.light : s.dark}`} style={{ height: `90%`}} />
      </div>
        {selectedCity === '' && (errorFields.selectedCity && <span className={s.error_message}>Выберите ваш город</span>)}

      </div>
      <Link to={(selectedCity === '') || (selectedCountry == '') ? '/worker_location_registration' : '/worker_contacts_registration'}>
        <button onClick={() => {
          validateFields()
          sessionStorage.setItem('selectedCity', selectedCity)
          sessionStorage.setItem('selectedCountry', selectedCountry)
        }}className={`${s.locationForm_btn} ${props.colorB === 'light' ? s.light : s.dark}`}>Далее</button>
      </Link>
      </div>
    </div>
  );
}

export default WorkerLocationForm;
