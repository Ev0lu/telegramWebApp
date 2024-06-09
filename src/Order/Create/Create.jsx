import React, { useRef, useState, useEffect } from 'react';
import s from './Create.module.css';
import Vector from '../../assets/Vector.svg'
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';



function Create(props) {
  const [price, setPrice] = useState(0)
  const [duration, setDuration] = useState('')
  const [termScale, setTermScale] = useState(0)

  //variables for country
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState([]);
  const [searchQueryCountry, setSearchQueryCountry] = useState(''); // Input value for country search
  const [loading, setLoading] = useState(false);
  const [isOpenCountryForm, setIsOpenCountryForm] = useState(false);
  const [offset, setOffset] = useState(0);
  const limitCountries = 25; // Количество элементов, которые необходимо загрузить при каждом запросе

  const location = useLocation();
  // Getting access_token and refresh_token from URL
  const searchParams = new URLSearchParams(location.search);
  const [accessToken, setAccessToken] = useState(searchParams.get('access_token'));
  const [refreshToken, setRefreshToken] = useState(searchParams.get('refresh_token'));
  const [place, setPlace] = useState('offline')


  //variables for skills
  const [skills, setSkills] = useState([]);

  const dropdownRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const [title, setTitle] = useState('');
  const [phone, setPhone] = useState('');

  //variables for cities
  const [cities, setCities] = useState([])
  const [isOpenCity, setIsOpenCity] = useState(false);
  const [selectedCity, setSelectedCity] = useState('');
  const [searchQueryCity, setSearchQueryCity] = useState(''); // Input value for country search

  const [scrollbarHeight, setScrollbarHeight] = useState(0);


  const [loading2, setLoading2] = useState(false);
  const [offset2, setOffset2] = useState(0);
  const limitCities = 25; 

  const dropdownRef2 = useRef(null);
  const scrollContainerRef2 = useRef(null);
  const [scrollbarHeight2, setScrollbarHeight2] = useState(0);

  //variables for skills
  const [scrollbarHeight__skills, setScrollbarHeight__skills] = useState(0);
  const [isOpenSkillsForm, setIsOpenSkillsForm] = useState(false);
  const [searchQuerySkills, setSearchQuerySkills] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedSkillsId, setSelectedSkillsId] = useState([]);
  const limit__skills = 25;
  const [offset__skills, setOffset__skills] = useState(0);

  const dropdownRef1__skills = useRef(null);
  const scrollContainerRef1__skills = useRef(null);

  const [errorFields, setErrorFields] = useState({
    selectedCity: false,
    selectedCountry: false,
    selectedSkills: false,
    phone: false,
    title: false,
    duration : false
  });

  const validateFields = () => {
    const errors = {
      selectedCity: selectedCity === '',
      selectedCountry: selectedCountry === '',
      selectedSkills: selectedSkills.length === 0,
      phone: phone === '',
      title: title === '',
      duration: duration === ''
    };
    setErrorFields(errors);
    return !Object.values(errors).some(Boolean);
  };

  useEffect(() => {
    setSelectedCity(sessionStorage.getItem('selectedCity') !== null ? sessionStorage.getItem('selectedCity') : '')
    setSelectedCountry(sessionStorage.getItem('selectedCountry') !== null ? sessionStorage.getItem('selectedCountry') : '')
  }, [])

//create order
const createOrder = async () => {
  const requestBody = {
      "title": `${title}`,
      "skills": [...selectedSkillsId],
      "task": `${phone}`,
      "is_online": place === 'offline' ? false : true,
      "price": Number(price),
      "duration": `${duration}`,
      "location": place === 'offline' ? { "city_id":  `${selectedCity[1]}` } : null
  };
  
  try {
    const response = await fetch(`https://assista1.ru/api/v1/order/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(requestBody)
    });
    if (response.status === 401 || response.status === 400 ) {
      refreshTokens()
    }
    if (response.ok) {
      const data = await response.json();
      props.tg.sendData(JSON.stringify(data))
    } 
  } catch (error) {
  }
};
//these useEffects are for closing form if person clicked outside the window
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpenCountryForm(false);
      }
    };
    const handleClickOutside2 = (event) => {
      if (dropdownRef2.current && !dropdownRef2.current.contains(event.target)) {
        setIsOpenCity(false);
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


  const toggleDropdownCountry = () => {
    setIsOpenCountryForm(!isOpenCountryForm);
    fetchCities()
  };

  const toggleDropdownCity = () => {
    setIsOpenCity(!isOpenCity);
  };

  const selectCountry = (country) => {
    setSelectedCountry(country);
    fetchCities()
    setSearchQueryCountry(country[0]); // Update searchQuery with selected country label
    setIsOpenCountryForm(false);
  };

  const selectCity = (city) => {
    setSelectedCity(city);
    setSearchQueryCity(city[0]); // Update searchQuery with selected country label
    setIsOpenCity(false);
  };

//getting countries and cities
 const fetchCountries = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await fetch(`https://assista1.ru/api/v1/items/country?startswith=${searchQueryCountry}&offset=${offset}&limit=${limitCountries}`);
      const data = await response.json();
      const newCountries = data.items.map(([country, id]) => ({ label: country, value: id }));

      setCountries(prevCountries => [...prevCountries, ...newCountries]); // Добавляем загруженные страны к списку
      setOffset(prevOffset => prevOffset + limitCountries); // Увеличиваем offset для следующего запроса
    } catch (error) {
    }

    setLoading(false);
  };

  const fetchCities = async () => {
    if (loading2) return;

    if (selectedCountry[1] === '' || selectedCountry[1] === undefined) {
        return;
      }
    setLoading2(true);
    try {
      const response = await fetch(`https://assista1.ru/api/v1/items/country/cities?country_id=${selectedCountry[1]}&startswith=${searchQueryCity}&offset=${offset2}&limit=${limitCities}`);
      const data = await response.json();
      const newCities = data.items.map(([cities, id]) => ({ label: cities, value: id }));

      setCities(prevCities => [...prevCities, ...newCities]); // Добавляем загруженные страны к списку
      setOffset2(prevOffset => prevOffset + limitCities); // Увеличиваем offset для следующего запроса
    } catch (error) {
    }

    setLoading2(false);
  };

useEffect(() => {
  setOffset(0); // Reset offset to 0 when searchQuery changes
  setCountries([]); // Reset countries list to empty when searchQuery changes
}, [searchQueryCountry]);

useEffect(() => {
  setOffset2(0); // Reset offset to 0 when searchQuery changes
  setCities([]); // Reset countries list to empty when searchQuery changes
}, [searchQueryCity]);

const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const scrollbarHeightPercentage = (clientHeight / scrollHeight) * 100;
    setScrollbarHeight(scrollbarHeightPercentage);

    if (
      scrollTop + clientHeight >= scrollHeight-30
    ) {
      if (!loading) {
        fetchCountries(); // Загружаем следующую порцию стран при достижении конца прокрутки
      }
    }
  };

  const handleScroll2 = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const scrollbarHeightPercentage = (clientHeight / scrollHeight) * 100;
    setScrollbarHeight2(scrollbarHeightPercentage);
    if (
      scrollTop + clientHeight >= scrollHeight-30
    ) {
      if (!loading2) {
        fetchCities(); // Загружаем следующую порцию стран при достижении конца прокрутки
      }
    }
  };
  
useEffect(() => {
  if (searchQueryCountry !== ''){
    fetchCountries(); // Call fetchCountries whenever searchQuery changes
  }
}, [searchQueryCountry]);

useEffect(() => {
  fetchCities(); // Call fetchCountries whenever searchQuery changes
}, [searchQueryCity]);

const handleInputChangeCountry = (e) => {
  const newSearchQuery = e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1);;
  setSearchQueryCountry(newSearchQuery);
  setOffset(0); // Reset offset to 0 whenever searchQuery changes
};

const handleInputChangeCity = (e) => {
  const newSearchQuery = e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1);;
  setSearchQueryCity(newSearchQuery);
  setOffset2(0);
};

  const handleChangeTitle = (event) => {
        setTitle(event.target.value);
    };

  const handleChangePhone = (event) => {
        setPhone(event.target.value);
    };

  const handleChangePrice = (event) => {
        setPrice(event.target.value);
    };

  const handleChangeDuration = (event) => {
      setDuration(event.target.value);
    };

  const handleGenderChange = (event) => {
      setPlace(event.target.value);
    };



  useEffect(() => {
        if(termScale == 0){
            setDuration('1')
        } else if (termScale == 20){
            setDuration('7')
        } else if (termScale == 40){
            setDuration('30')
        } else if (termScale == 60){
            setDuration('60')
        } else if (termScale == 80){
            setDuration('90')
        } else if (termScale == 100){
            setDuration('90')
        }
    }, [termScale])



  useEffect(() => {
    const handleClickOutside__skills = (event) => {
      if ((dropdownRef1__skills.current && !dropdownRef1__skills.current.contains(event.target)) ) {
        setIsOpenSkillsForm(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside__skills);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside__skills);
    };
  }, []);

  
useEffect(() => {
    const calculateScrollbarHeight1__skills = () => {
      const scrollContainerHeight1 = scrollContainerRef1__skills.current.offsetHeight;
      const contentHeight1 = scrollContainerRef1__skills.current.scrollHeight;
      const scrollbarHeightPercentage1 = (scrollContainerHeight1 / contentHeight1) * 100;
      setScrollbarHeight__skills(scrollbarHeightPercentage1);
    };
    calculateScrollbarHeight1__skills();
    const handleResize__skills = () => {
      calculateScrollbarHeight1__skills();
    };
    window.addEventListener('resize', handleResize__skills);
    return () => {
      window.removeEventListener('resize', handleResize__skills);
    };
  }, []);
  
  
  const toggleDropdownSkillsForm = () => {
    setIsOpenSkillsForm(!isOpenSkillsForm);
  };
  
  //selecting skills
  const selectSkills = (skill) => {
    const isSelected = selectedSkills.includes(skill[0]);
    const isSelected2 = selectedSkillsId.includes(skill[1]);

    if (isSelected) {
      setSelectedSkills(selectedSkills.filter(c => c !== skill[0]));
      setSelectedSkillsId(selectedSkillsId.filter(c => c !== skill[1]));
    } else {
      setSelectedSkills([...selectedSkills, skill[0]]);
      setSelectedSkillsId([...selectedSkillsId, skill[1]]);
    }
  };

  const handleScroll1__skills = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const scrollbarHeightPercentage1 = (clientHeight / scrollHeight) * 100;
    setScrollbarHeight__skills(scrollbarHeightPercentage1);
  };

  //getting skills
  const fetchSkills = async () => {
        setLoading(true);
        try {
          const response = await fetch(`https://assista1.ru/api/v1/items/skills?offset=${offset__skills}&limit=${limit__skills}`);
          const data = await response.json();
          const newCountries = data.items.map(([country, id]) => ({ label: country, value: id }));
          setSkills(prevCountries => [...newCountries]); // Добавляем загруженные страны к списку
        } catch (error) {
        }
        setLoading(false);
  };

  useEffect(() => {
    fetchSkills(); // Call fetchCountries whenever searchQuery changes
  }, []);
  
//refreshing tokens
  const refreshTokens = async () => {  
    let user = {
      refresh_token: `${refreshToken}`,
    };
  
    try {
      const response = await fetch('https://assista1.ru/api/v1/auth/refreshToken', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
      });
      if (response.ok) {
        const responseData = await response.json();
        sessionStorage.setItem('accessToken', responseData.access_token)
        setRefreshToken(responseData.refresh_token)     
      } else {
          const data = {
              "status": "unauthorized"
          }
          props.tg.sendData(JSON.stringify(data))
          props.tg.close()
      }
    } catch (error) {
  
    }
  }

  //filtering skills
  const filteredSkills = skills.filter((skill) =>{
     return skill.label.toLowerCase().includes(searchQuerySkills.toLowerCase())
    }
  );

  //check if city was selected when place === offline
  const [checkSelected, setCheckSelected] = useState('')

  const checkCityIfOffline = () => {
      if (place === 'offline' && selectedCity[1] === ''){
          setCheckSelected('false')
        } else if (place === 'offline' && selectedCity[1] !== ''){
          setCheckSelected('')
        }
    }
  useState(() => {
    checkCityIfOffline()
  },[place, price, duration, selectedCity])

  
  return (
    <div className={s.createOrder} style={props.colorB==="light" ? {backgroundColor:"white"} : {backgroundColor:"#232323"} }>  
         <div className={s.createOrder_wrapper}>
          <div className={s.reg}>
              <h1 className={s.createOrder_text} style={props.colorB==='light' ? {color:'black'} : {color:'white'} }>Создание заказа</h1>
          </div>
          <div className={s.title_input}>
            <input
                type={'text'}
                placeholder="Название"
                className={`${s.title_field} `}
                value={title}
                onChange={handleChangeTitle}
                style={props.colorB==='light' ? {backgroundColor:'white', color:'black'} : {backgroundColor:'#373737', color:'#C7C7C7'} }
            />
            {title === '' && (errorFields.title && <span className={s.error_message}>Пожалуйста, введите название</span>)}

        </div>
        <div className={s.description_input}>
            <textarea rows="10" cols="40" maxLength="1000"
                type={'text'}
                placeholder="Техническое задание"
                className={`${s.description_field} ${errorFields.phone && s.error}`}
                value={phone}
                onChange={handleChangePhone}
                style={props.colorB==='light' ? {backgroundColor:'white', color:'black'} : {backgroundColor:'#373737', color:'#C7C7C7'} }
            />
        {phone === '' && (errorFields.phone && <span className={s.error_message}>Пожалуйста, введите описание</span>)}
        </div>

        <div className={`${s.radio_gender}`} style={props.colorB==='light' ? {color:'black'} : {color:'white'} }>
            <div>
                <input type="radio" id="online" name="place" value="online" checked={place === 'online'} onChange={handleGenderChange} />
                <label htmlFor="online" className={s.genderlabel}>Онлайн</label>
            </div>
            <div>
                <input type="radio" id="offline" name="place" value="offline" checked={place === 'offline'} onChange={handleGenderChange} />
                <label htmlFor="offline" className={s.genderlabel}>Оффлайн</label>
            </div>
          </div>

           {place === 'offline' &&
              <div className={s.dropdown_container} ref={dropdownRef}>
                        <input
                          type="text"
                          value={searchQueryCountry}
                          placeholder="Страна (Начните вводить...)"
                          onChange={(e) => {handleInputChangeCountry(e)}}
                          onClick={toggleDropdownCountry}
                          className={`${s.field__form} ${props.colorB === 'light' ? s.light : s.dark}`}
                        />
                        <div className={`${s.dropdown_options} ${props.colorB === 'light' ? s.light : s.dark} ${isOpenCountryForm ? s.open : ''}`}>
                          <div className={s.scroll_container} ref={scrollContainerRef} onScroll={handleScroll}>
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
                            }

                     {place === 'offline' &&
                        <div className={s.dropdown_container2} ref={dropdownRef2}>
                          <input
                            type="text"
                            placeholder="Город (Начните вводить...)"
                            value={searchQueryCity}
                            className={`${s.field__form} ${props.colorB === 'light' ? s.light : s.dark}`}
                            onChange={(e) => {handleInputChangeCity(e)}}
                            onClick={toggleDropdownCity}
                          />
                          <div className={`${s.dropdown_options2} ${props.colorB === 'light' ? s.light : s.dark} ${isOpenCity ? s.open : ''}`}>
                            <div className={s.scroll_container2} ref={scrollContainerRef2} onScroll={handleScroll2}>
                            {cities.map((city, index) => (
                              <div key={index} className={`${s.dropdown_option2} ${props.colorB === 'light' ? s.light : s.dark}`} onClick={() => selectCity([city.label, city.value])}>
                                {city.label}
                              </div>
                            ))}
                          </div>
                          <div className={`${s.scrollbar_12} ${props.colorB === 'light' ? s.light : s.dark}`} style={{ height: `90%`}} />
                        </div>
                          {selectedCity === '' && (errorFields.selectedCity && <span className={s.error_message}>Выберите ваш город</span>)}
                  
                        </div>
                        
                }
          <div className={s.dropdown_container__skills} ref={dropdownRef1__skills}>
          <input
            className={`${s.field__form} ${props.colorB === 'light' ? s.light : s.dark}`}
            type="text"
            value={searchQuerySkills}
            placeholder="Необходимые навыки"
            onClick={toggleDropdownSkillsForm}
            onChange={(e) => setSearchQuerySkills(e.target.value)}
          />
          <div  className={`${s.dropdown_options__skills} ${props.colorB === 'light' ? s.light : s.dark} ${isOpenSkillsForm ? s.open : ''}`}>
            <div  className={s.scroll_container__skills} ref={scrollContainerRef1__skills} onScroll={handleScroll1__skills}>
              {filteredSkills.map((skill, index) => (
                <div key={index} className={`${s.dropdown_option__skills} ${props.colorB === 'light' ? s.light : s.dark}`} >
                <label style={{ display: 'flex', alignItems: 'center', width:'300px' }} onClick={() => selectSkills([skill.label, skill.value])}>
                     <input
                     type="checkbox"
                     className={`${s.inputCheck__skills} ${props.colorB === 'light' ? s.light : s.dark}`}
                     checked={selectedSkills.includes(' ' + skill.label)}

                     onChange={() => selectSkills([skill.label, skill.value])}
                     style={{
                        width: 20,
                        height: 20,
                        backgroundColor: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        marginRight: 10,
                     }}
                     />
                     {selectedSkills.includes(skill.label) && <img className={s.checkbox_icon__1__1} onClick={() => selectSkills([skill.label, skill.value])} src={props.colorB === 'light' ? Vector : Vector} alt="checkmark"></img>}
                    
                      <span style={{ marginLeft: 10, width:'200px' }}>{skill.label}</span>
                 </label>
             </div>
              ))}
            </div>
            <div className={`${s.scrollbar_1__skills} ${props.colorB === 'light' ? s.light : s.dark}`}  />
         
            </div>
          { selectedSkills.length === 0 && (errorFields.selectedSkills && <span className={s.error_message}>Пожалуйста, выберите навыки</span>)}
           </div>
           
            <div className={s.price_input}>
                <h3 style={props.colorB==='light' ? {color:'black'} : {color:'white'} }>Цена</h3>
              <div style={{display:'flex', flexDirection: 'column'}}>   
                      <input
                type='number'
                placeholder=""
                className={`${s.price_inputField} ${errorFields.title && s.error}`}
                value={price}
                onChange={handleChangePrice}
                style={props.colorB==='light' ? {backgroundColor:'white', color:'black'} : {backgroundColor:'#373737', color:'#C7C7C7'} }
            />
           {price === '' && (errorFields.title && <span className={s.error_message}>Пожалуйста, укажите цену</span>)}
              </div>
        </div>

            <div className={s.price_input}>
                <h3 style={props.colorB==='light' ? {color:'black'} : {color:'white'} }>Срок</h3>
            <div style={{display:'flex', flexDirection: 'column'}}>   
            <input
                type='number'
                placeholder=""
                className={`${s.price_inputField} ${errorFields.title && s.error}`}
                value={duration}
                onChange={handleChangeDuration}
                style={props.colorB==='light' ? {backgroundColor:'white', color:'black'} : {backgroundColor:'#373737', color:'#C7C7C7'} }
            />
            {duration === '' && (errorFields.duration && <span className={s.error_message}>Пожалуйста, укажите срок</span>)}         
        </div>
                </div>
          <div className={s.likert_scale}>
            <input className={s.heigh} type="range" min="0" max="100" step="20" value={termScale} onChange={(e)=> {
            setTermScale(e.target.value) 
              }}
             />
          <div className={s.spanCreate} style={props.colorB === 'light' ? { color: 'black' } : { color: 'white' }}>
            <span className={s.span1}>1 дн</span>
            <span className={s.span2}>7 дн</span>
            <span className={s.span3}>30 дн</span>
            <span className={s.span4}>60 дн</span>
            <span className={s.span5}>90 дн</span>
            <span className={s.span6}>90+ дн</span>
          </div>
        </div>

        
           
      <Link to={(selectedCity === '') || (selectedCountry == '') || selectedSkillsId.length !== 0 || duration !== '' ? '/create' : '/create'}>
        <button onClick={() => {
          validateFields()
          if (title !== ''  && phone !== '' && selectedSkillsId.length !== 0 && duration !== ''  && price !== '' && checkSelected != 'false' ) {
            createOrder()
          }
          
        }} className={`${s.createOrder_btn} ${props.colorB === 'light' ? s.light : s.dark}`}>Создать заказ</button>
      </Link>
      </div>
    </div>
  );
}

export default Create;
